import {Link, Outlet} from "react-router-dom";
import { refreshTokenManually } from "../backend/utils/api";
import { initSessionV1 } from "../backend/utils/apiV1";

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
                    <span>Back Office</span>
                </div>
                <div >
                    <Link to={"/"}>Reset</Link>
                    <Link to={"/import"}>Import</Link>
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