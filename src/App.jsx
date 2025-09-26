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
import Add_Symptom from "./routes/add_Symptom";
import Symptom_list from "./routes/symptom_list";
import Add_specialization from "./routes/add_specialization";
import Specialization_list from "./routes/specialization_list";
import Add_disease from "./routes/add_disease";
import Add_treatment from "./routes/add_treatment";
import Treatment_list from "./routes/treatment_list";
import AddDoctorProfile from "./routes/add_new_doctor";



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
                    element: <AddDoctorProfile/>,
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
                 {
                    path: "/symptoms/create",
                    element: <Add_Symptom />,
                },
                {
                    path: "/symptoms/list",
                    element: <Symptom_list />,
                },

                // --- New Routes for Specializations ---
                {
                    path: "/specializations/create",
                    element: <Add_specialization />,
                },
                {
                    path: "/specializations/list",
                    element: <Specialization_list />,
                },
                {
                    path: "/diseases/create",
                    element: <Add_disease />,
                },
                {
                    path: "/treatments/create",
                    element: <Add_treatment />,
                },
                 {
                    path: "/treatments/list",
                    element: <Treatment_list />,
                }
              
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
