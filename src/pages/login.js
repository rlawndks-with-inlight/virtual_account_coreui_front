import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useAuthContext } from 'src/components/auth/useAuthContext'
import { useSettingsContext } from 'src/components/settings'
import { useRouter } from 'next/router'
import BlankLayout from 'src/layout/BlankLayout'

const Login = () => {

  const { login, user } = useAuthContext();
  const router = useRouter();
  const { themeDnsData } = useSettingsContext();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [optNum, setOptNum] = useState("");


  useEffect(() => {
    if (user?.level >= 10) {
      router.push('/manager/dashboard');
    }
    setLoading(false);
  }, [user])

  const onSubmit = async () => {
    let user = await login(username, password, optNum);
    if (user) {
      router.push('/manager/dashboard');
    }
  };
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center" >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>{themeDnsData?.name}</h1>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="아이디" autoComplete="username"
                        onChange={(e) => {
                          setUsername(e.target.value)
                        }}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="비밀번호"
                        autoComplete="current-password"
                        onKeyPress={(e) => {
                          if (e.key == 'Enter') {
                            onSubmit();
                          }
                        }}
                        onChange={(e) => {
                          setPassword(e.target.value)
                        }}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12} style={{ display: 'flex' }}>
                        <CButton color="primary" className="px-4" style={{ marginLeft: 'auto' }} onClick={onSubmit}>
                          로그인
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}
Login.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
export default Login
