import {createBrowserRouter} from "react-router-dom";
import BOMainLayout from "../layouts/BOMainLayout.jsx";
import BOReset from "../pages/BO/BOReset.jsx";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <BOMainLayout/>,

        children: [
            {
                index: true,
                element: <BOReset/>
            }
        ]
    },
])