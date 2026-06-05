import {Link, Outlet} from "react-router-dom";
import { refreshTokenManually } from "../backend/utils/api";

function BOMainLayout() {

    const handleRefresh = async () =>{
        await refreshTokenManually();
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