import {Link, Outlet} from "react-router-dom";
import { refreshTokenManually } from "../backend/utils/api";
import { initSessionV1 } from "../backend/utils/apiV1";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BOMainLayout() {
    const handleRefresh = async () =>{
        await refreshTokenManually();
        console.log("Token refreshed via V2 API");

        await initSessionV1();
        console.log("Session re-initialized via V1 API");
    }

 

    return (
        <div>
            <nav >
                <div >
                    <span  />
                    <span>Front Office</span>
                </div>
                <div >
                    <Link to={"/assets"}>Assets</Link>
                    <button onClick={handleRefresh}>Refresh Token</button>
                </div>
            </nav>

            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default BOMainLayout;