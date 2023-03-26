import {Modal, Alert} from "flowbite-react";
import {useState, useContext, useEffect} from "react";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../context/user-context";
import {API, setAuthToken} from "../../config/api";
import {useForm} from "react-hook-form";

export default function ModalLogin(props) {
    const [loginShow, setLoginShow] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    let navigate = useNavigate();

    const {
        register,
        handleSubmit,
        resetField,
        formState: {errors},
    } = useForm();

    const [state, dispatch] = useContext(UserContext);

    const checkAuth = () => {
        if (state.isLogin) {
            navigate("/");
            setLoginShow(false);
        }
    };

    let {refetch: refetchProfile} = useQuery("userCache", async () => {
        const response = await API.get("/profile");
        return response.data.data;
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const onDismiss = () => {
        setMessage(false);
    };

    const onSubmit = async (input) => {
        try {
            setLoading(true);

            const response = await API.post("/login", input);

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: response.data.data,
            });

            setAuthToken(response.data.data.token);

            if (response.data.data.is_admin === true) {
                navigate("/income-transaction");
            } else {
                navigate("/");
            }
            setMessage(false);

            resetField("email");
            resetField("password");

            refetchProfile();

            props.onClose();
        } catch (error) {
            const alert = (
                <Alert color="failure" onDismiss={onDismiss} className="py-3 rounded-sm">
                    Failed to login! {error.response.data.message}
                </Alert>
            );
            setMessage(alert);

            console.log("login failed : ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal {...props} size="md" popup={true} position="center" dismissible={true} className="font-sans">
                <Modal.Header />
                <div>
                    <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                        <h3 className="font-serif text-2xl md:text-3xl font-bold">Login</h3>
                        {message && message}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    {...register("email", {required: true})}
                                    className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0"
                                />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    {...register("password", {required: true})}
                                    className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0"
                                />
                            </div>
                            <div className="w-full mt-3">
                                {isLoading ? (
                                    <button className="w-full rounded-sm border-2 border-zinc-600 bg-zinc-600 text-white py-2 font-semibold flex gap-2 justify-center items-center" disabled>
                                        <div
                                            class="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-neutral-100 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                            role="status">
                                            <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                        </div>
                                        Please wait...
                                    </button>
                                ) : (
                                    <button className="w-full rounded-sm border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-2 font-semibold">Login</button>
                                )}
                            </div>
                        </form>
                        <div className="text-normal text-center text-gray-500">
                            <p className="m-0 font-medium">
                                Don't have an account? Click{" "}
                                <button onClick={props.handleRegister} className="font-bold text-black">
                                    Here
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
