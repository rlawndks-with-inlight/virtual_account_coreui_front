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
import { useRouter } from 'next/router';


const OperatorEdit = (props) => {

    const { editId, setEditId } = props;
    const { themeMode, themeDnsData } = useSettingsContext();
    const { user } = useAuthContext();
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState(0);
    const [loading, setLoading] = useState(true);
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
        note: '',
        withdraw_fee: 0,
        min_withdraw_price: 0,
        min_withdraw_remain_price: 0,
        min_withdraw_hold_price: 0,
        guid: '',
        is_withdraw_hold: 0,
    })
    const [ipList, setIpList] = useState([]);

    useEffect(() => {
        settingPage();
    }, [editId])
    const settingPage = async () => {
        let data = item;
        if (editId > 0) {
            data = await apiManager('users', 'get', {
                id: editId
            })
            setIpList(data?.ip_list);
        } else {
            data = {};
            for (var i = 0; i < operatorLevelList.length; i++) {
                if (themeDnsData?.level_obj[`is_use_sales${5 - i}`] == 1) {
                    data.level = operatorLevelList[i].value;
                    break;
                }
            }
        }
        if (editId == 0) {
            data['withdraw_fee'] = themeDnsData?.default_withdraw_fee;
            data['deposit_fee'] = themeDnsData?.default_deposit_fee;
        }
        setItem(data);
        setLoading(false);
    }
    const onSave = async () => {
        let result = undefined
        if (item?.id) {//수정
            result = await apiManager('users', 'update', { ...item, level: router.query?.level, ip_list: ipList });
        } else {//추가
            result = await apiManager('users', 'create', { ...item, level: router.query?.level, ip_list: ipList });
        }
        if (result) {
            alert("성공적으로 저장 되었습니다.");
            window.location.reload();
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
                    <div>{getUserLevelByNumber(router.query?.level)}명 : </div>
                    <CFormInput size='sm' className='content-input' value={item.nickname}
                        placeholder={`${getUserLevelByNumber(router.query?.level)}명`}
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
                <Title>정산 정보</Title>
                <Content>
                    <div>USER_GUID(관리자 가상계좌 발급후) : </div>
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
                    <div style={{ marginTop: '0.5rem' }}>* 출금수수료 0원으로 입력시 기본 500원으로 설정</div>
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
            </Col>
            <CModalFooter>
                <CButton color="warning" onClick={() => {
                    if (window.confirm(`${editId > 0 ? '수정' : '등록'} 하시겠습니까?`)) {
                        onSave();
                    }
                }}>
                    {getUserLevelByNumber(router.query?.level)}{editId > 0 ? '수정' : '등록'}
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

export default OperatorEdit;