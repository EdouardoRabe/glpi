import {Link, Outlet} from "react-router-dom";
import { refreshTokenManually } from "../backend/utils/api";
import { initSessionV1 } from "../backend/utils/apiV1";
import "../css/layouts/FOMainLayout.css";

function FOMainLayout() {
    const handleRefresh = async () =>{
        await refreshTokenManually();
        console.log("Token refreshed via V2 API");

        await initSessionV1();
        console.log("Session re-initialized via V1 API");
    }



    return (
        <div className="fo-layout">
            <nav className="fo-navbar">
                <div className="fo-navbar-brand">
                    <span className="fo-navbar-brand-icon">FO</span>
                    <span>Front Office</span>
                </div>
                <div className="fo-navbar-menu">
                    <Link to={"/frontOffice/assets"}>Assets</Link>
                    <Link to={"/frontOffice/create-ticket"}>Create Ticket</Link>
                    <button onClick={handleRefresh}>Refresh Token</button>
                </div>
            </nav>

            <main className="fo-main">
                <Outlet/>
            </main>
        </div>
    )
}

export default FOMainLayout;