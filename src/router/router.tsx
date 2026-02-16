import { createBrowserRouter } from "react-router-dom";
import CraftVanilaJS from "../pages/scriptCraft/CraftVanilaJS";
import BaseLayout from "../pages/layout/BaseLayout";
import ProtectRoute from "./ProtectRoute";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <CraftVanilaJS />,
    },
    {
        path: "/craftVanilaJS",
        element: <ProtectRoute>
                    <BaseLayout>
                        <CraftVanilaJS />
                    </BaseLayout>
                </ProtectRoute>,
    },
]);

export default Router;