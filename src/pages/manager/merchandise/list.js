import {
    CAvatar,
    CBadge,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CFormInput,
    CFormSelect,
    CInputGroup,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import _ from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from 'src/components/auth/useAuthContext';
import { Col, Content, Label, Row } from 'src/components/element/styled-componsts';
import { useSettingsContext } from 'src/components/settings';
import ManagerTable from 'src/components/table/ManagerTable';
import { apiManager } from 'src/utils/api-manager';
import { bankCodeList, operatorLevelList, payTypeList, virtualAcctLinkStatusList, withdrawStatusList } from 'src/utils/format';
import { commarNumber, getUserFee, getUserLevelByNumber, getUserStatusByNum } from 'src/utils/function';
import { Icon } from '@iconify/react';
import MerchandiseEdit from './MerchandiseEdit';
import { useRouter } from 'next/router';
import DefaultLayout from 'src/layout/DefaultLayout';


const MerchandiseList = () => {

    const { user } = useAuthContext();
    const { themeDnsData } = useSettingsContext();
    const router = useRouter();
    const defaultColumns = [
        {
            id: 'num',
            label: '순번',
            action: (row, is_excel, idx) => {
                return commarNumber(row?.No_);
            },
            sx: (row) => {
                if (row?.deposit_status == 10) {
                    return {
                        color: 'red'
                    }
                }
            },
        },
        {
            id: 'user_name',
            label: '가맹점ID',
            action: (row, is_excel) => {
                return row['user_name']
            }
        },
        {
            id: 'nickname',
            label: '명칭',
            action: (row, is_excel) => {
                if (is_excel) {
                    return row['nickname'] ?? "---"
                }
                return <CButton size="sm" color='warning' style={{ width: '120px' }}
                    onClick={() => {
                        setEditType('edit');
                        setEditId(row?.id)
                    }}
                >{row['nickname'] ?? "---"}</CButton>
            }
        },
        {
            id: 'withdraw_account',
            label: '계좌정보',
            action: (row, is_excel) => {
                if (is_excel) {
                    return row['nickname'] ?? "---"
                }
                return <CButton size="sm" color='success' style={{ width: '120px', color: '#fff' }}
                    onClick={() => {
                        setEditType('settle_account');
                        setEditId(row?.id)
                    }}
                >{'정산계좌'}</CButton>
            }
        },
        {
            id: 'settle_amount',
            label: '보유정산금',
            action: (row, is_excel) => {
                return commarNumber(row['settle_amount'])
            }
        },

        {
            id: 'withdraw_amount',
            label: '출금액',
            action: (row, is_excel) => {
                return commarNumber(row['withdraw_amount'] + row['withdraw_fee_amount'])
            }
        },
        ...(themeDnsData?.operator_list ?? []).map(operator => {
            if (user?.level >= operator?.value) {
                let label = operator?.label;
                if (user?.level > 10 && user?.level < 40) {
                    label = (operator?.label ?? "").includes('대리점') ? '대리점' : operator?.label;
                }
                return [
                    {
                        id: `sales${operator?.num}_id`,
                        label: label,
                        action: (row, is_excel) => {
                            return row[`sales${operator?.num}_id`] > 0 ? <div style={{ textAlign: 'center' }}>{`${row[`sales${operator?.num}_nickname`]}\n(${row[`sales${operator?.num}_user_name`]})`}</div> : `---`
                        }
                    },
                    ...(themeDnsData?.is_use_fee_operator == 1 ? [
                        {
                            id: `sales${operator?.num}_fee_2`,
                            label: `${label} 수수료`,
                            action: (row, is_excel) => {
                                return row[`sales${operator?.num}_id`] > 0 ? parseFloat(getUserFee(row, operator?.value, themeDnsData?.operator_list, themeDnsData?.head_office_fee)) + '%' : "---"
                            }
                        },
                    ] : []),
                ]
            } else {
                return []
            }
        }).flat(),
        ...((user?.level >= 10 && themeDnsData?.is_use_fee_operator == 1) ? [
            {
                id: 'mcht_fee',
                label: '가맹점 수수료',
                action: (row, is_excel) => {
                    return row['mcht_fee'] + '%'
                }
            },
        ] : []),
        {
            id: 'virtual_acct_link',
            label: '가상계좌발급주소',
            action: (row, is_excel) => {
                let link = 'https://' + themeDnsData?.dns + `/virtual-account/${row?.mid}`;
                if (is_excel) {
                    return link
                }
                return <div style={{
                    cursor: 'pointer',
                    color: 'blue',
                }}
                    onClick={() => {
                        window.open(`/virtual-account/${row?.mid}`)
                    }}
                >
                    {link}
                </div>
            }
        },
        ...(user?.level >= 40 ? [
            {
                id: 'virtual_bank',
                label: '발급주소 상태',
                action: (row, is_excel) => {
                    if (is_excel) {
                        return `---`
                    }
                    return <CFormSelect
                        size='sm'
                        defaultValue={row?.virtual_acct_link_status}
                        disabled={!(user?.level >= 40)}
                        onChange={async (e) => {
                            let result = await apiUtil(`users/virtual_acct_link_status`, 'update', {
                                id: row?.id,
                                value: e.target.value
                            });
                        }}
                    >
                        {virtualAcctLinkStatusList.map((itm) => {
                            return <option value={itm.value}>{itm?.label}</option>
                        })}
                    </CFormSelect>
                }
            },
        ] : []),

        {
            id: 'last_login_time',
            label: '마지막로그인시간',
            action: (row, is_excel) => {
                return row['last_login_time'] ?? "---"
            }
        },
        {
            id: 'connected_ip',
            label: '접속아이피',
            action: (row, is_excel) => {
                return row['connected_ip'] ?? "---"
            }
        },
        {
            id: 'status',
            label: '유저상태',
            action: (row, is_excel) => {
                if (is_excel) {
                    return getUserStatusByNum(row?.status)
                }
                return <CInputGroup size='sm'>
                    <CFormSelect
                        size='sm'
                        value={row?.status}
                        disabled={!(user?.level >= 40)}
                        onChange={async (e) => {
                            let result = await apiManager(`users/change-status`, 'update', {
                                id: row?.id,
                                status: e.target.value
                            });
                            if (result) {
                                onChangePage(searchObj)
                            }
                        }}
                    >
                        <option value={'0'}>{'정상'}</option>
                        <option value={'1'}>{'가입대기'}</option>
                        <option value={'2'}>{'로그인금지'}</option>
                    </CFormSelect>
                </CInputGroup>
            }
        },
        ...(user?.level >= 40 ? [
            {
                id: 'user_login',
                label: '해당 유저로 로그인',
                action: (row, is_excel) => {
                    if (is_excel) {
                        return "---";
                    }
                    return <CButton size="sm" color='success' style={{ color: '#fff' }}
                        onClick={() => {
                            if (window.confirm('해당 유저로 로그인 하시겠습니까?')) {
                                onSignInAnotherUser(row?.id)
                            }
                        }}
                    >유저 로그인</CButton>
                }
            },
        ] : []),
        {
            id: 'created_at',
            label: '가입일',
            action: (row, is_excel) => {
                return row['created_at'] ?? "---"
            }
        },
    ]
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState({});
    const [editId, setEditId] = useState(-1);
    const [editType, setEditType] = useState('');
    const [searchObj, setSearchObj] = useState({
        page: 1,
        page_size: 30,
        s_dt: '',
        e_dt: '',
        search: '',
        level: 10,
    })
    const [dialogObj, setDialogObj] = useState({
        changePassword: false,
        settleAccount: false,
    })
    const [changePasswordObj, setChangePasswordObj] = useState({
        id: '',
        user_pw: ''
    })
    const [changeUserDepositObj, setChangeUserDepositObj] = useState({
        amount: 0,
    })


    useEffect(() => {
        pageSetting();
    }, [])
    const pageSetting = () => {
        let cols = defaultColumns;
        setColumns(cols)
        onChangePage({ ...searchObj, page: 1, level: 10, });
    }
    const onChangePage = async (obj) => {
        setData({
            ...data,
            content: undefined
        })
        let data_ = await apiManager('users', 'list', obj);
        if (data_) {
            setData(data_);
        }
        setSearchObj(obj);
    }
    const deleteUser = async (id) => {
        let data = await apiManager('users', 'delete', { id });
        if (data) {
            onChangePage(searchObj);
        }
    }
    const onChangeUserPassword = async () => {
        let result = await apiManager(`users/change-pw`, 'update', changePasswordObj);
        if (result) {
            setDialogObj({
                ...dialogObj,
                changePassword: false
            })
            setChangePasswordObj({
                id: '',
                user_pw: ''
            })
            alert("성공적으로 변경 되었습니다.");
        }
    }
    const onChangeUserDeposit = async () => {
        setDialogObj({})
        let result = await apiManager(`users/change-deposit`, 'create', changeUserDepositObj)
        if (result) {
            setChangeUserDepositObj({})
            alert("성공적으로 저장 되었습니다.");
            onChangePage(searchObj);
        }
    }
    const onSignInAnotherUser = async (user_id) => {
        const result = await apiManager(`auth/sign-in-another-user`, 'create', {
            user_id,
        })
        if (result?.id) {
            window.location.reload();
        }
    }
    return (
        <>
            <CModal visible={editId >= 0} onClose={() => setEditId(-1)} size='lg'>
                <CModalHeader>
                    <CModalTitle>{editId > 0 ? '수정' : (editId == 0 ? '등록' : '')}하기</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <MerchandiseEdit editId={editId} setEditId={setEditId} editType={editType} />
                </CModalBody>
            </CModal>
            <CModal visible={dialogObj.changePassword} onClose={() => {
                setDialogObj({
                    ...dialogObj,
                    changePassword: false
                })
            }}>
                <CModalHeader>
                    <CModalTitle>비밀번호 변경</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Col style={{ rowGap: '1rem' }}>
                        <Content>
                            <Label>새 비밀번호</Label>
                            <Row>
                                <CFormInput size='sm' className='content-input' value={changePasswordObj.user_pw} type="password"
                                    onChange={(e) => {
                                        setChangePasswordObj({
                                            ...changePasswordObj,
                                            user_pw: e.target.value
                                        })
                                    }}
                                />
                            </Row>
                        </Content>
                        <CButton style={{ marginLeft: 'auto' }} color='warning' size='sm' onClick={onChangeUserPassword}>
                            <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                                <Icon icon={'la:dot-circle'} style={{ fontSize: '1rem' }} />
                                <div>변경하기</div>
                            </Row>
                        </CButton>
                    </Col>

                </CModalBody>
            </CModal>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>출금 내역</CCardHeader>
                        <CCardBody>
                            <ManagerTable
                                data={data}
                                columns={columns}
                                searchObj={searchObj}
                                onChangePage={onChangePage}
                                add_button_text={themeDnsData?.is_can_add_deposit == 1 ? '결제내역추가' : ''}
                                head_columns={[]}
                                table={'deposits'}
                                column_table={'deposits'}
                                excel_name={'출금'}
                                between_content={<Row style={{ marginBottom: "1rem" }}>
                                    <CTable style={{ fontSize: '12px', marginBottom: '0', background: 'transparent' }} hover>
                                        <CTableHead style={{ background: 'transparent' }}>
                                            <CTableRow style={{ fontWeight: 'normal' }}>

                                            </CTableRow>
                                        </CTableHead>
                                    </CTable>
                                </Row>}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <Col style={{ marginBottom: '1rem' }}>
                <CButton style={{ marginLeft: 'auto' }} color='warning' size='sm' onClick={() => {
                    setEditId(0)
                    setEditType('edit')
                }}>
                    <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                        <Icon icon={'la:dot-circle'} style={{ fontSize: '1rem' }} />
                        <div>신규 등록</div>
                    </Row>
                </CButton>
            </Col>
        </>
    )
}
MerchandiseList.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default MerchandiseList;