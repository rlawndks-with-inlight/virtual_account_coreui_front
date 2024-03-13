import React, { useEffect, useState } from 'react'

import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { useSettingsContext } from './components/settings'
import { operatorLevelList } from './utils/format'
import { useAuthContext } from './components/auth/useAuthContext'
import { Icon } from '@iconify/react'

const _nav = (is_show_all) => {

  const { themeDnsData } = useSettingsContext();
  const { user } = useAuthContext();

  const [operatorList, setOperatorList] = useState([]);

  useEffect(() => {
    settingSidebar();
  }, [])
  const settingSidebar = async () => {

    let operator_list = [];
    for (var i = 5; i >= 0; i--) {
      if (themeDnsData?.level_obj[`is_use_sales${i}`] == 1) {
        operator_list.push({
          id: 'operator',
          component: CNavItem,
          name: `${themeDnsData?.level_obj[`sales${i}_name`]}관리`,
          to: `/manager/operator/list` + `/${operatorLevelList[5 - i].value}`,
          icon: <Icon icon={'healthicons:people-outline'} className="nav-icon" />,
        },)
      }
    }
    setOperatorList(operator_list);

  }
  const isDeveloper = () => {
    return user?.level >= 50
  }
  const isManager = () => {
    return user?.level >= 40
  }
  const isOperator = () => {
    return user?.level < 40 && user?.level > 10
  }

  const isShowTab = (id) => {
    if (is_show_all) {
      return true;
    }
    if (themeDnsData?.setting_obj[`is_not_show_tab_${id}`] && themeDnsData?.setting_obj[`is_not_show_tab_${id}`] == 1) {
      return false;
    }
    return true;
  }
  return [
    ...((isManager() && isShowTab('dashboard')) ? [
      {
        id: 'dashboard',
        component: CNavItem,
        name: '매출현황',
        to: '/manager/dashboard',
        icon: <Icon icon={'material-symbols-light:space-dashboard-outline'} className="nav-icon" />,
      },
    ] : []),
    ...((isShowTab('deposit')) ? [
      {
        id: 'deposit-list',
        component: CNavItem,
        name: '결제내역',
        to: '/manager/deposit/list',
        icon: <Icon icon={'material-symbols:list'} className="nav-icon" />,
      },
    ] : []),
    ...((!isManager() && !isOperator() && isShowTab('virtual_account_order')) ? [
      {
        id: 'virtual_account_order',
        component: CNavItem,
        name: '가상계좌발급',
        to: '/manager/virtual-account/order',
        icon: <Icon icon={'mynaui:link'} className="nav-icon" />,
      },
    ] : []),
    ...((isManager() && isShowTab('mother_withdraw')) ? [
      {
        id: 'mother_withdraw',
        component: CNavItem,
        name: '모계좌출금 요청',
        to: '/manager/mother/withdraw',
        icon: <Icon icon={'mdi:currency-krw'} className="nav-icon" />,
      },
    ] : []),
    ...((isManager() && isShowTab('mother')) ? [
      {
        id: 'mother',
        component: CNavItem,
        name: '모계좌 내역',
        to: '/manager/mother/list',
        icon: <Icon icon={'material-symbols:list'} className="nav-icon" />,
      },
    ] : []),
    ...((!isManager() && isShowTab('withdraw_request')) ? [{
      id: 'withdraw_request',
      component: CNavItem,
      name: '출금 요청',
      to: '/manager/withdraw/request',
      icon: <Icon icon={'mdi:currency-krw'} className="nav-icon" />,
    },] : []),
    ...((!isManager() && !isOperator() && isShowTab('withdraw_return') && user?.can_return == 1) ? [{
      id: 'withdraw_return',
      component: CNavItem,
      name: '반환 요청',
      to: '/manager/withdraw/return',
      icon: <Icon icon={'mdi:currency-krw'} className="nav-icon" />,
    },] : []),
    ...((isShowTab('withdraw')) ? [
      {
        id: 'withdraw',
        component: CNavItem,
        name: '출금 내역',
        to: '/manager/withdraw/list',
        icon: <Icon icon={'material-symbols:list'} className="nav-icon" />,
      },
    ] : []),
    ...((isShowTab('settle')) ? [
      {
        id: 'settle',
        component: CNavItem,
        name: '보유정산금 내역',
        to: '/manager/settle/list',
        icon: <Icon icon={'material-symbols:list'} className="nav-icon" />,
      },
    ] : []),
    // {
    //   component: CNavItem,
    //   name: '보증금 내역',
    //   to: '/manager/charts',
    //   icon: <Icon icon={''} className="nav-icon" />,
    // },
    // {
    //   component: CNavItem,
    //   name: '유보금 내역',
    //   to: '/manager/charts',
    //   icon: <Icon icon={''} className="nav-icon" />,
    // },
    ...(isShowTab('reserve') ? [
      {
        id: 'reserve-list',
        component: CNavItem,
        name: '유보금 내역',
        to: '/manager/reserve/list',
        icon: <Icon icon={'material-symbols:list'} className="nav-icon" />,
      },
    ] : []),
    ...((operatorList && operatorList?.length > 0 && isManager() && isShowTab('operator')) ? operatorList : []),
    ...(((isManager() || isOperator()) && isShowTab('merchandise')) ? [
      {
        id: 'merchandise-list',
        component: CNavItem,
        name: '가맹점관리',
        to: '/manager/merchandise/list',
        icon: <Icon icon={'fa:shopping-basket'} className="nav-icon" />,
      },
    ] : []),
    {
      id: 'my-page',
      component: CNavGroup,
      name: '마이페이지',
      icon: <Icon icon={'healthicons:person-outline'} className="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: '비밀번호 변경',
          to: '/manager/my-page/change-pw',
        },
      ]
    },
    {
      id: 'post-list',
      component: CNavGroup,
      name: '게시판관리',
      to: '/manager/post/list',
      icon: <Icon icon={'simple-line-icons:screen-tablet'} className="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: '공지사항',
          to: '/manager/post/list/0',
        },
        {
          component: CNavItem,
          name: '자주하는질문',
          to: '/manager/post/list/1',
        },
        {
          component: CNavItem,
          name: '팝업',
          to: '/manager/post/list/2',
        },
      ]
    },
    {
      id: 'virtual-account-list',
      component: CNavItem,
      name: '가상계좌관리',
      to: '/manager/virtual-account/list',
      icon: <Icon icon={'simple-line-icons:trash'} className="nav-icon" />,
    },
    ...((isManager() && isShowTab('account_check')) ? [
      {
        component: CNavItem,
        name: '예금주조회',
        to: '/manager/account/check',
        icon: <Icon icon={'simple-line-icons:calendar'} className="nav-icon" />,
      },
    ] : []),
    ...((isManager() && isShowTab('noti_resend')) ? [
      {
        component: CNavItem,
        name: '노티재전송',
        to: '/manager/noti/resend',
        icon: <Icon icon={'simple-line-icons:tag'} className="nav-icon" />,
      },
    ] : []),
    ...(((isManager() || isOperator()) && isShowTab('alarm')) ? [
      {
        component: CNavItem,
        name: '알림 내역',
        to: '/manager/alarm/list',
        icon: <Icon icon={'simple-line-icons:bell'} className="nav-icon" />,
      },
    ] : []),
    {
      component: CNavItem,
      name: '블랙리스트 관리',
      to: '/manager/black/list',
      icon: <Icon icon={'simple-line-icons:pencil'} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: '로그아웃',
      to: '/logout',
      icon: <Icon icon={'simple-line-icons:logout'} className="nav-icon" />,
      style: {
        background: 'red'
      }
    },
  ]
}

export default _nav
