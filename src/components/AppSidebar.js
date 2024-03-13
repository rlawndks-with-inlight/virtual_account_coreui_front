import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import AppSidebarNav from './AppSidebarNav'

import SimpleBar from 'simplebar-react'

// sidebar nav config
import navigation from '../_nav'
import { useSettingsContext } from './settings'
import theme from '../theme/theme'
import { useAuthContext } from './auth/useAuthContext'
import { getUserLevelByNumber } from 'src/utils/function'

const AppSidebar = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { themeDnsData } = useSettingsContext();
  const { user } = useAuthContext();

  const handleVisibleChange = (visible) => {
    dispatch({ type: 'set', sidebarShow: visible })
  }

  return (
    <CSidebar
      position="fixed"
      className='bg-dark-2'
      unfoldable={unfoldable}
      visible={sidebarShow}
      style={{ maxWidth: '220px' }}
      onVisibleChange={handleVisibleChange}
    >
      <CSidebarBrand className="d-none d-md-flex" href="/">
        <div style={{ fontWeight: 'bold', color: theme.color.yellow }}>{themeDnsData?.name} {user?.level < 40 ? getUserLevelByNumber(user?.level) : ''}</div>
      </CSidebarBrand>
      <CSidebarNav>
        <AppSidebarNav items={navigation()} />
      </CSidebarNav>
      <CSidebarToggler
        style={{ maxWidth: '220px' }}
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
