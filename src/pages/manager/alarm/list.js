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

const AlarmList = () => {

    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>알림 내역</CCardHeader>
                        <CCardBody>

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}
AlarmList.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default AlarmList;