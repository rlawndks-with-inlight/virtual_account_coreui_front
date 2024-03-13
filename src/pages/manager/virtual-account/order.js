import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { useAuthContext } from 'src/components/auth/useAuthContext';
import { Col, Content, Label, Row } from 'src/components/element/styled-componsts';
import { useSettingsContext } from 'src/components/settings';
import DefaultLayout from 'src/layout/DefaultLayout';
import theme from 'src/theme/theme';


const VirtualAccountOrder = () => {

    const { user } = useAuthContext();
    const { themeDnsData } = useSettingsContext();
    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>가맹점 정보</CCardHeader>
                        <CCardBody>
                            <Col style={{ rowGap: '1rem' }}>
                                <Content>
                                    <Label>가맹점명</Label>
                                    <Row>{user?.nickname}</Row>
                                </Content>
                                <Content>
                                    <Label>가맹점 아이디</Label>
                                    <Row>{user?.user_name}</Row>
                                </Content>
                                <Content>
                                    <Label>MID</Label>
                                    <Row>{user?.mid}</Row>
                                </Content>
                            </Col>
                        </CCardBody>
                    </CCard>
                    <CCard className="mb-4">
                        <CCardHeader>발급 정보</CCardHeader>
                        <CCardBody>
                            <Col style={{ rowGap: '1rem' }}>
                                <Content>
                                    <Label>API 가이드 문서 주소</Label>
                                    <Row style={{ color: theme.color.yellow, cursor: 'pointer' }}>{'https://' + themeDnsData?.dns + `/api-docs`}</Row>
                                </Content>
                                <Content>
                                    <Label>제공된 발급 API_URL</Label>
                                    <Row style={{ color: 'red', cursor: 'pointer' }}>{'https://' + themeDnsData?.dns + `/virtual-account/${user?.mid}`}</Row>
                                </Content>
                            </Col>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}
VirtualAccountOrder.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default VirtualAccountOrder;