import React, { useEffect } from 'react'
import { useSettingsContext } from 'src/components/settings';

const BlankLayout = ({ children }) => {
    const { themeDnsData } = useSettingsContext();

    return (
        <>
            {themeDnsData?.id > 0 &&
                <>
                    <div>
                        {children}
                    </div>
                </>}
        </>
    )
}

export default BlankLayout
