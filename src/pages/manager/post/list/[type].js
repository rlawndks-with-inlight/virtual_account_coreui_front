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
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DefaultLayout from 'src/layout/DefaultLayout';
import { postTypeList } from 'src/utils/format';


const PostList = () => {
    const router = useRouter();
    const [postType, setPostType] = useState(0);

    useEffect(() => {
        setPostType(parseInt(router.query?.type))
    }, [router.asPath])
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
PostList.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
export default PostList;