import React, { useEffect } from 'react'
import { useSettingsContext } from 'src/components/settings';

const BlankLayout = ({ children }) => {
    const { themeDnsData } = useSettingsContext();

    return (
        <>
            {themeDnsData?.id > 0 &&
                <>
                    {children}
                </>}
        </>
    )
}

export default BlankLayout
