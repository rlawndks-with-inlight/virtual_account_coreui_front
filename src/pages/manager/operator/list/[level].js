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
import { bankCodeList, getChip, operatorLevelList, payTypeList, userStatusList, userWithdrawHoldList, withdrawStatusList } from 'src/utils/format';
import { commarNumber, getUserFee, getUserLevelByNumber } from 'src/utils/function';
import { Icon } from '@iconify/react';
import OperatorEdit from '../OperatorEdit';
import { useRouter } from 'next/router';
import DefaultLayout from 'src/layout/DefaultLayout';


const OperatorList = () => {

    const { user } = useAuthContext();
    const { themeDnsData } = useSettingsContext();
    ;
    const router = useRouter();;
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
            id: 'level',
            label: '등급 구분',
            action: (row, is_excel) => {
                return getUserLevelByNumber(row['level'])
            }
        },
        {
            id: 'user_name',
            label: '아이디',
            action: (row, is_excel) => {
                return row['user_name'] ?? "---"
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
                        setEditId(row?.id)
                    }}
                >{row['nickname'] ?? "---"}</CButton>
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
            id: 'connect_link',
            label: '접속 주소',
            action: (row, is_excel) => {
                return row?.connect_link ?? "---";
            }
        },
        {
            id: 'is_withdraw_hold',
            label: '출금보류',
            action: (row, is_excel) => {
                return getChip(userWithdrawHoldList, row['is_withdraw_hold'], !is_excel)
            }
        },
        {
            id: 'login_fail_count',
            label: '로그인실패',
            action: (row, is_excel) => {
                return row['login_fail_count'] + '회'
            }
        },
        {
            id: 'last_login_time',
            label: '마지막로그인',
            action: (row, is_excel) => {
                return row['last_login_time'] ?? "---"
            }
        },
        {
            id: 'connected_ip',
            label: '마지막 접속IP',
            action: (row, is_excel) => {
                return row['connected_ip'] ?? "---"
            }
        },
        {
            id: 'created_at',
            label: '가입일',
            action: (row, is_excel) => {
                return row['created_at'] ?? "---"
            }
        },
        {
            id: 'status',
            label: '유저상태',
            action: (row, is_excel) => {
                if (is_excel) {
                    return getChip(userStatusList, row?.status)
                }
                return <CFormSelect
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
                    {userStatusList.map((itm) => {
                        return <option value={itm.value}>{itm.label}</option>
                    })}
                </CFormSelect>
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
            id: 'edit_password',
            label: '비밀번호 변경',
            action: (row, is_excel) => {
                if (user?.level < row?.level) {
                    return "---"
                }
                return (
                    <>
                        <CButton size="sm" color='info' style={{ color: '#fff' }}
                            onClick={() => {
                                setDialogObj({ ...dialogObj, changePassword: true })
                                setChangePasswordObj({
                                    user_pw: '',
                                    id: row?.id
                                })
                            }}
                        >비밀번호 변경</CButton>
                    </>
                )
            }
        },
    ]
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState({});
    const [editId, setEditId] = useState(-1);
    const [searchObj, setSearchObj] = useState({
        page: 1,
        page_size: 30,
        s_dt: '',
        e_dt: '',
        search: '',
        level: router.query?.level
    })
    const [dialogObj, setDialogObj] = useState({
        changePassword: false,
    })
    const [changeUserDepositObj, setChangeUserDepositObj] = useState({
        amount: 0,
    })
    const [changePasswordObj, setChangePasswordObj] = useState({
        id: '',
        user_pw: ''
    })
    const getUriUserLevel = () => {

    }
    useEffect(() => {
        pageSetting();
    }, [router.asPath])
    const pageSetting = () => {
        let cols = defaultColumns;
        setColumns(cols)
        onChangePage({ ...searchObj, page: 1, level: router.query?.level });
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
    const onChangeUserDeposit = async (pay_type) => {
        setDialogObj({})
        setChangeUserDepositObj({})
        let result = await apiManager(`users/change-deposit`, 'create', {
            amount: changeUserDepositObj.amount,
            pay_type,
            user_id: changeUserDepositObj?.user_id,
            note: changeUserDepositObj?.note
        })
        if (result) {

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
                    <OperatorEdit editId={editId} setEditId={setEditId} />
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
                        <CCardHeader>{getUserLevelByNumber(router.query?.level)} 목록</CCardHeader>
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
                }}>
                    <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                        <Icon icon={'la:dot-circle'} style={{ fontSize: '1rem' }} />
                        <div>{getUserLevelByNumber(router.query?.level)} 등록</div>
                    </Row>
                </CButton>
            </Col>
        </>
    )
}
OperatorList.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default OperatorList;