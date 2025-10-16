import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
// import { GoogleSignIn } from "../services/authServices";
import GoogleSignIn from "../components/GoogleSignIn";

function AppRoutes() {
    return (
        <>
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="sign-in/" element={<SignIn/>}></Route>
            <Route path="sign-up/" element={<SignUp/>}></Route>
            <Route path="google-auth/" element={<GoogleSignIn/>}></Route>
        </Routes>
        </>
    )
}


export default AppRoutes;