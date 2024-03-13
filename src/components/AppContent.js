import React, { Suspense, useEffect } from 'react'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import { AuthProvider } from './auth/JwtContext'
import { useAuthContext } from './auth/useAuthContext'

const AppContent = () => {

  return (
    <CContainer style={{ maxWidth: '100%' }}>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default AppContent
