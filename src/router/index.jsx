import {createBrowserRouter} from "react-router-dom";
import BOMainLayout from "../layouts/BOMainLayout.jsx";
import FOMainLayout from "../layouts/FOMainLayout.jsx";
import BOReset from "../pages/BO/BOReset.jsx";
import BOImport from "../pages/BO/BOImport.jsx";
import BOLogin from "../pages/BO/BOLogin.jsx";
import FOAssetsList from "../pages/FO/FOAssetsList.jsx";
import BODashboard from "../pages/BO/BODashboard.jsx";
import BOTicketList from "../pages/BO/BOTicketList.jsx";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <BOMainLayout/>,

        children: [
            {
                index: true,
                element: <BOLogin/>
            },
            {
                path: "reset",
                element: <BOReset/>
            },
            {
                path: "import",
                element: <BOImport/>
            },
            {
                path: "dashboard",
                element: <BODashboard/>
            },
            {
                path: "tickets",
                element: <BOTicketList/>
            }
        ]
    },
    {
        path: "/frontOffice",
        element: <FOMainLayout/>,

        children: [
            {
                path: "assets",
                element:  <FOAssetsList/>
            },
        ]
    },
])