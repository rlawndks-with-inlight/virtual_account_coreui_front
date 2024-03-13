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
import { Col, Content, Label, Row } from 'src/components/element/styled-componsts';
import DefaultLayout from 'src/layout/DefaultLayout';
import { bankCodeList } from 'src/utils/format';


const AccountCheck = () => {

    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>예금주조회</CCardHeader>
                        <CCardBody>
                            <Col style={{ rowGap: '1rem' }}>
                                <Content>
                                    <Label>입금계좌</Label>
                                    <Row>
                                    </Row>
                                </Content>
                            </Col>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}
AccountCheck.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default AccountCheck;