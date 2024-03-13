

import Head from 'next/head';
import '../../styles/globals.css'
import '../scss/style.scss'
import { AuthProvider } from 'src/components/auth/JwtContext';
import { SettingsProvider } from 'src/components/settings';
import { Provider } from 'react-redux';
import store from 'src/store';

const App = (props) => {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <Provider store={store}>
        <AuthProvider>
          <SettingsProvider>
            {getLayout(<Component {...pageProps} />)}
          </SettingsProvider>
        </AuthProvider>
      </Provider>
    </>
  );
}

export default App
