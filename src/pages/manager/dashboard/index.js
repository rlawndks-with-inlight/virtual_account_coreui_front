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


const Dashboard = () => {
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>가맹점 매출현황</CCardHeader>
            <CCardBody>

            </CCardBody>
          </CCard>
          <CCard className="mb-4">
            <CCardHeader>목록</CCardHeader>
            <CCardBody>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
Dashboard.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default Dashboard;
