import {Modal} from "flowbite-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useQuery} from "react-query";
import {API} from "../../config/api";

export default function ModalUpdateProfile(props) {
    const {
        register,
        handleSubmit,
        resetField,
        formState: {errors},
    } = useForm();

    const [preview, setPreview] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [form, setForm] = useState({image: ""});

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
        });

        if (e.target.type === "file") {
            let url = URL.createObjectURL(e.target.files[0]);
            console.log(url);
            setPreview(url);
        }
    };

    let {data: profile, refetch} = useQuery("userCache", async () => {
        const response = await API.get("/profile");
        setPreview(response.data.data.avatar);
        return response.data.data;
    });

    const onSubmit = async (input) => {
        try {
            setLoading(true);
            const hasImage = form.image && form.image[0];
            const config = {
                header: {
                    "Content-type": "multipart/form-data",
                },
            };

            const formData = new FormData();
            formData.set("name", input.name);
            formData.set("email", input.email);
            formData.set("gender", input.gender);
            formData.set("phone", input.phone);
            formData.set("address", input.address);
            if (hasImage) {
                formData.set("image", form.image[0], form.image[0].name);
            }

            const response = await API.patch("/update-profile", formData, config);

            console.log(response);

            setForm({image: ""});

            setLoading(false);
            props.onClose();

            refetch();
        } catch (error) {
            console.log("update failed : ", error);
        }
    };

    return (
        <Modal {...props} size="md" popup={true} position="center" dismissible={true} className="font-sans">
            <Modal.Header />
            <Modal.Body>
                <div className="space-y-6 px-2 pb-4 sm:pb-6 lg:px-4">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold">Update Profile</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                            <input
                                {...register("name")}
                                defaultValue={profile?.name}
                                name="name"
                                type="text"
                                placeholder="Full Name"
                                className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0"
                            />
                            <input
                                {...register("email")}
                                defaultValue={profile?.email}
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0"
                            />
                            <select
                                {...register("gender")}
                                defaultValue={profile?.gender}
                                name="gender"
                                className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0">
                                <option disabled selected>
                                    Gender
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <input
                                {...register("phone")}
                                defaultValue={profile?.phone}
                                name="phone"
                                type="number"
                                placeholder="Phone"
                                className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0"
                            />
                            <textarea
                                {...register("address")}
                                defaultValue={profile?.address}
                                name="address"
                                placeholder="Address"
                                className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0"
                                rows="3"
                            />
                            <input
                                onChange={handleChange}
                                name="image"
                                type="file"
                                placeholder="Avatar"
                                accept="image/*"
                                className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0"
                            />
                        </div>
                        {preview && <img src={preview} alt="" className="w-28 h-28 object-cover rounded my-2" />}
                        {isLoading ? (
                            <button type="submit" className="w-full rounded-sm border-2 border-zinc-600 bg-zinc-600 text-white py-2 font-semibold flex gap-2 justify-center items-center" disabled>
                                <div
                                    class="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-neutral-100 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status">
                                    <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                </div>
                                Please wait...
                            </button>
                        ) : (
                            <div className="w-full">
                                <button type="submit" className="w-full rounded-sm border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-2 font-semibold">
                                    Submit
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
