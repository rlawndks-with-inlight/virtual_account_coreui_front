import React from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'

import { CBadge } from '@coreui/react'
import { Icon } from '@iconify/react'
import { useAuthContext } from './auth/useAuthContext'

const AppSidebarNav = ({ items }) => {
  const router = useRouter()
  const { logout } = useAuthContext()

  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const navItem = (item, index) => {
    const { component: Component, name, badge, icon, style, ...rest } = item
    return (
      <div style={{ ...style }} onClick={async () => {
        if (rest.to == '/logout') {
          await logout();
          window.location.href = '/login'
        }
      }} key={index}>
        <Component
          {...(rest.to &&
            !rest.items && {
            as: 'a',
            href: rest.to,
          })}
          key={index}
          {...rest}
        >
          {navLink(name, icon, badge)}
        </Component>
      </div>
    )
  }

  const navGroup = (item, index) => {
    const { component: Component, name, icon, to, ...rest } = item
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={router.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    )
  }

  return (
    <>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default AppSidebarNav
