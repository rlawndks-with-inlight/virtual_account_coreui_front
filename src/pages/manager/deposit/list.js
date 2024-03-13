import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
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
import { apiManager } from 'src/utils/api-manager';
import { bankCodeList, operatorLevelList } from 'src/utils/format';
import { commarNumber, getUserFee } from 'src/utils/function';
import DefaultLayout from 'src/layout/DefaultLayout';


const DepositList = () => {

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
                return row['trx_id'] ?? "---"
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
            id: 'mcht_nickname',
            label: '가맹점명',
            action: (row, is_excel) => {
                if (!row?.mcht_user_name) {
                    return "---";
                }
                return `${row[`mcht_nickname`]}\n(${row['mcht_user_name']})`
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
            id: 'virtual_bank_code',
            label: '입금은행',
            action: (row, is_excel) => {
                return `${_.find(bankCodeList(), { value: row['virtual_bank_code'] })?.label ?? "---"}`
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
            id: 'virtual_acct_num',
            label: '가상계좌번호',
            action: (row, is_excel) => {
                return row['virtual_acct_num'] ?? "---"
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
            id: 'deposit_acct_name',
            label: '입금자명',
            action: (row, is_excel) => {
                return row['deposit_acct_name'] ?? "---"
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
            id: 'status',
            label: '상태',
            action: (row, is_excel) => {
                return row['deposit_status'] ?? "---"
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
            id: 'created_at',
            label: '입금일시',
            action: (row, is_excel) => {
                return row['created_at'].replace(' ', '\n') ?? "---"
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
            id: 'expect_amount',
            label: '입금예정금액',
            action: (row, is_excel) => {
                return commarNumber(row['expect_amount'])
            },
            sx: (row) => {
                if (row?.deposit_status == 10) {
                    return {
                        color: 'red'
                    }
                }
                return {
                    color: 'green'
                }
            },
        },
        {
            id: 'amount',
            label: '실제입금금액',
            action: (row, is_excel) => {
                return commarNumber(row['amount'])
            },
            sx: (row) => {
                if (row?.deposit_status == 10) {
                    return {
                        color: 'red'
                    }
                }
                return {
                    color: 'blue'
                }
            },
        },
        {
            id: 'mcht_fee',
            label: '가맹점 요율',
            action: (row, is_excel) => {
                return row['mcht_fee']
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
            id: 'mcht_amount',
            label: '가맹점 정산금액',
            action: (row, is_excel) => {
                return commarNumber(row['mcht_amount'])
            },
            sx: (row) => {
                if (row?.deposit_status == 10) {
                    return {
                        color: 'red'
                    }
                }
                return {
                    color: '#a52a2a'
                }
            },
        },
        {
            id: 'alarm',
            label: '알림',
            action: (row, is_excel) => {
                return '???'
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

            id: 'deposit_bank_code',
            label: '입금계좌정보',
            action: (row, is_excel) => {
                let bank_list = bankCodeList();
                if (row?.is_type_withdraw_acct == 1) {
                    bank_list = bankCodeList('withdraw');
                }
                if (is_excel) {
                    return `${_.find(bank_list, { value: row['deposit_bank_code'] })?.label ?? "---"} ${row['deposit_acct_num']} ${row['deposit_acct_name']}`
                }
                return <Col>
                    <div>{_.find(bank_list, { value: row['deposit_bank_code'] })?.label ?? "---"}</div>
                    <div>{row['deposit_acct_num']} {row['deposit_acct_name']}</div>
                </Col>
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
            id: 'virtual_birth',
            label: '생년월일',
            action: (row, is_excel) => {
                return row['virtual_birth'] ?? "---"
            },
            sx: (row) => {

                if (row?.deposit_status == 10) {
                    return {
                        color: 'red'
                    }
                }
            },
        },
        ...(themeDnsData?.is_use_fee_operator == 1 ? [
            ...(user?.level >= 40 ? [
                {
                    id: 'head_office_amount',
                    label: '본사 수수료',
                    action: (row, is_excel) => {
                        return commarNumber(row['head_office_amount'])
                    },
                    sx: (row) => {
                        if (row?.deposit_status == 10) {
                            return {
                                color: 'red'
                            }
                        }
                        return {
                            color: '#a52a2a'
                        }
                    },
                },
            ] : []),
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
                            },
                            sx: (row) => {
                                if (row?.deposit_status == 10) {
                                    return {
                                        color: 'red'
                                    }
                                }
                            },
                        },
                        ...(user?.level >= 40 ? [
                            {
                                id: `sales${operator?.num}_get_fee`,
                                label: `${label} 요율`,
                                action: (row, is_excel) => {
                                    return row[`sales${operator?.num}_id`] > 0 ? parseFloat(getUserFee(row, operator?.value, themeDnsData?.operator_list, themeDnsData?.head_office_fee)) + '%' : "---"
                                },
                                sx: (row) => {
                                    if (row?.deposit_status == 10) {
                                        return {
                                            color: 'red'
                                        }
                                    }
                                },
                            },
                        ] : []),
                        {
                            id: `sales${operator?.num}_amount`,
                            label: `${label} 수수료`,
                            action: (row, is_excel) => {
                                return row[`sales${operator?.num}_amount`] > 0 ? commarNumber(row[`sales${operator?.num}_amount`]) : "---"
                            },
                            sx: (row) => {
                                if (row?.deposit_status == 10) {
                                    return {
                                        color: 'red'
                                    }
                                }
                                return {
                                    color: '#a52a2a'
                                }
                            },
                        },
                    ]
                } else {
                    return []
                }

            }).flat(),
        ] : []),
        {
            id: 'deposit_fee',
            label: '입금수수료',
            action: (row, is_excel) => {
                return commarNumber(row['deposit_fee'])
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
            id: 'is_return',
            label: '반환여부',
            action: (row, is_excel) => {
                return '???'
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
            id: 'virtual_created_at',
            label: '발급일시',
            action: (row, is_excel) => {
                return (row['virtual_created_at'] ?? "---").replace(' ', '\n') ?? "---"
            },
            sx: (row) => {

                if (row?.deposit_status == 10) {
                    return {
                        color: 'red'
                    }
                }
            },
        },
    ]
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState({});
    const [operUserList, setOperUserList] = useState([]);
    const [corpAccountList, setCorpAccountList] = useState([]);
    const [dialogObj, setDialogObj] = useState({
        changeNote: false,
    })
    const [searchObj, setSearchObj] = useState({
        page: 1,
        page_size: 30,
        s_dt: '',
        e_dt: '',
        search: '',
    })

    useEffect(() => {
        pageSetting();
    }, [])
    useEffect(() => {
        socket.on('message', (msg) => {
            let { method, data, brand_id, title } = msg;
            if (brand_id == themeDnsData?.id && (user?.level >= 40 || (user?.id == data?.user_id))) {
                let method_list = [`deposit`, 'settle_request']
                if (method == 'deposit' && themeDnsData?.setting_obj?.is_reload_when_deposit == 1) {
                    onChangePage(searchObj);
                }
            }
        });
    }, [])
    const pageSetting = () => {
        let cols = defaultColumns;
        setColumns(cols)
        getAllOperUser();
        if (themeDnsData?.is_use_corp_account == 1) {
            getCorpAccounts();
        }
        onChangePage({ ...searchObj, page: 1 });

    }
    const getAllOperUser = async () => {
        let data = await apiManager('users', 'list', {
            level_list: [10, ...operatorLevelList.map(itm => { return itm.value })],
        });
        setOperUserList(data?.content ?? []);
    }
    const getCorpAccounts = async () => {
        let data = await apiManager('corp-accounts', 'list', {
            page: 1,
        });
        setCorpAccountList(data?.content ?? []);
    }
    const onChangePage = async (obj) => {
        setData({
            ...data,
            content: undefined
        })
        let data_ = await apiManager('deposits', 'list', obj);
        if (data_) {
            setData(data_);
        }
        setSearchObj(obj);
    }
    const onChagneNote = async () => {
        let result = await apiManager('deposits/change-note', 'create', dialogObj);
        if (result) {
            alert("성공적으로 저장 되었습니다.");
            setDialogObj({});
            onChangePage(searchObj);
        }
    }
    const betweenContent = (is_label, content, sx = {}) => {
        return <CTableHeaderCell scope="col" style={{
            background: `${is_label ? 'transparent' : theme.color.yellow}`,
            padding: '4px',
            border: '1px solid #c8ced3',
            fontWeight: 'normal',
            ...sx,
        }}>{content}</CTableHeaderCell>
    }
    console.log(data?.chart)
    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>거래 내역</CCardHeader>
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
                                excel_name={'입금'}
                                between_content={<Row style={{ marginBottom: "1rem" }}>
                                    <CTable style={{ fontSize: '12px', marginBottom: '0', background: 'transparent' }} hover>
                                        <CTableHead style={{ background: 'transparent' }}>
                                            <CTableRow style={{ fontWeight: 'normal' }}>
                                                {data?.content &&
                                                    <>
                                                        {betweenContent(true, '조회건수', {
                                                            borderLeft: 'none'
                                                        })}
                                                        {betweenContent(false, commarNumber(data?.total) + '건')}
                                                        {betweenContent(true, '입금예정금액')}
                                                        {betweenContent(false, commarNumber(data?.chart?.expect_amount) + '원')}
                                                        {betweenContent(true, '실제입금금액')}
                                                        {betweenContent(false, commarNumber(data?.chart?.amount) + '원')}
                                                        {betweenContent(true, '가맹점정산금액')}
                                                        {betweenContent(false, commarNumber(data?.chart?.mcht_amount) + '원')}
                                                        {user?.level >= 40 &&
                                                            <>
                                                                {betweenContent(true, '본사수수료')}
                                                                {betweenContent(false, commarNumber(data?.chart?.head_office_amount) + '원')}
                                                            </>}
                                                        {themeDnsData?.operator_list.map(oper => {
                                                            if (user?.level >= oper?.value) {
                                                                return <>
                                                                    {betweenContent(true, `${oper?.label}수수료`)}
                                                                    {betweenContent(false, `${commarNumber(data?.chart[`sales${oper?.num}_amount`])}원`)}
                                                                </>
                                                            }
                                                        })}
                                                        {user?.level >= 40 &&
                                                            <>
                                                                {betweenContent(true, '총 영업자 수수료')}
                                                                {betweenContent(false, `${commarNumber(_.sum(themeDnsData?.operator_list.map(oper => { return data?.chart[`sales${oper?.num}_amount`] })))}원`)}
                                                            </>}
                                                        {betweenContent(true, '입금수수료')}
                                                        {betweenContent(false, commarNumber(data?.chart?.deposit_fee) + '원', {
                                                            borderRight: 'none'
                                                        })}
                                                    </>}

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
DepositList.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default DepositList;