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


const BlackListList = () => {

    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>블랙리스트 목록</CCardHeader>
                        <CCardBody>

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}
BlackListList.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default BlackListList;