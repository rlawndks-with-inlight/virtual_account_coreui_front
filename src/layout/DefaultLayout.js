import React, { useEffect } from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useSelector, useDispatch } from 'react-redux'
import { useAuthContext } from 'src/components/auth/useAuthContext';
import { CContainer } from '@coreui/react';
import { useRouter } from 'next/router';
import { useSettingsContext } from 'src/components/settings';

const DefaultLayout = ({ children }) => {
  const router = useRouter();;
  const { user, initialize } = useAuthContext();
  const { themeDnsData } = useSettingsContext();
  useEffect(() => {
    checkAuth();
  }, [router.asPath])

  const checkAuth = async () => {
    let result = await initialize();
    if (result?.level < 10 || !result) {
      router.push('/login')
    }
  }

  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const getPaddingLeft = () => {
    if (!sidebarShow) {
      return '0';
    }
    if (unfoldable) {
      return '64px'
    }
    return '220px';
  }
  return (
    <>
      {user && themeDnsData?.id > 0 &&
        <>
          <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-dark" style={{ paddingLeft: getPaddingLeft() }}>
              <AppHeader />
              <div className="body flex-grow-1 px-3">
                <CContainer style={{ maxWidth: '100%' }}>
                  {children}
                </CContainer>
              </div>
              <AppFooter />
            </div>
          </div>
        </>}
    </>
  )
}

export default DefaultLayout
