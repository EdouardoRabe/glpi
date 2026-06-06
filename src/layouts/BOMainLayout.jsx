import {Link, Outlet} from "react-router-dom";
import { refreshTokenManually } from "../backend/utils/api";
import { initSessionV1 } from "../backend/utils/apiV1";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/layouts/BOMainLayout.css";

function BOMainLayout() {
    const navigate = useNavigate();
    const isLoginRoute = location.pathname === "/";

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
        <div className="bo-layout">
            {!isLoginRoute && (
                <nav className="bo-navbar">
                    <div className="bo-navbar-brand">
                        <span className="bo-navbar-brand-icon">BO</span>
                        <span>Back Office</span>
                    </div>
                    <div className="bo-navbar-menu">
                        <Link to={"/reset"}>Reset</Link>
                        <Link to={"/import"}>Import</Link>
                        <Link to={"/dashboard"}>Dashboard</Link>
                        <Link to={"/tickets"}>Tickets</Link>
                        <button onClick={handleRefresh}>Refresh Token</button>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </nav>
            )}

            <main className="bo-main">
                <Outlet/>
            </main>
        </div>
    )
}

export default BOMainLayout;