import { CBadge } from "@coreui/react";
import { getLocalStorage } from "./local-storage"
import _ from "lodash";

export const userLevelList = [
    { value: 50, label: '개발사', color: '' },
    { value: 45, label: '상위사', color: '' },
    { value: 40, label: '본사', color: '' },
    { value: 30, label: '', color: '' },
    { value: 25, label: '', color: '' },
    { value: 20, label: '', color: '' },
    { value: 17, label: '', color: '' },
    { value: 15, label: '', color: '' },
    { value: 13, label: '', color: '' },
    { value: 10, label: '가맹점', color: '' },
    { value: 0, label: '일반유저', color: '' },
]
export const userStatusList = [
    { value: 0, label: '정상', color: 'success' },
    { value: 1, label: '가입대기', color: 'warning' },
    { value: 2, label: '로그인금지', color: 'danger' },
]
export const userWithdrawHoldList = [
    { value: 0, label: '미보류', color: 'warning' },
    { value: 1, label: '보류', color: 'danger' },
]
export const operatorLevelList = [
    { value: 30, label: '' },
    { value: 25, label: '' },
    { value: 20, label: '' },
    { value: 17, label: '' },
    { value: 15, label: '' },
    { value: 13, label: '' },
]
export const bankCodeList = (pay_type = 'deposit') => {
    let dns_data = getLocalStorage('themeDnsData');
    dns_data = JSON.parse(dns_data);
    return dns_data?.bank_list[pay_type];
}

export const apiCorpList = [
    { value: 1, label: '뱅크너스' },
    { value: 2, label: '쿠콘' },
    { value: 3, label: '페이투스' },
    { value: 4, label: '더즌' },
    { value: 5, label: '헥토파이낸셜' },
]
export const virtualAccountStatusList = [
    { value: 0, label: '정상', color: 'success' },
    { value: 5, label: '생성중', color: 'warning' },
]
export const payTypeList = [
    { value: 0, label: '입금', color: 'success' },
    { value: 5, label: '출금', color: 'danger' },
    { value: 10, label: '모계좌출금', color: 'info' },
    { value: 12, label: '모계좌삭감', color: 'danger' },
    { value: 15, label: '가맹점 -> 모계좌이체', color: 'warning' },
    { value: 20, label: '사용자 이체', color: 'warning' },
    { value: 25, label: '관리자 지급', color: 'info' },
    { value: 30, label: '관리자 차감', color: 'warning' },
]
export const withdrawStatusList = [
    { value: 0, label: '출금완료', color: 'success' },
    { value: 5, label: '출금요청완료', color: 'warning' },
    { value: 10, label: '출금실패', color: 'danger' },
    { value: 15, label: '출금반려', color: 'danger' },
    { value: 20, label: '출금대기', color: 'warning' },
]
export const virtualAccountUserTypeList = [
    { value: 0, label: '개인', color: 'success' },
    { value: 1, label: '법인', color: 'success' },
    { value: 2, label: '개인사업자', color: 'success' },
]
export const withdrawTypeList = [
    { value: 0, label: 'guid 설정 출금방식', color: 'success' },
    { value: 1, label: '직접설정출금방식', color: 'success' },
]
export const withdrawFeeTypeList = [
    { value: 0, label: '추가형식 (감소정산금: 출금액 + 출금수수료)', color: 'success' },
    { value: 1, label: '감소형식 (감소정산금: 출금액)', color: 'success' },
]
export const genderList = [
    { label: '남자', value: 'M' },
    { label: '여자', value: 'F' },
]
export const ntvFrnrList = [
    { label: '내국인', value: 'L' },
    { label: '외국인', value: 'F' },

]
export const virtualAcctLinkStatusList = [
    { label: '정상', value: 0 },
    { label: '차단', value: 1 },
]
export const telComList = [
    { label: 'SKT', value: '01' },
    { label: 'KT', value: '02' },
    { label: 'LGU+', value: '03' },
    { label: '알뜰폰SKT', value: '04' },
    { label: '알뜰폰KT', value: '05' },
    { label: '알뜰폰LGU', value: '06' },
]
export const postTypeList = [
    { label: '공지사항', value: 0 },
    { label: '자주하는질문', value: 1 },
    { label: '팝업', value: 2 },
]

export const getChip = (list = [], value, is_chip) => {
    if (is_chip) {
        return <CBadge color={_.find(list, { value: value })?.color}>{_.find(list, { value: value })?.label}</CBadge>
    } else {
        return _.find(list, { value: value })?.label;
    }
}