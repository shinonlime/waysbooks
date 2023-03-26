import {Route, Routes} from "react-router-dom";
import FooterBar from "./components/footer";
import Navibar from "./components/navbar";
import AddBook from "./pages/admin/add-book";
import IncomeTransaction from "./pages/admin/income-transaction";
import Cart from "./pages/cart";
import DetailBook from "./pages/detail-book";
import LandingPage from "./pages/landing-page";
import Profile from "./pages/profile";
import {useNavigate} from "react-router-dom";
import React, {useState, useEffect, useContext} from "react";
import {API, setAuthToken} from "./config/api";
import {UserContext} from "./context/user-context";
import {PrivateRouteLogin, PrivateRouteUser, PrivateRouteAdmin} from "./components/private-route";
import ListBooks from "./pages/admin/list-books";
import EditBook from "./pages/admin/edit-book";

function App() {
    let navigate = useNavigate();

    const [state, dispatch] = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Redirect Auth but just when isLoading is false
        if (!isLoading) {
            if (state.isLogin === false) {
                navigate("/");
            }
        }
    }, [isLoading]);

    useEffect(() => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
            checkUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const checkUser = async () => {
        try {
            const response = await API.get("/check-auth");
            console.log("check user success : ", response);
            // Get user data
            let payload = response.data.data;
            // Get token from local storage
            payload.token = localStorage.token;
            // Send data to useContext
            dispatch({
                type: "USER_SUCCESS",
                payload,
            });
            setIsLoading(false);
        } catch (error) {
            console.log("check user failed : ", error);
            dispatch({
                type: "AUTH_ERROR",
            });
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="bg-[url('/src/bg.png')] bg-cover w-auto h-screen font-sans">
                <Navibar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="detail-book/:id" element={<DetailBook />} />
                    <Route element={<PrivateRouteLogin />}>
                        <Route element={<PrivateRouteUser />}>
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/cart" element={<Cart />} />
                        </Route>
                        <Route element={<PrivateRouteAdmin />}>
                            <Route path="/income-transaction" element={<IncomeTransaction />} />
                            <Route path="/list-books" element={<ListBooks />} />
                            <Route path="/add-book" element={<AddBook />} />
                            <Route path="/edit-book/:id" element={<EditBook />} />
                        </Route>
                    </Route>
                </Routes>
                <FooterBar />
            </div>
        </>
    );
}

export default App;
