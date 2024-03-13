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
import theme from '../../../theme/theme'
import { apiManager, apiUtil } from 'src/utils/api-manager';
import { bankCodeList, getChip, operatorLevelList, payTypeList, withdrawStatusList } from 'src/utils/format';
import { commarNumber, getUserFee, getUserLevelByNumber } from 'src/utils/function';
import DefaultLayout from 'src/layout/DefaultLayout';


const WithdrawList = () => {

    const { user } = useAuthContext();
    const { themeDnsData } = useSettingsContext();
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
            id: 'trx_id',
            label: '거래번호',
            action: (row, is_excel) => {
                if (is_excel) {
                    return row['trx_id'] ?? "---"
                }
                if (user?.level >= 50) {
                    return <div style={{ cursor: 'pointer' }} onClick={() => {
                        setDialogObj({
                            changeTrxId: true,
                            trx_id: '',
                            id: row?.id,
                        })
                    }}>{row['trx_id'] ?? "---"}</div>
                } else {
                    return row['trx_id'] ?? "---"
                }
            }
        },
        {
            id: 'level',
            label: '등급 구분',
            action: (row, is_excel) => {
                let level = row['level'];
                for (var i = 0; i < themeDnsData?.operator_list.length; i++) {
                    let {
                        value,
                        label,
                        num
                    } = themeDnsData?.operator_list[i];
                    if (row[`sales${num}_level`] && !level) {
                        level = row[`sales${num}_level`];
                        break;
                    }
                }
                return getUserLevelByNumber(level)
            },
        },
        {
            id: 'nickname',
            label: '상호',
            action: (row, is_excel) => {
                let user_item = {
                    nickname: row[`nickname`],
                    user_name: row['user_name'],
                }
                for (var i = 0; i < themeDnsData?.operator_list.length; i++) {
                    let {
                        value,
                        label,
                        num
                    } = themeDnsData?.operator_list[i];
                    if (row[`sales${num}_user_name`] && !user_item.user_name) {
                        user_item = {
                            nickname: row[`sales${num}_nickname`],
                            user_name: row[`sales${num}_user_name`],
                        }
                        break;
                    }
                }
                if (is_excel) {
                    return `${user_item[`nickname`]} (${user_item['user_name']})`
                }
                return <div style={{ textAlign: 'center' }}>{`${user_item[`nickname`]}\n(${user_item['user_name']})`}</div>
            }
        },
        {
            id: 'settle_bank_code',
            label: '은행',
            action: (row, is_excel) => {
                return _.find(bankCodeList('withdraw'), { value: row['settle_bank_code'] })?.label ?? "---"
            }
        },
        {
            id: 'settle_acct_num',
            label: '계좌번호',
            action: (row, is_excel) => {
                return row['settle_acct_num'] ?? "---"
            }
        },
        {
            id: 'settle_acct_name',
            label: '예금주명',
            action: (row, is_excel) => {
                return row['settle_acct_name'] ?? "---"
            }
        },
        {
            id: 'status',
            label: '상태',
            action: (row, is_excel) => {
                let status = _.find(withdrawStatusList, { value: row?.withdraw_status });
                if (is_excel) {
                    return status?.label
                }
                if (user?.level >= 50) {
                    return <CFormSelect
                        size='sm'
                        defaultValue={row?.withdraw_status}
                        disabled={!(user?.level >= 40)}
                        onChange={async (e) => {
                            let result = await apiUtil(`deposits/withdraw_status`, 'update', {
                                id: row?.id,
                                value: e.target.value
                            });
                        }}
                    >
                        {withdrawStatusList.map((itm) => {
                            return <option value={itm.value}><CBadge color={itm?.color} >{itm?.label}</CBadge></option>
                        })}
                    </CFormSelect>
                } else {
                    return <CBadge color={status?.color} >{status?.label}</CBadge>
                }
            }
        },
        {
            id: 'pay_type',
            label: '출금구분',
            action: (row, is_excel) => {
                return getChip(payTypeList, row?.pay_type, !is_excel)
            }
        },
        {
            id: 'created_at',
            label: '요청일시',
            action: (row, is_excel) => {
                return row['created_at'] ?? "---"
            }
        },
        {
            id: 'updated_at',
            label: '완료일시',
            action: (row, is_excel) => {
                return row['updated_at'] ?? "---"
            }
        },
        {
            id: 'expect_amount',
            label: '이체예정금',
            action: (row, is_excel) => {
                if (row?.withdraw_status == 0) {
                    return commarNumber(row['expect_amount'] * (-1) - row['withdraw_fee'])
                } else {
                    return 0;
                }
            }
        },
        {
            id: 'amount',
            label: '이체금',
            action: (row, is_excel) => {
                if (row?.withdraw_status == 0) {
                    return commarNumber(row['amount'] * (-1) - row['withdraw_fee'])
                } else {
                    return 0;
                }
            },
            sx: (row) => {
                return {
                    color: `blue`
                }
            },
        },
        {
            id: 'withdraw_fee',
            label: '이체 수수료',
            action: (row, is_excel) => {
                return commarNumber(row['withdraw_fee'] ?? "---")
            }
        },
        {
            id: 'minus_amount',
            label: '차감 보유정산금',
            action: (row, is_excel) => {
                return commarNumber(row['expect_amount'] * (-1))
            },
            sx: (row) => {
                return {
                    color: `red`
                }
            },
        },
        ...(user?.level >= 40 ? [
            {
                id: 'withdraw_status_edit',
                label: '출금상태관리',
                action: (row, is_excel) => {
                    if (is_excel) {
                        return "---";
                    }
                    if (row?.is_withdraw_hold == 1) {
                        return <Col style={{ rowGap: '0.5rem' }}>
                            <CButton color="success" size="sm" sx={{ width: '100px' }}
                                onClick={() => {
                                    setModal({
                                        func: () => { onConfirmWithdraw(row?.id) },
                                        icon: 'bx:money-withdraw',
                                        title: '출금을 허용 하시겠습니까?'
                                    })
                                }}
                            >출금허용</CButton>
                            <CButton color="danger" size="sm" sx={{ width: '100px' }}
                                onClick={() => {
                                    setModal({
                                        func: () => { onRefuseWithdraw(row?.id) },
                                        icon: 'bx:money-withdraw',
                                        title: '출금을 반려 하시겠습니까?'
                                    })
                                }}
                            >출금반려</CButton>
                        </Col>
                    } else {
                        return "---";
                    }
                }
            },
            {
                id: 'withdraw_fail',
                label: '출금 실패처리',
                action: (row, is_excel) => {
                    if (is_excel) {
                        return "---";
                    }
                    if (row?.is_move_mother == 1 && row?.withdraw_status == 5) {
                        return <CButton size="sm" color="warning" sx={{ width: '100px' }}
                            onClick={() => {
                                setModal({
                                    func: () => { onFailWithdraw(row?.id) },
                                    icon: 'bx:money-withdraw',
                                    title: '출금을 실패처리 하시겠습니까?'
                                })
                            }}
                        >출금허용</CButton>
                    } else {
                        return "---";
                    }
                }
            },
        ] : []),
        {
            id: 'note',
            label: '메모',
            action: (row, is_excel) => {
                return row['note']
            }
        },

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

    })
    useEffect(() => {
        pageSetting();
    }, [])
    const pageSetting = () => {
        let cols = defaultColumns;
        setColumns(cols)
        getAllOperUser();
        onChangePage({ ...searchObj, page: 1 });
    }
    const getAllOperUser = async () => {
        let data = await apiManager('users', 'list', {
            level_list: [10, ...operatorLevelList.map(itm => { return itm.value })],
        });
        setOperUserList(data?.content ?? []);
    }
    const onChangePage = async (obj) => {
        setData({
            ...data,
            content: undefined
        })
        let data_ = await apiManager('withdraws', 'list', obj);
        if (data_) {
            setData(data_);
        }
        setSearchObj(obj);
    }
    const onConfirmWithdraw = async (id) => {
        let result = undefined
        result = await apiManager('withdraws/confirm', 'create', {
            id
        });
        if (result) {
            alert("성공적으로 저장 되었습니다.");
            onChangePage(searchObj)
        }
    }
    const onRefuseWithdraw = async (id) => {
        let result = undefined
        result = await apiManager('withdraws/refuse', 'create', {
            id
        });
        if (result) {
            alert("성공적으로 저장 되었습니다.");
            onChangePage(searchObj)
        }
    }
    const onFailWithdraw = async (id) => {
        let result = undefined
        result = await apiManager('withdraws/fail', 'create', {
            id
        });
        if (result) {
            alert("성공적으로 저장 되었습니다.");
            onChangePage(searchObj)
        }
    }
    const onProcessWithdraw = async (data = {}) => {
        let { mid, tid } = data;
        let result = await apiServer(`${process.env.API_URL}/api/withdraw/v${themeDnsData?.setting_obj?.api_withdraw_version}/withdraw/check`, 'create', {
            api_key: themeDnsData?.api_key,
            mid,
            tid,
        });
        if (result) {
            onChangePage(searchObj);
        }
    }
    const onChangeTrxId = async () => {
        let result = undefined
        result = await apiManager('withdraws/trx-id', 'update', dialogObj);
        setDialogObj({});
        onChangePage(searchObj);
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
        </>
    )
}
WithdrawList.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default WithdrawList;