import React from 'react'
import { CFooter } from '@coreui/react'
import { useSettingsContext } from './settings'
import theme from '../theme/theme'

const AppFooter = () => {
  const { themeDnsData } = useSettingsContext();
  return (
    <CFooter className='bg-dark-2' style={{ color: theme.color.blue, borderTop: 'none' }}>
      <div />
      <div className="ms-auto">
        <span className="me-1">COPYRIGHTS ©{themeDnsData?.name}. CO., LTD. ALL RIGHT RESERVED.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
