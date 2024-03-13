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
import { apiManager } from 'src/utils/api-manager';
import { bankCodeList, operatorLevelList, payTypeList, withdrawStatusList } from 'src/utils/format';
import { commarNumber, getUserFee, getUserLevelByNumber } from 'src/utils/function';
import DefaultLayout from 'src/layout/DefaultLayout';


const ReserveList = () => {

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
        let data_ = await apiManager('reserves', 'list', obj);
        if (data_) {
            setData(data_);
        }
        setSearchObj(obj);
    }
    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>유보금 내역</CCardHeader>
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
                                excel_name={'유보금'}
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
ReserveList.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default ReserveList;