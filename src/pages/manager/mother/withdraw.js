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
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { Icon } from '@iconify/react';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from 'src/components/auth/useAuthContext';
import { Col, Content, Label, Row } from 'src/components/element/styled-componsts';
import { useSettingsContext } from 'src/components/settings';
import DefaultLayout from 'src/layout/DefaultLayout';
import { apiManager } from 'src/utils/api-manager';
import { bankCodeList } from 'src/utils/format';
import { commarNumber, commarNumberInput, getNumberByPercent, onlyNumberText } from 'src/utils/function';
import styled from 'styled-components';

const MotherWithdraw = () => {
    const { user } = useAuthContext();
    const { themeDnsData } = useSettingsContext();

    const router = useRouter();;
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState({
        withdraw_amount: 0,
    })

    useEffect(() => {
        settingPage();
    }, [])
    const settingPage = async () => {
        let data = await apiManager('withdraws/mother', 'get',);
        setItem({
            ...item,
            ...data,
        });
        setLoading(false);
    }
    const onSave = async () => {
        if (window.confirm('출금요청 하시겠습니까?')) {
            let result = undefined

            result = await apiManager('withdraws/mother', 'create', {
                withdraw_amount: item?.withdraw_amount,
                user_id: user?.id,
                pay_type: 10,
                note: item?.note,
            });

            if (result) {
                alert("성공적으로 저장 되었습니다.");
                window.location.reload();
            }
        }
    }
    const getManagerAmount = () => {
        let real_amount = item?.real_amount;
        real_amount -= item?.sum?.total_mcht_amount;
        real_amount -= item?.sum?.total_oper_amount;
        real_amount += item?.sum?.total_withdraw_fee;
        real_amount -= (_.sum(item?.childrens.map(children => { return children?.real_amount })) ?? 0);
        real_amount += (_.sum(item?.childrens.map(children => { return (330 * children?.sum?.total_deposit_count + 330 * children?.sum?.total_withdraw_count) })) ?? 0);
        real_amount += (_.sum(item?.childrens.map(children => { return getNumberByPercent(children?.sum?.total_deposit_amount, (children?.brand?.head_office_fee)) })) ?? 0);
        return real_amount
    }

    return (
        <>
            {!loading &&
                <>
                    <CRow>
                        <CCol xs>
                            <CCard className="mb-4">
                                <CCardHeader>모계좌출금 요청</CCardHeader>
                                <CCardBody>
                                    <Col style={{ rowGap: '1rem' }}>
                                        <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                                            <CButtonGroup>
                                                <CButton color='danger' style={{ borderRadius: '0', lineHeight: '1.5', padding: '.5rem .5rem' }} />
                                            </CButtonGroup>
                                            <div style={{ color: 'blue' }}>은행점검시간에는 출금 요청이 불가능합니다. 은행점검시간 (※한국시간기준 출금 : 23:20 ~ 00:30, 입금 : 23:30 ~ 00:10 )</div>
                                        </Row>
                                        <Content>
                                            <Label>입금계좌</Label>
                                            <Row>
                                                <CFormInput size='sm' className='content-input' disabled value={`${_.find(bankCodeList('withdraw'), { value: item?.brand?.settle_bank_code })?.label} ${item?.brand?.settle_acct_num} ${item?.brand?.settle_acct_name}`} />
                                            </Row>
                                        </Content>
                                        <Content>
                                            <Label>모계좌 잔액</Label>
                                            <Row> {commarNumber(item?.real_amount)} 원</Row>
                                        </Content>
                                        <Content>
                                            <Label>출금 수수료</Label>
                                            <Row>0 원</Row>
                                        </Content>
                                        <Content>
                                            <Label>출금후 잔액</Label>
                                            <Row> {commarNumber(item?.real_amount - item?.withdraw_amount)} 원</Row>
                                        </Content>
                                        <Content>
                                            <Label>가맹점 보유정산금총합</Label>
                                            <Row>{commarNumber(item?.sum?.total_mcht_amount)} 원</Row>
                                        </Content>
                                        <Content>
                                            <Label>{themeDnsData.operator_list.map((itm) => { return itm?.label }).join()} 보유금 총합</Label>
                                            <Row>{commarNumber(item?.sum?.total_oper_amount)} 원</Row>
                                        </Content>
                                        <Content>
                                            <Label>차액 (본사 보유정산금)</Label>
                                            <Row>  {commarNumber(getManagerAmount())} 원</Row>
                                        </Content>
                                        <Content>
                                            <Label>출금가능금액</Label>
                                            <Row> {commarNumber(item?.real_amount)} 원</Row>
                                        </Content>
                                        <Content>
                                            <Label>출금 요청금</Label>
                                            <Row style={{ alignItems: 'center', columnGap: '0.5rem' }}>
                                                <CFormInput
                                                    size='sm'
                                                    className='content-input'
                                                    value={commarNumberInput(item?.withdraw_amount)}
                                                    onChange={(e) => {
                                                        setItem(
                                                            {
                                                                ...item,
                                                                ['withdraw_amount']: onlyNumberText(e.target.value)
                                                            }
                                                        )
                                                    }} />
                                                <div>원</div>
                                            </Row>
                                        </Content>
                                        <CButton style={{ marginLeft: 'auto' }} color='warning' size='sm' onClick={onSave}>
                                            <Row style={{ alignItems: 'center', columnGap: '0.2rem' }}>
                                                <Icon icon={'la:dot-circle'} style={{ fontSize: '1rem' }} />
                                                <div>출금 요청하기</div>
                                            </Row>
                                        </CButton>
                                    </Col>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </>}
        </>
    )
}
MotherWithdraw.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default MotherWithdraw;