import { useSettingsContext } from "src/components/settings";
import VirtualAccountBankners from "./corps/VirtualAccountBankners";
import BlankLayout from "src/layout/BlankLayout";


const VirtualAccount = (props) => {

    const { themeDnsData } = useSettingsContext();

    return (
        <>
            <VirtualAccountBankners />

            {themeDnsData?.deposit_corp_type == 1 &&
                <>
                    <VirtualAccountBankners />
                </>}
        </>
    )
}
VirtualAccount.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
export default VirtualAccount;