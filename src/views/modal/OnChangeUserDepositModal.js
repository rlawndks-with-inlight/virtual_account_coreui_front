import { CButton, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react";
import { useEffect, useState } from "react";
import { Col, Content, Label, Row } from "src/components/element/styled-componsts";
import { commarNumber, onlyNumberText } from "src/utils/function";



const OnChangeUserDepositModal = (props) => {
    const { open, onClose, onSave } = props;
    const [onChangeUserDepositObj, setOnChangeUserDepositObj] = useState({});
    useEffect(() => {
        setOnChangeUserDepositObj({});
    }, [open])
    return (
        <>
            <CModal visible={open} onClose={onClose}>
                <CModalHeader>
                    <CModalTitle>보유정산금 수동지급</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Col style={{ rowGap: '1rem' }}>
                        <Content>
                            <Label>지급 보유정산금</Label>
                            <Row>
                                <CFormInput size='sm' className='content-input' value={onChangeUserDepositObj.amount}
                                    onChange={(e) => {
                                        setOnChangeUserDepositObj({
                                            ...onChangeUserDepositObj,
                                            amount: onlyNumberText(e.target.value)
                                        })
                                    }}
                                />
                            </Row>
                        </Content>
                        <Content>
                            <Label>메모</Label>
                            <Row>
                                <CFormInput size='sm' className='content-input' value={onChangeUserDepositObj.note}
                                    onChange={(e) => {
                                        setOnChangeUserDepositObj({
                                            ...onChangeUserDepositObj,
                                            note: e.target.value
                                        })
                                    }}
                                />
                            </Row>
                        </Content>
                    </Col>
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" size="sm" style={{ color: '#fff' }} onClick={() => {
                        if (window.confirm(`보유정산금 ${commarNumber(onChangeUserDepositObj?.amount)}원을 차감 하시겠습니까?`)) {
                            onSave({ ...onChangeUserDepositObj, pay_type: 30 });
                        }
                    }}>
                        차감하기
                    </CButton>
                    <CButton color="warning" size="sm" onClick={() => {
                        if (window.confirm(`보유정산금 ${commarNumber(onChangeUserDepositObj?.amount)}원을 지급 하시겠습니까?`)) {
                            onSave({ ...onChangeUserDepositObj, pay_type: 25 });
                        }
                    }}>
                        지급하기
                    </CButton>
                </CModalFooter>
                <CModalFooter>
                    <CButton color="dark" onClick={onClose}>
                        닫기
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default OnChangeUserDepositModal;