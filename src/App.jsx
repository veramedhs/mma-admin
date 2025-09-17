import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import Doctor_list from "./routes/doctor_list";
import New_doctors from "./routes/new_doc";
import Verified_doc from "./routes/verified_doc";
import Add_labs from "./routes/add_labs";
import Lab_list from "./routes/lab_list";
import Verified_labs from "./routes/verified_labs";
import Add_Test from "./routes/add_test";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <DashboardPage />,
                },
               
               
                {
                    path: "/doctors-list",
                    element: <Doctor_list/>,
                },
                {
                    path: "/new-doctors",
                    element: <New_doctors/>,
                },
                {
                    path: "/verified-doctors",
                    element: <Verified_doc/>,
                },
                {
                    path: "/labs",
                    element: <Add_labs/>,
                },
                  {
                    path: "/add-test",
                    element: <Add_Test/>,
                },
                {
                    path: "/list-labs",
                    element: <Lab_list/>,
                },
                {
                    path: "/verified-labs",
                    element: <Verified_labs/>,
                },
              
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
