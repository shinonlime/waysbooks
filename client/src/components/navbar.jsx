import {Navbar, Dropdown} from "flowbite-react";
import {useState, useContext, useEffect} from "react";
import {UserContext} from "../context/user-context";
import {Link, useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import {API} from "../config/api";
import ModalLogin from "./modal/modal-login";
import ModalRegister from "./modal/modal-register";

export default function Navibar() {
    const [state, dispatch] = useContext(UserContext);

    const [loginShow, setLoginShow] = useState(false);
    const [registerShow, setRegisterShow] = useState(false);

    const handleCloseLogin = () => setLoginShow(false);
    const handleShowLogin = () => setLoginShow(true);

    const handleCloseRegister = () => setRegisterShow(false);
    const handleShowRegister = () => setRegisterShow(true);

    const navigate = useNavigate();

    const popLogin = () => {
        setLoginShow(true);
        setRegisterShow(false);
    };

    const popRegister = () => {
        setLoginShow(false);
        setRegisterShow(true);
    };

    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        });

        navigate("/");
    };

    let {data: profile, refetch: refetchProfile} = useQuery("userCache", async () => {
        const response = await API.get("/profile");
        return response.data.data;
    });

    const user = state.user.is_admin === false;
    const admin = state.user.is_admin === true;

    let {data: cart, refetch: refetchCart} = useQuery("userCart", async () => {
        const response = await API.get(`/user/cart`);
        return response.data.data.cart;
    });

    const [cartLength, setCartLength] = useState(cart?.length || 0);

    useEffect(() => {
        refetchProfile();
        refetchCart();
    }, []);

    useEffect(() => {
        setCartLength(cart?.length);
    }, [cart]);

    const login = () => {
        if (user) {
            return (
                <div className="flex gap-8">
                    <Link to="/cart" className="relative inline-flex items-center">
                        <img src="assets/icon/cart.png" alt="Cart" className="h-10" />
                        <div class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-0 -right-2">
                            {cartLength}
                        </div>
                    </Link>
                    <Dropdown arrowIcon={false} inline={true} label={<img src={profile?.avatar} alt="user" className="w-14 h-14 rounded-full object-cover" />}>
                        <Dropdown.Header>
                            <span className="block text-sm">{profile?.name}</span>
                            <span className="block truncate text-sm font-medium">{profile?.email}</span>
                        </Dropdown.Header>
                        <Link to="/profile">
                            <Dropdown.Item className="flex gap-3 items-center w-full">
                                <img src="/assets/icon/user.png" alt="user" className="h-6" />
                                <span className="font-semibold">Profile</span>
                            </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <button onClick={handleLogout} className="w-full">
                            <Dropdown.Item className="flex gap-3 items-center w-full">
                                <img src="/assets/icon/logout.png" alt="logout" className="h-6" />
                                <span className="font-semibold">Logout</span>
                            </Dropdown.Item>
                        </button>
                    </Dropdown>
                </div>
            );
        } else if (admin) {
            return (
                <div>
                    <Dropdown arrowIcon={false} inline={true} label={<img src={profile?.avatar} alt="user" className="w-14 h-14 rounded-full object-cover" />}>
                        <Dropdown.Header>
                            <span className="block text-sm">{profile?.name}</span>
                            <span className="block truncate text-sm font-medium">{profile?.email}</span>
                        </Dropdown.Header>
                        <Link to="/income-transaction">
                            <Dropdown.Item className="flex gap-3 items-center w-full">
                                <img src="/assets/icon/receipt.png" alt="user" className="h-6" />
                                <span className="font-semibold">Transactions</span>
                            </Dropdown.Item>
                        </Link>
                        <Link to="/add-book">
                            <Dropdown.Item className="flex gap-3 items-center w-full">
                                <img src="/assets/icon/book.png" alt="user" className="h-6" />
                                <span className="font-semibold">Add Book</span>
                            </Dropdown.Item>
                        </Link>
                        <Link to="/list-books">
                            <Dropdown.Item className="flex gap-3 items-center w-full">
                                <img src="/assets/icon/list-books.png" alt="user" className="h-6" />
                                <span className="font-semibold">List Book</span>
                            </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <button onClick={handleLogout} className="w-full">
                            <Dropdown.Item className="flex gap-3 items-center w-full">
                                <img src="/assets/icon/logout.png" alt="logout" className="h-6" />
                                <span className="font-semibold">Logout</span>
                            </Dropdown.Item>
                        </button>
                    </Dropdown>
                </div>
            );
        } else {
            return (
                <>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <div className="flex justify-end gap-2">
                            <button className="rounded-sm border-2 border-zinc-800 py-1 px-6 hover:bg-zinc-800 hover:text-white" onClick={() => handleShowLogin()}>
                                Login
                            </button>
                            <button className="rounded-sm border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-1 px-6 hover" onClick={() => handleShowRegister()}>
                                Register
                            </button>
                        </div>
                    </Navbar.Collapse>
                </>
            );
        }
    };

    return (
        <>
            <Navbar className="px-10 lg:px-24 py-1 lg:py-6 bg-white/0">
                <Navbar.Brand>
                    <Link to="/">
                        <img src="/assets/img/logo.png" className="h-14" alt="Waysbook Logo" />
                    </Link>
                </Navbar.Brand>
                {login()}
                <ModalLogin show={loginShow} onClose={() => handleCloseLogin()} handleRegister={() => popRegister()} />
                <ModalRegister show={registerShow} onClose={() => handleCloseRegister()} handleLogin={() => popLogin()} />
            </Navbar>
        </>
    );
}
