import { useRouter } from "next/router";
import { useEffect } from "react";

const Logout = () => {
    const router = useRouter();
    useEffect(() => {
        router.push('/login')
    }, [])
    return <></>
}
export default Logout;