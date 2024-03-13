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
import _ from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from 'src/components/auth/useAuthContext';
import { Col, Row } from 'src/components/element/styled-componsts';
import { useSettingsContext } from 'src/components/settings';
import ManagerTable from 'src/components/table/ManagerTable';
import { socket } from 'src/data/data';
import { apiManager } from 'src/utils/api-manager';
import { bankCodeList, getChip, operatorLevelList, payTypeList, virtualAccountStatusList, virtualAccountUserTypeList, withdrawStatusList } from 'src/utils/format';
import { commarNumber, getUserFee, getUserLevelByNumber } from 'src/utils/function';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import DefaultLayout from 'src/layout/DefaultLayout';


const VirtualAccountList = () => {
    const { user } = useAuthContext();
    const { themeDnsData } = useSettingsContext();
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
            id: 'user_name',
            label: '가맹점',
            action: (row, is_excel) => {
                if (is_excel) {
                    return `${row[`nickname`]} (${row['user_name']})`
                }
                if (row['user_name']) {
                    return <div style={{ whiteSpace: 'pre' }}>{`${row[`nickname`]}\n(${row['user_name']})`}</div>
                } else {
                    return "---";
                }
            }
        },
        {
            id: 'virtual_bank_code',
            label: '가상계좌은행',
            action: (row, is_excel) => {
                return _.find(bankCodeList(), { value: row['virtual_bank_code'] })?.label ?? "---"
            }
        },
        {
            id: 'virtual_acct_num',
            label: '가상계좌번호',
            action: (row, is_excel) => {
                return row['virtual_acct_num'] ?? "---"
            }
        },
        {
            id: 'virtual_acct_name',
            label: '가상계좌명',
            action: (row, is_excel) => {
                return row['virtual_acct_name'] ?? "---"
            }
        },
        {
            id: 'guid',
            label: 'USER GUID',
            action: (row, is_excel) => {
                return row['guid'] ?? "---"
            }
        },
        {
            id: 'status',
            label: '상태',
            action: (row, is_excel) => {
                return getChip(virtualAccountStatusList, row?.status, !is_excel)
            }
        },
        {
            id: 'deposit_bank_code',
            label: '입금은행정보',
            action: (row, is_excel) => {
                if (is_excel) {
                    return `${_.find(bankCodeList(), { value: row['deposit_bank_code'] })?.label ?? "---"} ${row['deposit_acct_num']} ${row['deposit_acct_name']} ${row['birth']}`
                }
                return <Col>
                    <div>{_.find(bankCodeList(), { value: row['deposit_bank_code'] })?.label ?? "---"}</div>
                    <div>{row['deposit_acct_num']} {row['deposit_acct_name']} {row['birth']}</div>
                </Col>
            }
        },
        ...(user?.level >= 40 ? [
            {
                id: 'balance',
                label: '잔액확인',
                action: (row, is_excel) => {
                    if (is_excel) {
                        return "---";
                    }
                    return <Col style={{ alignItems: 'center', rowGap: '0.5rem' }}>
                        <CButton color="warning" size="sm" style={{ width: '100px' }}
                            onClick={() => {
                                getBalance(row?.id)
                            }}
                        >잔액확인</CButton>
                        <CButton color="success" size="sm" style={{ width: '100px', color: '#fff' }}
                            onClick={() => {
                                moveToMother(row?.id)
                            }}
                        >모계좌이동</CButton>
                    </Col>
                }
            },
        ] : []),
        {
            id: 'user_type',
            label: '사용자구분',
            action: (row, is_excel) => {
                let text = `${_.find(virtualAccountUserTypeList, { value: row['user_type'] })?.label ?? "---"}`;
                return text
            }
        },
        {
            id: 'created_at',
            label: '생성일',
            action: (row, is_excel) => {
                return row['created_at'] ?? "---"
            }
        },
        {
            id: 'edit',
            label: '이어서 생성',
            action: (row, is_excel) => {
                if (is_excel) {
                    return `---`
                }
                return row['status'] == 5 ? <>
                    <CButton color="success" size="sm" style={{ width: '100px', color: '#fff' }}
                        onClick={() => {
                            router.push(`edit/${row?.id}`)
                        }}
                    >이어서 생성</CButton>
                </> : "---"
            }
        },
        ...(user?.level >= 10 ? [
            {
                id: 'delete',
                label: '삭제',
                action: (row, is_excel) => {
                    if (is_excel) {
                        return `---`
                    }
                    return (
                        <>
                            <CButton color="secondary" size="sm" style={{ width: '80px' }}
                                onClick={() => {
                                    if (window.confirm('정말 삭제하시겠습니까?')) {
                                        deleteUser(row?.id)
                                    }
                                }}
                            >삭제</CButton>
                        </>
                    )
                }
            },
        ] : []),
    ]
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState({});
    const [operUserList, setOperUserList] = useState([]);
    const [searchObj, setSearchObj] = useState({
        page: 1,
        page_size: 30,
        s_dt: '',
        e_dt: '',
        search: '',
        is_sales_man: true,
    })
    const [dialogObj, setDialogObj] = useState({
        changePassword: false,
    })
    const [changePasswordObj, setChangePasswordObj] = useState({
        id: '',
        user_pw: ''
    })
    useEffect(() => {
        pageSetting();

    }, [])
    const pageSetting = () => {
        let cols = defaultColumns;
        setColumns(cols)
        getAllOperUser();
        onChangePage({ ...searchObj, page: 1, });
    }
    const getAllOperUser = async () => {
        let data = await apiManager('users', 'list', {
            level: 10,
        });
        setOperUserList(data?.content ?? []);
    }
    const onChangePage = async (obj) => {
        setData({
            ...data,
            content: undefined
        })
        let data_ = await apiManager('virtual-accounts', 'list', obj);
        if (data_) {
            setData(data_);
        }
        setSearchObj(obj);
    }
    const deleteUser = async (id) => {
        let data = await apiManager('virtual-accounts', 'delete', { id });
        if (data) {
            onChangePage(searchObj);
        }
    }
    const getBalance = async (id) => {
        let result = await apiManager('virtual-accounts/balance', 'get', {
            id: id,
        })
        alert(`${commarNumber(result?.amount)}원`)
    }
    const moveToMother = async (id) => {
        let result = await apiManager('virtual-accounts/mother', 'create', {
            id: id,
        })
        if (result) {
            alert(`성공적으로 이동 되었습니다.`);
        }
    }
    return (
        <>
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
                                excel_name={'가상계좌'}
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
        </>
    )
}
VirtualAccountList.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default VirtualAccountList;