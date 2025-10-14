import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";

function AppRoutes() {
    return (
        <>
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="sign-in/" element={<SignIn/>}></Route>
            <Route path="sign-up/" element={<SignUp/>}></Route>
        </Routes>
        </>
    )
}


export default AppRoutes;