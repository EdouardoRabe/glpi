import {Link, Outlet} from "react-router-dom";
import { refreshTokenManually } from "../backend/utils/api";
import { initSessionV1 } from "../backend/utils/apiV1";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BOMainLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkLogin = () => {
            const isLoggedIn = sessionStorage.getItem("isLoggedIn");
            if (!isLoggedIn) {
                navigate("/");
            }
        };

        checkLogin();
    }, []);

    const handleRefresh = async () =>{
        await refreshTokenManually();
        console.log("Token refreshed via V2 API");

        await initSessionV1();
        console.log("Session re-initialized via V1 API");
    }

    const handleLogout = () => {
        sessionStorage.removeItem("isLoggedIn");
        navigate("/");
    }


    return (
        <div>
            <nav >
                <div >
                    <span  />
                    <span>Back Office</span>
                </div>
                <div >
                    <Link to={"/reset"}>Reset</Link>
                    <Link to={"/import"}>Import</Link>
                    <button onClick={handleRefresh}>Refresh Token</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default BOMainLayout;