import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CButton, CFormInput, CFormSelect, CHeaderDivider, CInputGroup, CInputGroupText, CPagination, CPaginationItem, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import { Row } from "../element/styled-componsts";
import { Icon } from "@iconify/react";
import { returnMoment } from "src/utils/function";
import { useSettingsContext } from '../settings';

const ManagerTable = (props) => {

    const { columns, data, add_button_text, add_link, onChangePage, searchObj, head_columns = [], width, table, excel_name, between_content, column_table } = props;
    const { page, page_size } = props?.searchObj;

    const router = useRouter();
    const { themeNotShowColumns, onChangeNotShowColumns, themeDnsData } = useSettingsContext();
    const [sDt, setSDt] = useState(undefined);
    const [eDt, setEDt] = useState(undefined);
    const [keyword, setKeyWord] = useState("");
    const [zColumn, setZColumn] = useState([]);
    const [zHeadColumn, setZHeadColumn] = useState([]);
    const [openProcessColumns, setOpenProcessColumns] = useState(false);

    useEffect(() => {
        settingColumns();
    }, [columns, head_columns, router.pathname]);

    const settingColumns = async () => {
        try {
            let column_list = [...columns];
            let head_column_list = [...head_columns];
            setZColumn(column_list);
            setZHeadColumn(head_column_list);
        } catch (err) {
            console.log(err)
        }

    }

    const getMaxPage = (total = 0, page_size = 1) => {
        if (total == 0) {
            return 1;
        }
        if (total % parseInt(page_size) == 0) {
            return parseInt(total / parseInt(page_size));
        } else {
            return parseInt(total / parseInt(page_size)) + 1;
        }
    }

    if (!(zColumn.length > 0)) {
        return (
            <>

            </>
        )
    }

    const onClickDateButton = (num) => {
        let s_dt = 0;
        let e_dt = 0;

        if (num == 1) {
            s_dt = returnMoment().substring(0, 10);
            e_dt = returnMoment().substring(0, 10);
        } else if (num == -1) {
            s_dt = returnMoment(-1).substring(0, 10);
            e_dt = returnMoment(-1).substring(0, 10);
        } else if (num == 3) {
            s_dt = returnMoment(-3).substring(0, 10);
            e_dt = returnMoment(-1).substring(0, 10);
        } else if (num == 7) {
            s_dt = returnMoment(-7).substring(0, 10);
            e_dt = returnMoment(-1).substring(0, 10);
        } else if (num == 30) {
            let moment = returnMoment().substring(0, 10);
            moment = moment.split('-');
            if (moment[1] == '01') {
                moment[1] = '12';
                moment[0] = moment[0] - 1;
            } else {
                moment[1] = moment[1] - 1;
            }
            s_dt = `${moment[0]}-${moment[1] >= 10 ? moment[1] : `0${moment[1]}`}-01`;
            e_dt = returnMoment(undefined, new Date(moment[0], moment[1], 0)).substring(0, 10);
        }

        setSDt(s_dt);
        setEDt(e_dt);
        onChangePage({
            ...searchObj,
            s_dt: s_dt,
            e_dt: e_dt,
        })
    }

    const exportExcel = async () => {
        let data = await apiManager(table, 'list', { ...searchObj, page_size: 50000 });
        let result = [];
        for (var i = 0; i < data.content.length; i++) {
            let col = data.content[i];
            result[i] = [];
            for (var j = 0; j < zColumn.length; j++) {
                let text = zColumn[j].action(col, true);
                result[i].push(text);
            }
        }
        await excelDownload(result, zColumn, excel_name);
    }

    const getPageList = () => {
        let max_page = getMaxPage(data?.total, data?.page_size);
        let page_list = [];
        for (var i = 1; i <= max_page; i++) {
            page_list.push(i);
        }
        return page_list;
    }

    return (
        <>
            <div style={{ width: '100%', overflow: 'auto' }}>
                <Row style={{ flexWrap: 'wrap', columnGap: '0.5rem' }}>
                    <CInputGroup size="sm" style={{ width: 'auto' }}>
                        <CInputGroupText>기간</CInputGroupText>
                        <CFormInput type="date" value={sDt} onChange={(e) => {
                            setSDt(e.target.value)
                            onChangePage({
                                ...searchObj,
                                s_dt: e.target.value,
                                page: 1,
                            })
                        }} />
                        <div style={{ margin: '0 0.2rem' }}>-</div>
                        <CFormInput type="date" value={eDt} onChange={(e) => {
                            setEDt(e.target.value)
                            onChangePage({
                                ...searchObj,
                                e_dt: e.target.value,
                                page: 1,
                            })
                        }} />
                    </CInputGroup>
                    <Row style={{ columnGap: '0.2rem' }}>
                        <CButton color="light" size="sm" onClick={() => onClickDateButton(1)}>당일</CButton>
                        <CButton color="light" size="sm" onClick={() => onClickDateButton(-1)}>어제</CButton>
                        <CButton color="light" size="sm" onClick={() => onClickDateButton(7)}>일주일</CButton>
                    </Row>
                    <CInputGroup size="sm" style={{ width: 'auto' }}>
                        <CFormInput type="text" size="sm" style={{ width: 'auto' }} value={keyword} onChange={(e) => {
                            setKeyWord(e.target.value)
                        }} />
                    </CInputGroup>
                    <CInputGroup size="sm" style={{ width: 'auto' }}>
                        <CFormSelect size="sm"
                            value={searchObj?.page_size}
                            style={{ width: 'auto' }}
                            onChange={(e) => {
                                console.log(e.target.value)
                                onChangePage({
                                    ...searchObj,
                                    page_size: e.target.value,
                                    page: 1,
                                })
                            }}>
                            {[10, 20, 30, 50, 100, 200].map(num => {
                                return <option value={num}>{num}건</option>
                            })}
                        </CFormSelect>
                    </CInputGroup>
                    <CButton color="warning" size="sm" onClick={() => {
                        onChangePage({
                            ...searchObj,
                            search: keyword,
                            page: 1,
                        })
                    }}>
                        <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                            <Icon icon={'material-symbols-light:search'} style={{ fontSize: '1rem' }} />
                            <div>검색</div>
                        </Row>
                    </CButton>
                    <CButton color="success" size="sm" style={{ color: '#fff' }} onClick={exportExcel}>엑셀 출력</CButton>
                </Row>
                <hr />
                {between_content}
                <div style={{ width: '100%', overflow: 'auto' }}>
                    <CTable style={{ fontSize: '12px', marginBottom: '0' }} hover>
                        <CTableHead>
                            <CTableRow style={{ fontWeight: 'normal' }}>
                                {zColumn && zColumn.map((col, idx) => (
                                    <>
                                        {(themeNotShowColumns[column_table] ?? {})[col?.id] != 1 &&
                                            <>
                                                <CTableHeaderCell scope="col" style={{ whiteSpace: 'nowrap', border: '1px solid #c8ced3', textAlign: 'center', background: 'transparent' }}>{col?.label}</CTableHeaderCell>
                                            </>}
                                    </>
                                ))}
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {data.content && data.content.map((row, index) => (
                                <CTableRow key={index} index={index} >
                                    {zColumn && zColumn.map((col, idx) => (
                                        <>
                                            {(themeNotShowColumns[column_table] ?? {})[col?.id] != 1 &&
                                                <>
                                                    <CTableDataCell align="left" style={{
                                                        ...(col?.sx ? col.sx(row) : {}),
                                                        border: '1px solid #c8ced3',
                                                        padding: '4px',
                                                        textAlign: 'center',
                                                        lineHeight: '1.2',
                                                        background: `${index % 2 == 0 ? 'rgba(0,0,0,.05)' : 'transparent'}`,
                                                        whiteSpace: 'pre'
                                                    }}>
                                                        {col.action(row, false)}
                                                    </CTableDataCell>
                                                </>}
                                        </>
                                    ))}
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </div>

            </div>
            <Row>
                <CPagination style={{ margin: '1rem auto 0 auto' }}>
                    <CPaginationItem onClick={() => {
                        onChangePage({
                            ...searchObj,
                            page: 1
                        })
                    }}>
                        <span aria-hidden="true">&laquo;</span>
                    </CPaginationItem>
                    <CPaginationItem onClick={() => {
                        if (page > 1) {
                            onChangePage({
                                ...searchObj,
                                page: page - 1
                            })
                        }
                    }}>
                        <span aria-hidden="true">Prev</span>
                    </CPaginationItem>
                    {getPageList().map((num) => (
                        <>
                            <CPaginationItem active={num == page} onClick={() => {
                                onChangePage({
                                    ...searchObj,
                                    page: num
                                })
                            }}>{num}</CPaginationItem>
                        </>
                    ))}
                    <CPaginationItem onClick={() => {
                        if (page < getPageList().length) {
                            onChangePage({
                                ...searchObj,
                                page: page + 1
                            })
                        }
                    }}>
                        <span aria-hidden="true">Next</span>
                    </CPaginationItem>
                    <CPaginationItem onClick={() => {
                        onChangePage({
                            ...searchObj,
                            page: getPageList().length
                        })
                    }}>
                        <span aria-hidden="true">&raquo;</span>
                    </CPaginationItem>
                </CPagination>
            </Row>

        </>
    )
}

export default ManagerTable;
