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
import DefaultLayout from 'src/layout/DefaultLayout';


const NotiResend = () => {

    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>노티재전송</CCardHeader>
                        <CCardBody>

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}
NotiResend.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default NotiResend;