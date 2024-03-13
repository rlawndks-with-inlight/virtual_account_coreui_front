import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CFormInput,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { Icon } from '@iconify/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from 'src/components/auth/useAuthContext';
import { Col, Content, Label, Row } from 'src/components/element/styled-componsts';
import DefaultLayout from 'src/layout/DefaultLayout';
import { apiManager } from 'src/utils/api-manager';


const ChangePassword = () => {

    const { user } = useAuthContext();

    const [item, setItem] = useState({
        password: '',
        new_password: '',
        new_password_check: '',
    })

    const onSave = async () => {
        if (
            !item.password ||
            !item.new_password ||
            !item.new_password_check
        ) {
            alert('필수값을 입력해 주세요.');
            return;
        }
        if (item.new_password != item.new_password_check) {
            alert('변경 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (window.confirm('정말로 변경 하시겠습니까?')) {
            let result = await apiManager('auth/change-pw', 'update', item);
            if (result) {
                alert('성공적으로 저장되었습니다.');
                window.location.reload();
            }
        }
    }
    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>비밀번호변경</CCardHeader>
                        <CCardBody>
                            <Col style={{ rowGap: '1rem' }}>
                                <Content>
                                    <Label>이름</Label>
                                    <Row>
                                        <CFormInput size='sm' className='content-input' disabled value={`${user?.nickname}`} />
                                    </Row>
                                </Content>
                                <Content>
                                    <Label>아이디</Label>
                                    <Row>
                                        <CFormInput size='sm' className='content-input' disabled value={`${user?.user_name}`} />
                                    </Row>
                                </Content>
                                <Content>
                                    <Label style={{ maxWidth: '316px' }}>
                                        이전 비밀번호
                                    </Label>
                                    <Row>
                                        <div style={{ color: 'red', padding: '0 4px' }}>*</div>
                                        <CFormInput size='sm' className='content-input' type='password' value={item.password} placeholder='이전 비밀번호를 입력하세요.'
                                            onChange={(e) => {
                                                setItem({
                                                    ...item,
                                                    password: e.target.value
                                                })
                                            }} />
                                    </Row>
                                </Content>
                                <Content>
                                    <Label style={{ maxWidth: '316px' }}>변경 비밀번호</Label>
                                    <Row>
                                        <div style={{ color: 'red', padding: '0 4px' }}>*</div>
                                        <CFormInput size='sm' className='content-input' type='password' value={item.new_password} placeholder='변경 비밀번호를 입력하세요.'
                                            onChange={(e) => {
                                                setItem({
                                                    ...item,
                                                    new_password: e.target.value
                                                })
                                            }} />
                                    </Row>
                                </Content>
                                <Content>
                                    <Label style={{ maxWidth: '316px' }}>비밀번호 확인</Label>
                                    <Row>
                                        <div style={{ color: 'red', padding: '0 4px' }}>*</div>
                                        <CFormInput size='sm' className='content-input' type='password' value={item.new_password_check} placeholder='변경 비밀번호를 입력하세요.'
                                            onChange={(e) => {
                                                setItem({
                                                    ...item,
                                                    new_password_check: e.target.value
                                                })
                                            }} />
                                    </Row>
                                </Content>
                                <CButton style={{ marginLeft: 'auto' }} color='warning' size='sm' onClick={onSave}>
                                    <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                                        <Icon icon={'la:dot-circle'} style={{ fontSize: '1rem' }} />
                                        <div>비밀번호 변경</div>
                                    </Row>
                                </CButton>
                            </Col>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}
ChangePassword.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default ChangePassword;