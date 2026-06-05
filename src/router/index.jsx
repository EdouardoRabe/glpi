import {createBrowserRouter} from "react-router-dom";
import BOMainLayout from "../layouts/BOMainLayout.jsx";
import BOReset from "../pages/BO/BOReset.jsx";
import BOImport from "../pages/BO/BOImport.jsx";
import BOLogin from "../pages/BO/BOLogin.jsx";


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
            }
        ]
    },
])