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
import { apiManager, apiServer } from 'src/utils/api-manager';
import { bankCodeList, virtualAccountUserTypeList } from 'src/utils/format';
import { onlyNumberText } from 'src/utils/function';



const VirtualAccountBankners = () => {

    const { themeDnsData } = useSettingsContext();
    const { user } = useAuthContext();
    const router = useRouter();
    const [mchtList, setMchtList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [blockPage, setBlockPage] = useState(true);
    const [item, setItem] = useState({
        deposit_bank_code: '',
        deposit_acct_num: '',
        deposit_acct_name: '',
        birth: '',
        phone_num: '',
        type: 0,
        user_type: 0,
        business_num: '',
        company_name: '',
        ceo_name: '',
        company_phone_num: '',
    })
    const [currentTab, setCurrentTab] = useState(0);

    const tab_list = [
        {
            value: 0,
            label: '가상계좌발급'
        },
        {
            value: 1,
            label: '가상계좌발급정보'
        },
    ]
    useEffect(() => {
        settingPage();
    }, [])
    const settingPage = async () => {
        let mcht_list = await apiManager(`users`, 'list', {
            level: 10,
        })
        let data = item;
        setMchtList(mcht_list?.content ?? []);
        data.mid = router.query?.mid || user?.mid;
        if (!(user?.level >= 40) && !router.query?.mid && !user?.mid && !router.query?.id) {
            return;
        }
        if (router.query?.id) {
            data = await apiManager('virtual-accounts', 'get', {
                id: router.query.id
            })
        }
        if (router.query?.mid) {
            let mcht = await apiManager(`users/mid/${router.query?.mid}`, 'list',)
            if (mcht?.virtual_acct_link_status != 0) {
                return;
            }
        }
        setItem(data);
        setBlockPage(false);
        setLoading(false);
    }
    const onSave = async () => {
        let result = undefined
        result = await apiServer(`${process.env.API_URL}/api/acct/v1/issuance`, 'create', { ...item, api_key: themeDnsData?.api_key, mid: router.query?.mid, });
        if (result?.tid) {
            alert("성공적으로 발급 되었습니다.");
            router.push(`/virtual-account/result/${result?.ci}`);
        }
    }
    const oneWonCertification = async () => {
        setLoading(true);
        let result = await apiServer(`${process.env.API_URL}/api/acct/v1`, 'create', {
            mid: item?.mid,
            bank_code: item?.deposit_bank_code,
            account: item?.deposit_acct_num,
            name: item?.deposit_acct_name,
            birth: item?.birth,
            phone_num: item?.phone_num,
            guid: item?.guid,
            api_key: themeDnsData?.api_key,
            user_type: item?.user_type,
            business_num: item?.business_num,
            company_name: item?.company_name,
            ceo_name: item?.ceo_name,
            company_phone_num: item?.company_phone_num,
        });
        let data = item;
        data.guid = result?.guid;
        if (result?.tid) {
            alert('성공적으로 발송 되었습니다.');
            data = {
                ...data,
                is_send_one_won_check: true,
                tid: result?.tid,
            }
        }
        setItem(data);
        setLoading(false);
    }
    const checkOneWonCertification = async () => {
        let result = await apiServer(`${process.env.API_URL}/api/acct/v1/check`, 'create', {
            mid: item?.mid,
            tid: item?.tid,
            vrf_word: item?.vrf_word,
            guid: item?.guid,
            api_key: themeDnsData?.api_key,
        });
        if (result?.tid) {
            alert('성공적으로 인증 되었습니다.');
            setItem({
                ...item,
                is_check_bank: true
            })
        }
    }

    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4" style={{ maxWidth: '700px', margin: '2rem auto' }}>
                        <CCardBody>
                            <Col style={{ rowGap: '1rem' }}>
                                {user?.level >= 40 &&
                                    <>
                                        <Content>
                                            <Label>가맹점선택</Label>
                                            <CFormSelect size="sm"
                                                value={item?.mid}
                                                onChange={(e) => {
                                                    setItem({
                                                        ...item,
                                                        mid: e.target.value,
                                                    })
                                                }}>
                                                {mchtList.map(mcht => {
                                                    return <option value={mcht?.mid}>{`${mcht?.nickname}(${mcht?.user_name})`}</option>
                                                })}
                                            </CFormSelect>
                                        </Content>
                                        <Content>
                                            <Label>MID</Label>
                                            <Row>{item.mid}</Row>
                                        </Content>
                                    </>}
                                <Content>
                                    <Label>사용자구분</Label>
                                    <CFormSelect size="sm"
                                        value={item?.user_type}
                                        style={{ width: '100%' }}
                                        onChange={(e) => {
                                            let obj = {
                                                ...item,
                                                user_type: e.target.value,
                                            }
                                            if (e.target.value == 0) {
                                                obj = {
                                                    ...obj,
                                                    business_num: '',
                                                    company_name: '',
                                                    ceo_name: '',
                                                    company_phone_num: '',
                                                }
                                            }
                                            setItem(obj)
                                        }}>
                                        {virtualAccountUserTypeList.map(itm => {
                                            return <option value={itm.value}>{itm.label}</option>
                                        })}
                                    </CFormSelect>
                                </Content>
                                {(item.user_type == 1 || item.user_type == 2) &&
                                    <>
                                        <Content>
                                            <Label>사업자등록번호</Label>
                                            <CFormInput
                                                value={item.business_num}
                                                onChange={(e) => {
                                                    setItem(
                                                        {
                                                            ...item,
                                                            ['business_num']: onlyNumberText(e.target.value)
                                                        }
                                                    )
                                                }}
                                            />
                                        </Content>
                                        <Content>
                                            <Label>회사명(상호)</Label>
                                            <CFormInput
                                                value={item.company_name}
                                                onChange={(e) => {
                                                    setItem(
                                                        {
                                                            ...item,
                                                            ['company_name']: e.target.value
                                                        }
                                                    )
                                                }}
                                            />
                                        </Content>
                                        <Content>
                                            <Label>대표자명</Label>
                                            <CFormInput
                                                value={item.ceo_name}
                                                onChange={(e) => {
                                                    setItem(
                                                        {
                                                            ...item,
                                                            ['ceo_name']: e.target.value
                                                        }
                                                    )
                                                }}
                                            />
                                        </Content>
                                        <Content>
                                            <Label>회사 전화번호</Label>
                                            <CFormInput
                                                value={item.company_phone_num}
                                                onChange={(e) => {
                                                    setItem(
                                                        {
                                                            ...item,
                                                            ['company_phone_num']: onlyNumberText(e.target.value)
                                                        }
                                                    )
                                                }}
                                            />
                                        </Content>
                                    </>}
                                <Content>
                                    <Label>생년월일</Label>
                                    <CFormInput
                                        value={item.birth}
                                        placeholder="19990101"
                                        onChange={(e) => {
                                            setItem(
                                                {
                                                    ...item,
                                                    ['birth']: onlyNumberText(e.target.value)
                                                }
                                            )
                                        }}
                                    />
                                </Content>
                                <Content>
                                    <Label>휴대폰번호</Label>
                                    <CFormInput
                                        value={item.phone_num}
                                        placeholder="하이픈(-) 제외 입력"
                                        onChange={(e) => {
                                            setItem(
                                                {
                                                    ...item,
                                                    ['phone_num']: onlyNumberText(e.target.value)
                                                }
                                            )
                                        }}
                                    />
                                </Content>
                                <Content>
                                    <Label>입금은행</Label>
                                    <CFormSelect size="sm"
                                        value={item?.deposit_bank_code}
                                        style={{ width: '100%' }}
                                        onChange={e => {
                                            setItem({
                                                ...item,
                                                ['deposit_bank_code']: e.target.value
                                            })
                                        }}>
                                        {bankCodeList().map((itm, idx) => {
                                            if (itm?.value != '092') {
                                                return <option value={itm.value}>{itm.label}</option>
                                            }
                                        })}
                                    </CFormSelect>
                                </Content>
                                <Content>
                                    <Label>입금계좌번호</Label>
                                    <CFormInput
                                        value={item.deposit_acct_num}
                                        placeholder="하이픈(-) 제외 입력"
                                        onChange={(e) => {
                                            setItem(
                                                {
                                                    ...item,
                                                    ['deposit_acct_num']: onlyNumberText(e.target.value)
                                                }
                                            )
                                        }}
                                    />
                                </Content>
                                <Content>
                                    <Label>입금자명</Label>
                                    <CFormInput
                                        value={item.deposit_acct_name}
                                        onChange={(e) => {
                                            setItem(
                                                {
                                                    ...item,
                                                    ['deposit_acct_name']: e.target.value
                                                }
                                            )
                                        }}
                                    />
                                </Content>
                                <CButton onClick={oneWonCertification}>1원인증 발송</CButton>
                                {item.is_send_one_won_check &&
                                    <>
                                        <Content>
                                            <Label>인증번호</Label>
                                            <CFormInput
                                                value={item.vrf_word}
                                                onChange={(e) => {
                                                    setItem(
                                                        {
                                                            ...item,
                                                            ['vrf_word']: e.target.value
                                                        }
                                                    )
                                                }}
                                            />
                                        </Content>
                                        <CButton disabled={item?.is_check_bank} onClick={checkOneWonCertification}>{item?.is_check_bank ? '확인완료' : '인증확인'}</CButton>
                                    </>}
                                {!(!item?.is_check_bank && (item?.deposit_acct_check != 1)) &&
                                    <>
                                        <CButton disabled={!item?.is_check_bank && (item?.deposit_acct_check != 1)} onClick={() => {
                                            if (window.confirm('발급 하시겠습니까?')) {
                                                onSave();
                                            }
                                        }}>{'발급'}</CButton>
                                    </>}
                            </Col>
                        </CCardBody>

                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default VirtualAccountBankners;