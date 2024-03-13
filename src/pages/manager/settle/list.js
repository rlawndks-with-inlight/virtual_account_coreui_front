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
import DefaultLayout from 'src/layout/DefaultLayout';


const SettleList = () => {

    const { user } = useAuthContext();
    const { themeDnsData } = useSettingsContext();
    const [searchObj, setSearchObj] = useState({
        page: 1,
        page_size: 30,
        s_dt: '',
        e_dt: '',
        search: '',
        level: 10,
    })
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
            id: 'pay_type',
            label: '보유정산금 구분',
            action: (row, is_excel) => {
                return getChip(payTypeList, row?.pay_type, !is_excel)
            }
        },
        {
            id: 'level',
            label: '등급 구분',
            action: (row, is_excel) => {
                return getUserLevelByNumber(row['level'])
            }
        },
        {
            id: 'nickname',
            label: '상호',
            action: (row, is_excel) => {
                if (is_excel) {
                    return `${row[`nickname`]} (${row['user_name']})`
                }
                return <div style={{ textAlign: 'center' }}>{`${row[`nickname`]}\n(${row['user_name']})`}</div>
            }
        },
        {
            id: 'ago_amount',
            label: '기존 보유정산금',
            action: (row, is_excel) => {
                let amount = row['new_amount'] - row['user_amount'];
                return commarNumber(amount)
            }
        },
        {
            id: 'amount',
            label: '발생 보유정산금',
            action: (row, is_excel) => {
                let amount = row['user_amount'];
                return (amount > 0 ? '+' : '') + commarNumber(amount)
            },
            sx: (row) => {
                let amount = row['user_amount'];
                return {
                    color: `${amount > 0 ? 'blue' : 'red'}`
                }
            },
        },
        {
            id: 'new_amount',
            label: '이후 보유정산금',
            action: (row, is_excel) => {
                let amount = row['new_amount'];
                return commarNumber(amount)
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
            label: '발생일시',
            action: (row, is_excel) => {
                return row['created_at'] ?? "---"
            }
        },
    ]
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState({});
    const [operUserList, setOperUserList] = useState([]);

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
    useEffect(() => {
        let cols = defaultColumns;
        setColumns(cols)
    }, [searchObj])
    const pageSetting = () => {
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
        setSearchObj(obj);
        setData({
            ...data,
            content: undefined
        })
        let data_ = await apiManager('settles', 'list', obj);
        if (data_) {
            setData(data_);
        }
    }
    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>보유정산금 내역</CCardHeader>
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
SettleList.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default SettleList;