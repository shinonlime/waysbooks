import {useContext} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {UserContext} from "../context/user-context";

export function PrivateRouteLogin() {
    const [state] = useContext(UserContext);

    if (!state.isLogin) {
        return <Navigate to="/" />;
    }
    return <Outlet />;
}

export function PrivateRouteUser() {
    const [state] = useContext(UserContext);

    if (state.user.is_admin === true) {
        return <Navigate to="/income-transaction" />;
    }
    return <Outlet />;
}

export function PrivateRouteAdmin() {
    const [state] = useContext(UserContext);

    if (state.user.is_admin === false) {
        return <Navigate to="/" />;
    }
    return <Outlet />;
}
