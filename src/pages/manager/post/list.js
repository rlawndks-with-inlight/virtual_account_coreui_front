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
import { postTypeList } from 'src/utils/format';


const PostList = () => {
    ;
    const [postType, setPostType] = useState(0);

    useEffect(() => {
        setPostType(parseInt(location.pathname.split('/')[3]))
    }, [location])
    return (
        <>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardHeader>{_.find(postTypeList, { value: postType }).label}</CCardHeader>
                        <CCardBody>

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default PostList;