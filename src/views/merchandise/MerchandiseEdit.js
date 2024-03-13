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
    CContent,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableContent,
    CModalFooter,
    CInputGroup,
    CFormSelect,
} from '@coreui/react'
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/components/auth/useAuthContext';
import { Col, Content, Row, Title } from 'src/components/element/styled-componsts';
import { useSettingsContext } from 'src/components/settings';
import { apiManager } from 'src/utils/api-manager';
import { bankCodeList, operatorLevelList } from 'src/utils/format';
import { commarNumber, getUserLevelByNumber, onlyNumberText } from 'src/utils/function';
import OnChangeUserDepositModal from '../modal/OnChangeUserDepositModal';


const MerchandiseEdit = (props) => {

    const { editId, setEditId, editType } = props;
    const { themeMode, themeDnsData } = useSettingsContext();
    const { user } = useAuthContext();

    const [loading, setLoading] = useState(true);
    const [operatorList, setOperatorList] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);
    const [ipPage, setIpPage] = useState(1);
    const [openChangeDeposit, setOpenChangeDeposit] = useState(false);
    const [item, setItem] = useState({
        profile_file: undefined,
        user_name: '',
        phone_num: '',
        nickname: '',
        name: '',
        email: '',
        level: 10,
        user_pw: '',
        withdraw_fee: 0,
        min_withdraw_price: 0,
        min_withdraw_remain_price: 0,
        min_withdraw_hold_price: 0,
        is_send_one_won_check: false,
        vrf_bank_code: '',
        guid: '',
        is_withdraw_hold: 0,
        withdraw_bank_code: '',
        withdraw_acct_num: '',
        withdraw_acct_name: '',

    })
    const [ipData, setIpData] = useState({});
    const [ipList, setIpList] = useState([]);
    const [ipSearchObj, setIpSearchObj] = useState({
        page: 1,
        page_size: 20,
        id: editId
    })

    useEffect(() => {

        settingPage();
    }, [])
    const settingPage = async () => {
        let operator_list = await apiManager(`users`, 'list', {
            level_list: themeDnsData?.operator_list.map(itm => {
                return itm?.value
            }),
        })
        setOperatorList(operator_list?.content ?? []);
        let data = item;

        if (editId > 0) {
            data = await apiManager('users', 'get', {
                id: editId
            })
            setIpList(data?.ip_list);
            onChangePage(ipSearchObj)
        }
        if (editId == 0) {
            data['withdraw_fee'] = themeDnsData?.default_withdraw_fee;
            data['deposit_fee'] = themeDnsData?.default_deposit_fee;
            data['mcht_fee'] = themeDnsData?.head_office_fee;
        }
        setItem(data);
        setLoading(false);

    }
    const onChangePage = async (obj) => {
        setIpData({
            ...ipData,
            content: undefined
        })
        let data_ = await apiManager('users/ip-logs', 'list', obj);
        if (data_) {
            setIpData(data_);
        }
        setIpSearchObj(obj);
    }
    const onSave = async () => {
        let data = { ...item };
        if (!data?.mcht_fee && themeDnsData?.is_use_fee_operator == 1) {
            return alert('가맹점 요율은 필수값입니다.');
        }
        let result = undefined
        if (data?.telegram_chat_ids) {
            data['telegram_chat_ids'] = JSON.stringify((data?.telegram_chat_ids ?? "").split(','));
        } else {
            data['telegram_chat_ids'] = '[]';
        }
        if (data?.id) {//수정
            result = await apiManager('users', 'update', { ...data, ip_list: ipList, level: 10, });
        } else {//추가
            result = await apiManager('users', 'create', { ...data, ip_list: ipList, level: 10, });
        }
        if (result) {
            alert("성공적으로 저장 되었습니다.");
            window.location.reload();
        } else {

        }
    }
    const onChangeUserDeposit = async (obj) => {
        let result = await apiManager(`users/change-deposit`, 'create', {
            ...obj,
            user_id: editId
        })
        if (result) {
            alert("성공적으로 저장 되었습니다.");
            settingPage();
            setOpenChangeDeposit(false);
        }
    }
    return (
        <>
            <OnChangeUserDepositModal
                open={openChangeDeposit}
                user_id={editId}
                onSave={onChangeUserDeposit}
                onClose={() => {
                    setOpenChangeDeposit(false);
                }}
            />
            <Col style={{ rowGap: '1rem' }} className='edit-body'>
                {editType == 'edit' &&
                    <>
                        <Title>기본 정보</Title>
                        <Content>
                            <div>아이디 : </div>
                            {editId == 0 ?
                                <>
                                    <CFormInput size='sm' className='content-input' value={item.user_name}
                                        placeholder='아이디'
                                        onChange={(e) => {
                                            setItem(
                                                {
                                                    ...item,
                                                    ['user_name']: e.target.value
                                                }
                                            )
                                        }}
                                    />
                                </>
                                :
                                <>
                                    <div>{item?.user_name}</div>
                                </>}
                        </Content>
                        {editId > 0 &&
                            <>
                                <Content>
                                    <div>현재 보유정산금 :</div>
                                    <div>{commarNumber(item?.settle_amount)} 원</div>
                                    <CButton size='sm' color='warning' onClick={() => {
                                        setOpenChangeDeposit(true);
                                    }}>보유정산금 수동지급</CButton>
                                </Content>
                            </>}
                        <Content>
                            <div>가맹점명  : </div>
                            <CFormInput size='sm' className='content-input' value={item.nickname}
                                placeholder={`가맹점명`}
                                onChange={(e) => {
                                    setItem(
                                        {
                                            ...item,
                                            ['nickname']: e.target.value
                                        }
                                    )
                                }}
                            />

                        </Content>
                        {editId == 0 &&
                            <>
                                <Content>
                                    <div>비밀번호 : </div>
                                    <CFormInput size='sm' className='content-input' type='password' value={item.user_pw}
                                        placeholder='비밀번호'
                                        onChange={(e) => {
                                            setItem(
                                                {
                                                    ...item,
                                                    ['user_pw']: e.target.value
                                                }
                                            )
                                        }}
                                    />
                                </Content>
                            </>}
                        <Content>
                            <div>담당자명 : </div>
                            <CFormInput size='sm' className='content-input' value={item.name}
                                placeholder='담당자명'
                                onChange={(e) => {
                                    setItem(
                                        {
                                            ...item,
                                            ['name']: e.target.value
                                        }
                                    )
                                }}
                            />
                        </Content>
                        <Content>
                            <div>연락처 : </div>
                            <CFormInput size='sm' className='content-input' value={item.phone_num}
                                placeholder='연락처'
                                onChange={(e) => {
                                    setItem(
                                        {
                                            ...item,
                                            ['phone_num']: e.target.value
                                        }
                                    )
                                }}
                            />
                        </Content>
                        <Content>
                            <div>텔레그램 CHAT_ID : </div>
                            <CFormInput size='sm' className='content-input' value={item.telegram_chat_ids}
                                placeholder='텔레그램 chat id (,콤마로 구분)'
                                onChange={(e) => {
                                    setItem(
                                        {
                                            ...item,
                                            ['telegram_chat_ids']: e.target.value
                                        }
                                    )
                                }}
                            />
                        </Content>
                        <Row style={{ alignItems: 'center', columnGap: '0.25rem' }}>
                            <div>텔레그램 봇 이름: </div>
                            <div style={{ color: 'blue', cursor: 'pointer' }} onClick={() => {
                                window.open(`https://t.me/${themeDnsData?.telegram_bot_id}`)
                            }}>@{themeDnsData?.telegram_bot_id}</div>
                        </Row>
                        <Content>
                            <div>USER_GUID(가맹점 가상계좌 발급후) : </div>
                            <CFormInput size='sm' className='content-input' value={item.guid}
                                placeholder='USER_GUID'
                                onChange={(e) => {
                                    setItem(
                                        {
                                            ...item,
                                            ['guid']: e.target.value
                                        }
                                    )
                                }}
                            />
                        </Content>
                        <Content>
                            <div>반환 사용 : </div>
                            <Row>
                                <Row style={{ columnGap: '0.25rem' }}>
                                    <input type='radio' id={`can_return_1`} checked={item.can_return == 1} onChange={(e) => {
                                        if (e.target.checked) {
                                            setItem({
                                                ...item,
                                                is_withdraw_hold: 1,
                                            })
                                        }
                                    }} />
                                    <label for='can_return_1'>예</label>

                                    <input
                                        style={{ marginLeft: '0.5rem' }}
                                        type='radio' id={`can_return_0`} checked={item.can_return != 1} onChange={(e) => {
                                            if (e.target.checked) {
                                                setItem({
                                                    ...item,
                                                    can_return: 0,
                                                })
                                            }
                                        }} />
                                    <label for='can_return_0'>아니오</label>
                                </Row>
                            </Row>
                        </Content>
                        <Content>
                            <div>입금 노티 url : </div>
                            <CFormInput size='sm' className='content-input' value={item.deposit_noti_url}
                                placeholder='입금 노티 url'
                                onChange={(e) => {
                                    setItem(
                                        {
                                            ...item,
                                            ['deposit_noti_url']: e.target.value
                                        }
                                    )
                                }}
                            />
                        </Content>
                        {editId > 0 &&
                            <>
                                <Content>
                                    <div>마지막 로그인 : </div>
                                    <div>{item?.last_login_time} </div>
                                </Content>
                                <Content>
                                    <div>등록일 : </div>
                                    <div>{item?.created_at} </div>
                                </Content>
                            </>}
                        <hr style={{ margin: 0 }} />
                        <Title>수수료 정보</Title>
                        <Content>
                            <div>본사 수수료 : </div>
                            <div>{themeDnsData?.head_office_fee}</div>
                            <div>%</div>
                        </Content>
                        <Content>
                            <div>본사 입금 수수료 : </div>
                            <div>{themeDnsData?.deposit_head_office_fee}</div>
                            <div>원</div>
                        </Content>
                        {themeDnsData?.operator_list && themeDnsData?.operator_list.map((oper) => (
                            <>
                                <Content>
                                    <div>{oper?.label} : </div>
                                    <CInputGroup size="sm" style={{ maxWidth: '300px' }}>
                                        <CFormSelect size="sm"
                                            value={item[`sales${oper?.num}_id`] ?? 0}
                                            style={{ width: 'auto' }}
                                            onChange={(e) => {
                                                setItem(
                                                    {
                                                        ...item,
                                                        [`sales${oper?.num}_id`]: e.target.value
                                                    }
                                                )
                                            }}
                                        >
                                            <option value={0}>선택안함</option>
                                            {operatorList && operatorList.map((operator, idx) => {
                                                if (operator?.level == oper?.value) {
                                                    return <option value={operator.id}>{operator.nickname}</option>
                                                }
                                            })}
                                        </CFormSelect>
                                    </CInputGroup>
                                </Content>
                                <Content>
                                    <div>{oper?.label} 수수료 : </div>
                                    <CFormInput size='sm' className='content-input' value={item[`sales${oper?.num}_fee`]}
                                        placeholder={`${oper?.label} 수수료`}
                                        onChange={(e) => {
                                            setItem(
                                                {
                                                    ...item,
                                                    [`sales${oper?.num}_fee`]: onlyNumberText(e.target.value)
                                                }
                                            )
                                        }}
                                    />
                                    <div>%</div>
                                </Content>
                                <Content>
                                    <div>{oper?.label} 지급 입금 수수료 : </div>
                                    <CFormInput size='sm' className='content-input' value={item[`sales${oper?.num}_deposit_fee`]}
                                        placeholder={`${oper?.label} 지급 입금 수수료`}
                                        onChange={(e) => {
                                            setItem(
                                                {
                                                    ...item,
                                                    [`sales${oper?.num}_deposit_fee`]: onlyNumberText(e.target.value)
                                                }
                                            )
                                        }}
                                    />
                                </Content>
                            </>
                        ))}
                        <Content>
                            <div>가맹점 수수료 : </div>
                            <CFormInput size='sm' className='content-input' value={item[`mcht_fee`]}
                                placeholder={`가맹점 수수료`}
                                onChange={(e) => {
                                    setItem(
                                        {
                                            ...item,
                                            [`mcht_fee`]: onlyNumberText(e.target.value)
                                        }
                                    )
                                }}
                            />
                            <div>%</div>
                        </Content>
                        <hr style={{ margin: '0' }} />
                        <Title>정산 정보</Title>
                        <Col>
                            <Content>
                                <div>입금수수료 : </div>
                                <CFormInput size='sm' className='content-input' value={item.deposit_fee}
                                    onChange={(e) => {
                                        setItem(
                                            {
                                                ...item,
                                                ['deposit_fee']: onlyNumberText(e.target.value)
                                            }
                                        )
                                    }}
                                />
                            </Content>
                            <div style={{ marginTop: '0.5rem' }}>* 입금수수료 0원으로 입력시 기본 {themeDnsData?.default_deposit_fee}원으로 설정</div>
                        </Col>
                        <Col>
                            <Content>
                                <div>출금수수료 : </div>
                                <CFormInput size='sm' className='content-input' value={item.withdraw_fee}
                                    onChange={(e) => {
                                        setItem(
                                            {
                                                ...item,
                                                ['withdraw_fee']: onlyNumberText(e.target.value)
                                            }
                                        )
                                    }}
                                />
                            </Content>
                            <div style={{ marginTop: '0.5rem' }}>* 출금수수료 0원으로 입력시 기본 {themeDnsData?.default_withdraw_fee}원으로 설정</div>
                        </Col>
                        <Content>
                            <div>출금 보류 : </div>
                            <Row>
                                <Row style={{ columnGap: '0.25rem' }}>
                                    <input type='radio' id={`is_withdraw_hold_1`} checked={item.is_withdraw_hold == 1} onChange={(e) => {
                                        if (e.target.checked) {
                                            setItem({
                                                ...item,
                                                is_withdraw_hold: 1,
                                            })
                                        }
                                    }} />
                                    <label for='is_withdraw_hold_1'>예</label>

                                    <input
                                        style={{ marginLeft: '0.5rem' }}
                                        type='radio' id={`is_withdraw_hold_0`} checked={item.is_withdraw_hold != 1} onChange={(e) => {
                                            if (e.target.checked) {
                                                setItem({
                                                    ...item,
                                                    is_withdraw_hold: 0,
                                                })
                                            }
                                        }} />
                                    <label for='is_withdraw_hold_0'>아니오</label>
                                </Row>
                            </Row>
                        </Content>
                        <Content>
                            <div>최소 출금액 : </div>
                            <CFormInput size='sm' className='content-input' value={item.min_withdraw_price}
                                onChange={(e) => {
                                    setItem(
                                        {
                                            ...item,
                                            ['min_withdraw_price']: onlyNumberText(e.target.value)
                                        }
                                    )
                                }}
                            />
                        </Content>
                        <Content>
                            <div>최소 출금잔액 : </div>
                            <CFormInput size='sm' className='content-input' value={item.min_withdraw_remain_price}
                                onChange={(e) => {
                                    setItem(
                                        {
                                            ...item,
                                            ['min_withdraw_remain_price']: onlyNumberText(e.target.value)
                                        }
                                    )
                                }}
                            />
                        </Content>

                        <hr style={{ margin: '0' }} />
                        <Title>정산 계좌 정보</Title>
                        <Col style={{ rowGap: '0.5rem' }}>
                            <div>로그인 접속 IP 등록 : </div>
                            {ipList.map((ip, idx) => (
                                <>
                                    {ip?.is_delete != 1 &&
                                        <>
                                            <Row style={{ alignItems: 'center', columnGap: '0.25rem' }}>
                                                <CFormInput
                                                    sx={{ flexGrow: 1 }}
                                                    size='small'
                                                    value={ip?.ip}
                                                    onChange={(e) => {
                                                        let ip_list = [...ipList];
                                                        ip_list[idx]['ip'] = e.target.value.replaceAll(' ', '');
                                                        setIpList(ip_list);
                                                    }}
                                                />

                                                <Icon icon='material-symbols:delete-outline' style={{ fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => {
                                                    let ip_list = [...ipList];
                                                    ip_list[idx].is_delete = 1;
                                                    setIpList(ip_list);
                                                }} />
                                            </Row>
                                        </>}
                                </>
                            ))}
                            <CButton color='info'
                                style={{ color: '#fff' }}
                                onClick={() => {
                                    setIpList([
                                        ...ipList,
                                        ...[{ ip: '' }]
                                    ])
                                }}>IP 추가</CButton>
                        </Col>
                    </>}
                {editType == 'settle_account' &&
                    <>
                        <Title>정산 계좌 정보</Title>
                        <Content>
                            <div>정산 입금은행 : </div>
                            <CInputGroup size="sm" style={{ width: 'auto' }}>
                                <CFormSelect size="sm"
                                    value={item?.settle_bank_code}
                                    disabled
                                    style={{ width: 'auto' }}>
                                    {bankCodeList().map((code) => {
                                        return <option value={code?.value}>{code?.label}</option>
                                    })}
                                </CFormSelect>
                            </CInputGroup>
                        </Content>
                        <Content>
                            <div>정산 계좌번호 : </div>
                            <CFormInput size='sm' className='content-input' value={item.settle_acct_num}
                                disabled
                            />
                        </Content>
                        <Content>
                            <div>정산 예금주: </div>
                            <CFormInput size='sm' className='content-input' value={item.settle_acct_name}
                                disabled
                            />
                        </Content>
                        <Content>
                            <div>USER_GUID: </div>
                            <CFormInput size='sm' className='content-input' value={item.guid}
                                placeholder='USER_GUID'
                                onChange={(e) => {
                                    setItem(
                                        {
                                            ...item,
                                            ['guid']: e.target.value
                                        }
                                    )
                                }}
                            />
                        </Content>
                    </>}
            </Col>
            <CModalFooter>
                <CButton color="warning" onClick={() => {
                    if (window.confirm(`${editId > 0 ? '수정' : '등록'} 하시겠습니까?`)) {
                        onSave();
                    }
                }}>
                    {editId > 0 ? '수정' : '등록'}
                </CButton>
            </CModalFooter>
            <CModalFooter>
                <CButton color="dark" onClick={() => setEditId(-1)}>
                    닫기
                </CButton>
            </CModalFooter>
        </>
    )
}

export default MerchandiseEdit;