import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { useSettingsContext } from './settings'
import theme from '../theme/theme'
import { Content, Row } from './element/styled-componsts'
import { useAuthContext } from './auth/useAuthContext'
import { commarNumber, getUserLevelByNumber } from 'src/utils/function'
import { socket } from 'src/data/data'
import { apiManager } from 'src/utils/api-manager'
import { useRouter } from 'next/router'

const AppHeader = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { themeDnsData } = useSettingsContext();
  const { user } = useAuthContext();
  const [userDeposit, setUserDeposit] = useState({});

  useEffect(() => {
    getUserDeposit();
    socket.on('message', (msg) => {
      let { method, data, brand_id, title } = msg;
      if (brand_id == themeDnsData?.id && (user?.level >= 40 || (user?.id == data?.user_id))) {
        getUserDeposit();
      }
    });
  }, [])

  const getUserDeposit = async () => {
    if (user?.level < 40) {
      let data = await apiManager('auth/deposit', 'get',);
      setUserDeposit(data);
    }
  }

  return (
    <CHeader position="sticky" className="mb-4 bg-dark-2" style={{ borderBottom: 'none' }}>
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" style={{ color: '#fff' }} />
        </CHeaderToggler>
        <Content style={{ color: '#fff' }}>
          {user?.level < 40 &&
            <>
              <Row style={{ columnGap: '0.1rem', cursor: 'pointer' }} onClick={() => {
                router.push('/settle/list');
              }}>
                <div>보유정산금</div>
                <div style={{ color: 'red' }}>{commarNumber(userDeposit?.settle_amount)}</div>
                <div>원</div>
              </Row>
            </>}
          <Row>
            <div style={{ color: theme.color.yellow }}>{user?.nickname}</div>
            <div>님 로그인</div>
          </Row>
        </Content>
        <CHeaderBrand className="mx-auto d-md-none" href="/">
          <div style={{ fontWeight: 'bold', color: theme.color.yellow }}>{themeDnsData?.name} {user?.level < 40 ? getUserLevelByNumber(user?.level) : ''}</div>
        </CHeaderBrand>
      </CContainer>
      <CContainer fluid style={{ borderTop: '1px solid hsla(0,0%,100%,.075)', paddingTop: '8px' }}>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
