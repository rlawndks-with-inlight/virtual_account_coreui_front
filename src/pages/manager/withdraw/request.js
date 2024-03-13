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
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/components/auth/useAuthContext';
import { Col, Content, Label, Row } from 'src/components/element/styled-componsts';
import { useSettingsContext } from 'src/components/settings';
import DefaultLayout from 'src/layout/DefaultLayout';
import { apiManager, apiServer } from 'src/utils/api-manager';
import { bankCodeList } from 'src/utils/format';
import { commarNumber, commarNumberInput, onlyNumberText } from 'src/utils/function';


const Withdraw = () => {
    const { user } = useAuthContext();
    const { themeMode, themeDnsData } = useSettingsContext();

    const [pageLoading, setPageLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState({
        note: '',
    })
    useEffect(() => {
        settingPage();
    }, [])
    const settingPage = async () => {
        let api_sign_val = '';
        if (themeDnsData?.is_use_sign_key == 1) {
            api_sign_val = await apiManager('auth/sign-key', 'get',);
            api_sign_val = api_sign_val?.api_sign_val;
        }
        let data = await apiManager('auth/deposit', 'get',);
        setItem({
            ...item,
            ...data,
            api_sign_val: api_sign_val,
        });
        setLoading(false);
    }
    const onSave = async () => {
        if (window.confirm('출금요청 하시겠습니까?')) {
            let result = undefined
            if (themeDnsData?.setting_obj?.api_withdraw_version > 0) {
                result = await apiServer(`${process.env.API_URL}/api/withdraw/v${themeDnsData?.setting_obj?.api_withdraw_version}`, 'create', {
                    api_key: themeDnsData?.api_key,
                    mid: user?.mid,
                    withdraw_amount: item?.withdraw_amount,
                    note: item?.note,
                    withdraw_bank_code: item?.withdraw_bank_code,
                    withdraw_acct_num: item?.withdraw_acct_num,
                    withdraw_acct_name: item?.withdraw_acct_name,
                    pay_type: 'withdraw',
                    otp_num: item?.otp_num,
                    guid: item?.guid,
                    api_sign_val: item?.api_sign_val,
                });
            } else {
                result = await apiManager('withdraws', 'create', {
                    withdraw_amount: item?.withdraw_amount,
                    user_id: user?.id,
                    note: item?.note,
                    pay_type: 5,
                });
            }
            if (result) {
                alert("성공적으로 저장 되었습니다.");
                settingPage();
                // router.push('/manager/withdraw');
            }
        }
    }
    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>출금 요청</CCardHeader>
                        <CCardBody>
                            <Col style={{ rowGap: '1rem' }}>
                                <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                                    <CButtonGroup>
                                        <CButton color='danger' style={{ borderRadius: '0', lineHeight: '1.5', padding: '.5rem .5rem' }} />
                                    </CButtonGroup>
                                    <div style={{ color: 'blue' }}>은행점검시간에는 출금 요청이 불가능합니다. 은행점검시간 (※한국시간기준 출금 : 23:20 ~ 00:30, 입금 : 23:30 ~ 00:10 )</div>
                                </Row>
                                <Content>
                                    <Label>입금계좌</Label>
                                    <Row>
                                        <CFormInput size='sm' className='content-input' disabled value={`${_.find(bankCodeList('withdraw'), { value: item?.settle_bank_code })?.label} ${item?.settle_acct_num} ${item?.settle_acct_name}`} />
                                    </Row>
                                </Content>
                                <Content>
                                    <Label>현재 보유정산금</Label>
                                    <Row> {commarNumber(item?.settle_amount)} 원</Row>
                                </Content>
                                <Content>
                                    <Label>출금 수수료</Label>
                                    <Row> {commarNumber(item?.withdraw_fee)} 원</Row>
                                </Content>
                                <Content>
                                    <Label>차감 보유정산금</Label>
                                    <Row>  {commarNumber(parseInt(item?.withdraw_amount) + (themeDnsData?.withdraw_fee_type == 0 ? item?.withdraw_fee : 0))} 원</Row>
                                </Content>
                                <Content>
                                    <Label>출금후 보유정산금</Label>
                                    <Row>  {commarNumber(item?.settle_amount - item?.withdraw_amount - (themeDnsData?.withdraw_fee_type == 0 ? item?.withdraw_fee : 0))} 원</Row>
                                </Content>
                                <Content>
                                    <Label>출금 가능 금액</Label>
                                    <Row>   {commarNumber(item?.settle_amount - (themeDnsData?.withdraw_fee_type == 0 ? item?.withdraw_fee : 0))}  원</Row>
                                </Content>
                                <Content>
                                    <Label>출금 요청금</Label>
                                    <Col style={{ rowGap: '0.2rem' }}>
                                        <Row> 최소 요청금 : {commarNumber(item?.min_withdraw_price)}원 / 최소 잔액 : {commarNumber(item?.min_withdraw_remain_price)}원</Row>
                                        <Row style={{ alignItems: 'center', columnGap: '0.5rem' }}>
                                            <CFormInput
                                                size='sm'
                                                className='content-input'
                                                value={commarNumberInput(item?.withdraw_amount)}
                                                onChange={(e) => {
                                                    setItem(
                                                        {
                                                            ...item,
                                                            ['withdraw_amount']: onlyNumberText(e.target.value)
                                                        }
                                                    )
                                                }} />
                                            <div>원</div>
                                        </Row>
                                    </Col>
                                </Content>
                                <CButton style={{ marginLeft: 'auto' }} color='warning' size='sm' onClick={onSave}>
                                    <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                                        <Icon icon={'la:dot-circle'} style={{ fontSize: '1rem' }} />
                                        <div>출금 요청하기</div>
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
Withdraw.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default Withdraw;