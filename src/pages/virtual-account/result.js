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
    CFormSelect,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/components/auth/useAuthContext';
import { Col, Content, Label, Row } from 'src/components/element/styled-componsts';
import { useSettingsContext } from 'src/components/settings';
import BlankLayout from 'src/layout/BlankLayout';
import { apiManager, apiServer } from 'src/utils/api-manager';
import { bankCodeList, virtualAccountUserTypeList } from 'src/utils/format';
import { onlyNumberText } from 'src/utils/function';

const VirtualAccountResult = () => {
    const { themeDnsData } = useSettingsContext();

    const router = useRouter();

    const [mchtList, setMchtList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState({})
    useEffect(() => {
        settingPage();
    }, [])

    const settingPage = async () => {
        let data = await apiManager(`virtual-accounts/0`, 'list', {
            ci: router.query?.ci
        })
        setItem(data);
    }
    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4" style={{ maxWidth: '700px', margin: '2rem auto' }}>
                        <CCardBody>
                            <Content>
                                <Label>은행사</Label>
                                <Row>{_.find(bankCodeList(), { value: item?.virtual_bank_code })?.label ?? "---"}</Row>
                            </Content>
                            <Content>
                                <Label>계좌번호</Label>
                                <Row>{item?.virtual_acct_num}</Row>
                            </Content>
                            <Content>
                                <Label>예금주명</Label>
                                <Row>{item?.virtual_acct_name}</Row>
                            </Content>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}
VirtualAccountResult.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
export default VirtualAccountResult;