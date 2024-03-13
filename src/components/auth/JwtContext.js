import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios from 'axios';
import localStorageAvailable from '../../utils/localStorageAvailable'
//
import { toast } from 'react-hot-toast';
// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {

  const [state, dispatch] = useReducer(reducer, initialState);


  const initialize = useCallback(async () => {
    let user = undefined;
    try {
      const { data: response } = await axios.get(`/api/auth`);

      if (response?.data?.id > 0) {
        user = response?.data;
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
    return user;
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (user_name, user_pw, otp_num) => {
    if (!user_name || !user_pw) {
      alert('필수값을 입력해 주세요.');
      return false;
    }
    try {
      const { data: response } = await axios.post(`/api/auth/sign-in`, {
        user_name,
        user_pw,
        otp_num,
      });
      const user = response.data;
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    } catch (err) {
      alert(err?.response?.data?.message)
      return false;
    }
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);
  // LOGOUT
  const logout = useCallback(async () => {
    const response = await axios.post('/api/auth/sign-out');
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      register,
      logout,
      initialize,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
