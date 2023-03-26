import {Modal, Alert} from "flowbite-react";
import {useState} from "react";
import {API} from "../../config/api";
import {useForm} from "react-hook-form";

export default function ModalRegister(props) {
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const {
        register,
        handleSubmit,
        resetField,
        formState: {errors},
    } = useForm();

    const onDismiss = () => {
        setMessage(false);
    };

    const onSubmit = async (input) => {
        try {
            setLoading(true);

            await API.post("/register", input);

            props.onClose();
            props.handleLogin();

            setMessage(false);

            resetField("name");
            resetField("email");
            resetField("password");
        } catch (error) {
            const alert = (
                <Alert color="failure" onDismiss={onDismiss} className="py-3 rounded-sm">
                    Failed to register! {error.response.data.message}
                </Alert>
            );
            setMessage(alert);
            console.log("register failed : ", error);
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
                        <h3 className="font-serif text-2xl md:text-3xl font-bold">Register</h3>
                        {message && message}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                <input
                                    {...register("name", {required: true})}
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0"
                                />
                                <input
                                    {...register("email", {required: true})}
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0"
                                />
                                <input
                                    {...register("password", {required: true})}
                                    name="password"
                                    type="password"
                                    placeholder="Password"
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
                                    <button className="w-full rounded-sm border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-2 font-semibold">Register</button>
                                )}
                            </div>
                        </form>
                        <div className="text-normal text-center text-gray-500">
                            <p className="m-0 font-medium">
                                Already have an account? Click{" "}
                                <button onClick={props.handleLogin} className="font-bold text-black">
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
