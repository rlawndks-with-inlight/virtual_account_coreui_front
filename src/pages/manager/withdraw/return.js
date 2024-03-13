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
    CModal,
    CModalBody,
    CModalContent,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CProgress,
    CRow,
    CSpinner,
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
import theme from 'src/theme/theme';
import { apiManager, apiServer } from 'src/utils/api-manager';
import { bankCodeList } from 'src/utils/format';
import { commarNumber, commarNumberInput, onlyNumberText } from 'src/utils/function';


const Return = () => {
    const { user } = useAuthContext();
    const { themeDnsData } = useSettingsContext();


    const [loading, setLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const [withdraws, setWithdraws] = useState([]);
    const [virtualAccounts, setVirtualAccounts] = useState([]);
    const [item, setItem] = useState({
        note: '',
    })
    const [keyword, setKeyword] = useState("");
    const [errorAlert, setErrorAlert] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [selectVirtualAccount, setSelectVirtualAccount] = useState({});
    useEffect(() => {
        setKeyword("");
        setSelectVirtualAccount({});
    }, [openAddModal])
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
        let virtual_accounts = await apiManager('virtual-accounts', 'list', {
            mcht_id: user?.id,
            status: 0,
        });
        setVirtualAccounts(virtual_accounts?.content ?? []);
        setLoading(false);
    }
    const onSave = async () => {
        if (window.confirm('출금요청 하시겠습니까?')) {
            setPageLoading(true);
            let withdraw_list = [...withdraws];
            for (var i = 0; i < withdraw_list.length; i++) {
                if (withdraw_list[i]?.is_confirm == 1) {
                    continue;
                }
                let result = undefined;
                if (themeDnsData?.setting_obj?.api_withdraw_version > 0) {
                    if (!withdraw_list[i]?.withdraw_bank_code && !withdraw_list[i]?.deposit_bank_code) {
                        continue;
                    }
                    result = await apiServer(`${process.env.API_SERVER}/api/withdraw/v${themeDnsData?.setting_obj?.api_withdraw_version}`, 'create', {
                        api_key: themeDnsData?.api_key,
                        mid: user?.mid,
                        withdraw_amount: withdraw_list[i]?.withdraw_amount,
                        note: withdraw_list[i]?.note,
                        withdraw_bank_code: withdraw_list[i]?.withdraw_bank_code || withdraw_list[i]?.deposit_bank_code,
                        withdraw_acct_num: withdraw_list[i]?.withdraw_acct_num || withdraw_list[i]?.deposit_acct_num,
                        withdraw_acct_name: withdraw_list[i]?.withdraw_acct_name || withdraw_list[i]?.deposit_acct_name,
                        guid: withdraw_list[i]?.guid,
                        pay_type: 'return',
                        otp_num: item?.otp_num,
                        api_sign_val: item?.api_sign_val,
                    });
                } else {
                    result = await apiManager('withdraws', 'create', {
                        withdraw_amount: withdraw_list[i]?.withdraw_amount,
                        user_id: user?.id,
                        virtual_account_id: withdraw_list[i]?.id,
                        pay_type: 20,
                        note: withdraw_list[i]?.note,
                    });
                }
                if (result) {
                    withdraw_list[i].is_error = 0;
                    withdraw_list[i].is_confirm = 1;
                } else {
                    withdraw_list[i].is_error = 1;
                }
            }
            let is_exist_error = false;
            let withdraw_result_list = [];
            for (var i = 0; i < withdraw_list.length; i++) {
                if (withdraw_list[i]?.is_confirm != 1) {
                    withdraw_result_list.push(withdraw_list[i]);
                }
                if (withdraw_list[i]?.is_error == 1) {
                    is_exist_error = true;
                }
            }
            setWithdraws(withdraw_result_list);
            setTimeout(() => {
                setPageLoading(false);
                if (is_exist_error) {
                    setErrorAlert(true);
                }
            }, 1000);
        }
    }
    const getVirtualAccountItem = (vir_acct) => {
        return <CTableRow style={{ background: 'transparent', textAlign: 'center', cursor: 'pointer' }} onClick={() => {
            setSelectVirtualAccount(vir_acct);
        }}>
            <CTableHeaderCell>{_.find(bankCodeList(), { value: vir_acct?.deposit_bank_code })?.label}</CTableHeaderCell>
            <CTableHeaderCell>{vir_acct?.deposit_acct_num}</CTableHeaderCell>
            <CTableHeaderCell>{vir_acct?.phone_num}</CTableHeaderCell>
            <CTableHeaderCell>{vir_acct?.deposit_acct_name}</CTableHeaderCell>
        </CTableRow>
    }
    return (
        <>
            <CModal visible={openAddModal} onClose={() => {
                setOpenAddModal(false);
            }}>
                <CModalHeader>
                    <CModalTitle>반환 계좌 추가</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Col style={{ rowGap: '0.5rem' }}>
                        <CFormInput
                            value={keyword}
                            placeholder='휴대폰번호, 예금주 검색'
                            onChange={(e) => {
                                setKeyword(e.target.value);
                            }}
                        />
                        <CTable style={{ fontSize: '12px', marginBottom: '0' }} hover>
                            <CTableHead scope="col" style={{ whiteSpace: 'nowrap', border: '1px solid #c8ced3', textAlign: 'center', background: 'transparent' }}>
                                <CTableHeaderCell>입금은행</CTableHeaderCell>
                                <CTableHeaderCell>입금계좌번호</CTableHeaderCell>
                                <CTableHeaderCell>휴대폰번호</CTableHeaderCell>
                                <CTableHeaderCell>예금주</CTableHeaderCell>
                            </CTableHead>
                            <CTableBody style={{ background: 'transparent' }}>
                                {virtualAccounts.map((vir_acct, idx) => (
                                    <>
                                        {selectVirtualAccount?.id > 0 ?
                                            <>
                                                {selectVirtualAccount?.id == vir_acct?.id &&
                                                    <>
                                                        {getVirtualAccountItem(vir_acct)}
                                                    </>}
                                            </>
                                            :
                                            <>
                                                {(vir_acct?.phone_num.includes(keyword) || vir_acct?.deposit_acct_name.includes(keyword)) &&
                                                    <>
                                                        {getVirtualAccountItem(vir_acct)}
                                                    </>}
                                            </>}
                                    </>
                                ))}
                            </CTableBody>
                        </CTable>
                        {selectVirtualAccount?.id > 0 &&
                            <>
                                <Content>
                                    <div>입금은행 : </div>
                                    <CFormInput size='sm' className='content-input' value={_.find(bankCodeList(), { value: selectVirtualAccount?.deposit_bank_code })?.label}
                                        disabled
                                    />
                                </Content>
                                <Content>
                                    <div>계좌번호 : </div>
                                    <CFormInput size='sm' className='content-input' value={selectVirtualAccount?.deposit_acct_num}
                                        disabled
                                    />
                                </Content>
                                <Content>
                                    <div>예금주명 : </div>
                                    <CFormInput size='sm' className='content-input' value={selectVirtualAccount?.deposit_acct_name}
                                        disabled
                                    />
                                </Content>
                                <Content>
                                    <div>입금금액 : </div>
                                    <CFormInput size='sm' className='content-input' value={commarNumberInput(selectVirtualAccount?.withdraw_amount)}
                                        onChange={(e) => {
                                            setSelectVirtualAccount({
                                                ...selectVirtualAccount,
                                                withdraw_amount: onlyNumberText(e.target.value)
                                            })
                                        }}
                                    />
                                </Content>
                                <CButton style={{ marginLeft: 'auto' }} color='warning' size='sm' onClick={() => {
                                    let withdraw_list = [...withdraws];
                                    withdraw_list.push(selectVirtualAccount);
                                    setWithdraws(withdraw_list);
                                    setOpenAddModal(false);
                                }}>
                                    <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                                        <Icon icon={'la:dot-circle'} style={{ fontSize: '1rem' }} />
                                        <div>추가하기</div>
                                    </Row>
                                </CButton>
                            </>}
                    </Col>
                </CModalBody>
                <CModalFooter>
                    <CButton color="dark" onClick={() => {
                        setOpenAddModal(false);
                    }}>
                        닫기
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal visible={pageLoading} alignment='center' style={{ background: 'transparent' }}  >
                <CSpinner style={{ margin: 'auto', color: theme.color.yellow }} />
            </CModal>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>반환 요청</CCardHeader>
                        <CCardBody>
                            <Col style={{ rowGap: '1rem' }}>
                                <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                                    <CButtonGroup>
                                        <CButton color='danger' style={{ borderRadius: '0', lineHeight: '1.5', padding: '.5rem .5rem' }} />
                                    </CButtonGroup>
                                    <div style={{ color: 'blue' }}>은행점검시간에는 출금 요청이 불가능합니다. 은행점검시간 (※한국시간기준 출금 : 23:20 ~ 00:30, 입금 : 23:30 ~ 00:10 )</div>
                                </Row>
                                <CTable style={{ fontSize: '12px', marginBottom: '0' }} hover>
                                    <CTableHead scope="col" style={{ whiteSpace: 'nowrap', border: '1px solid #c8ced3', textAlign: 'center', background: 'transparent' }}>
                                        <CTableHeaderCell>입금은행</CTableHeaderCell>
                                        <CTableHeaderCell>입금계좌번호</CTableHeaderCell>
                                        <CTableHeaderCell>예금주</CTableHeaderCell>
                                        <CTableHeaderCell>입금금액</CTableHeaderCell>
                                        <CTableHeaderCell>계좌삭제</CTableHeaderCell>
                                    </CTableHead>
                                    <CTableBody>
                                        {withdraws.map((vir_acct, idx) => (
                                            <>
                                                <CTableRow style={{ textAlign: 'center' }}>
                                                    <CTableHeaderCell>{_.find(bankCodeList(), { value: vir_acct?.deposit_bank_code })?.label}</CTableHeaderCell>
                                                    <CTableHeaderCell>{vir_acct?.deposit_acct_num}</CTableHeaderCell>
                                                    <CTableHeaderCell>{vir_acct?.deposit_acct_name}</CTableHeaderCell>
                                                    <CTableHeaderCell>{commarNumber(vir_acct?.withdraw_amount)}</CTableHeaderCell>
                                                    <CTableHeaderCell>
                                                        <CButton color='danger' size='sm' style={{ color: '#fff' }} onClick={() => {
                                                            let withdraw_list = [...withdraws];
                                                            withdraw_list.splice(idx, 1);
                                                            setWithdraws(withdraw_list);
                                                        }}>삭제</CButton>
                                                    </CTableHeaderCell>
                                                </CTableRow>
                                            </>
                                        ))}
                                    </CTableBody>
                                </CTable>
                                <CButton style={{ marginLeft: 'auto' }} color='warning' size='sm' onClick={() => {
                                    setOpenAddModal(true);
                                }}>
                                    <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                                        <Icon icon={'ic:sharp-add'} style={{ fontSize: '1rem' }} />
                                        <div>계좌추가</div>
                                    </Row>
                                </CButton>
                                <hr style={{ margin: '0' }} />
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
                                    <Row> {commarNumber(_.sum(withdraws.map(itm => { return parseInt(itm?.withdraw_amount ?? 0) })) + (themeDnsData?.withdraw_fee_type == 0 ? item?.withdraw_fee : 0) * withdraws.length)} 원</Row>
                                </Content>
                                <Content>
                                    <Label>출금후 보유정산금</Label>
                                    <Row>   {commarNumber(item?.settle_amount - (_.sum(withdraws.map(itm => { return parseInt(itm?.withdraw_amount ?? 0) })) + (themeDnsData?.withdraw_fee_type == 0 ? item?.withdraw_fee : 0) * withdraws.length))} 원</Row>
                                </Content>
                                <Content>
                                    <Label>출금 가능 금액</Label>
                                    <Row>   {commarNumber(item?.settle_amount - item?.withdraw_fee * withdraws.length)} 원</Row>
                                </Content>
                                <Content>
                                    <Label>출금 요청금</Label>
                                    <Col style={{ rowGap: '0.2rem' }}>
                                        <Row> 최소 요청금 : {commarNumber(item?.min_withdraw_price)}원 / 최소 잔액 : {commarNumber(item?.min_withdraw_remain_price)}원</Row>
                                        <Row style={{ alignItems: 'center', columnGap: '0.5rem' }}>
                                            <CFormInput
                                                disabled
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
Return.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default Return;