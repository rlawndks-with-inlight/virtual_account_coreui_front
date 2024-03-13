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
import { bankCodeList, getChip, operatorLevelList, payTypeList } from 'src/utils/format';
import { commarNumber, getUserFee, getUserLevelByNumber } from 'src/utils/function';


const MotherHistoryList = () => {

    const { user } = useAuthContext();
    const { themeDnsData } = useSettingsContext();

    const getAmount = (row = {}) => {
        let amount = 0;
        if (row['pay_type'] == 0) {
            amount = row['amount'];
        } else if (row['pay_type'] == 5) {
            amount = row['amount'] + row['withdraw_fee'];
        } else if (row['pay_type'] == 10) {
            amount = row['amount'];
        } else if (row['pay_type'] == 12) {
            amount = row['amount'];
        } else if (row['pay_type'] == 15) {
            amount = row['amount'];
        } else if (row['pay_type'] == 20) {
            amount = row['amount'] + row['withdraw_fee'];
        }
        return amount
    }
    const getFee = (row = {}) => {
        let deposit_list = [0, 15, 25];
        let withdraw_list = [5, 10, 20, 30];
        let fee = 0;

        if (deposit_list.includes(row?.pay_type)) {
            fee = row?.deposit_fee;
        } else if (withdraw_list.includes(row?.pay_type)) {
            fee = row?.withdraw_fee;
        }
        return fee;
    }
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
            }
        },
        {
            id: 'level',
            label: '등급 구분',
            action: (row, is_excel) => {
                if (row?.pay_type == 5) {
                    return getUserLevelByNumber(row['level'])
                } else {
                    return '가맹점'
                }
            }
        },
        {
            id: 'pay_type',
            label: '구분',
            action: (row, is_excel) => {

                return getChip(payTypeList, row['pay_type'], !is_excel)
            }
        },
        {
            id: 'nickname',
            label: '상호',
            action: (row, is_excel) => {
                let text = row['user_name'] ? `${row[`nickname`]}\n(${row['user_name']})` : "---";
                return text;
            }
        },
        {
            id: 'amount',
            label: '금액',
            action: (row, is_excel) => {
                let amount = getAmount(row)
                return (amount > 0 ? '+' : '') + commarNumber(amount)
            },
            sx: (row) => {
                let amount = getAmount(row)
                return {
                    color: `${amount > 0 ? 'blue' : 'red'}`
                }
            },
        },
        {
            id: 'fee',
            label: '수수료',
            action: (row, is_excel) => {
                let fee = getFee(row);
                return commarNumber(fee)
            }
        },
        {
            id: 'real_amount',
            label: '실제금액',
            action: (row, is_excel) => {
                let amount = getAmount(row);
                let fee = getFee(row);
                if (row?.pay_type == 0) {
                    amount -= fee;
                }
                return (amount > 0 ? '+' : '') + commarNumber(amount)
            },
            sx: (row) => {
                let amount = getAmount(row)
                return {
                    color: `${amount > 0 ? 'blue' : 'red'}`
                }
            },
        },
        {
            id: 'note',
            label: '메모',
            action: (row, is_excel) => {
                return row['note']
            }
        },
        {
            id: 'created_at',
            label: '거래일시',
            action: (row, is_excel) => {
                return row['created_at'] ?? "---"
            }
        },
    ]
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState({});
    const [searchObj, setSearchObj] = useState({
        page: 1,
        page_size: 30,
        s_dt: '',
        e_dt: '',
        search: '',
        is_mother: 1,
    })
    const [changeMotherDepositObj, setChangeMotherDepositObj] = useState({
        amount: 0,
    })
    useEffect(() => {
        pageSetting();
    }, [])
    const pageSetting = () => {
        let cols = defaultColumns;
        setColumns(cols)
        onChangePage({ ...searchObj, page: 1 });
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

    const onChangeMotherDeposit = async () => {
        setChangeMotherDepositObj({})
        let result = await apiManager(`brands/change-deposit`, 'create', changeMotherDepositObj)
        if (result) {
            alert("성공적으로 저장 되었습니다.");
            onChangePage(searchObj);
        }
    }
    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>모계좌 내역</CCardHeader>
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

export default MotherHistoryList;