import React from 'react'


import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import theme from '../theme/theme'

const AppBreadcrumb = () => {
  // const router = 
  // const currentLocation = useLocation().pathname

  // const getRouteName = (pathname, routes) => {
  //   const currentRoute = routes.find((route) => route.path === pathname)
  //   return currentRoute ? currentRoute.name : false
  // }

  // const getBreadcrumbs = (location) => {
  //   const breadcrumbs = []
  //   location.split('/').reduce((prev, curr, index, array) => {
  //     const currentPathname = `${prev}/${curr}`
  //     const routeName = getRouteName(currentPathname, routes)
  //     routeName &&
  //       breadcrumbs.push({
  //         pathname: currentPathname,
  //         name: routeName,
  //         active: index + 1 === array.length ? true : false,
  //       })
  //     return currentPathname
  //   })
  //   return breadcrumbs
  // }

  //  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2 breadcrumb" style={{ color: '#fff' }}>
      <CBreadcrumbItem style={{ color: theme.color.yellow, textDecoration: 'none' }}>홈</CBreadcrumbItem>
      {/* {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : {})}
            key={index}
            style={{ color: theme.color.yellow, }}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })} */}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
