import io from 'socket.io-client';

export const LOCALSTORAGE = {
    DNS_DATA: "dns_data",
    USER_DATA: "user_data",
    CUR_ZOOM: "cur_zoom",
    IS_FULL_SCREEN: "is_full_screen",
    NOT_SEARCH_OPTION: "not_search_option",
    USER_APP_MEMBERSHIP_OBJ: "user_app_membership_obj"
}
export const socket = io(process.env.SOCKET_URL);