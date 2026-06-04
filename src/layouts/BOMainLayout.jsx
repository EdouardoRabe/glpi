import {Link, Outlet} from "react-router-dom";

function BOMainLayout() {
    return (
        <div>
            <nav >
                <div >
                    <span  />
                    <span>Back Office</span>
                </div>
                <div >
                    <Link to={"/"}>Reset</Link>
              
                </div>
            </nav>

            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default BOMainLayout;