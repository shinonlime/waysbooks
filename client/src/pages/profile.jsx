import ModalUpdateProfile from "../components/modal/modal-update-profile";
import UserBooks from "../components/user-books";
import {useState, useEffect} from "react";
import {useQuery} from "react-query";
import {API} from "../config/api";

export default function Profile() {
    const title = "Profile";
    document.title = "WaysBooks | " + title;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let {data: profile, refetch} = useQuery("userCache", async () => {
        const response = await API.get("/profile");
        return response.data.data;
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const gender = () => {
        if (profile?.gender === "male") {
            return (
                <>
                    <img src="/assets/icon/male.svg" alt="gender" className="h-8 text-gray-500" />
                    <div>
                        <p className="font-semibold">Male</p>
                        <p className="text-gray-500">Gender</p>
                    </div>
                </>
            );
        } else if (profile?.gender === "female") {
            return (
                <>
                    <img src="/assets/icon/female.svg" alt="gender" className="h-8 text-gray-500" />
                    <div>
                        <p className="font-semibold">Female</p>
                        <p className="text-gray-500">Gender</p>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <img src="/assets/icon/question_mark.svg" alt="gender" className="h-8 text-gray-500" />
                    <div>
                        <p className="font-semibold">-</p>
                        <p className="text-gray-500">Gender</p>
                    </div>
                </>
            );
        }
    };

    const phone = () => {
        if (profile?.phone) {
            return (
                <div>
                    <p className="font-semibold">{profile?.phone}</p>
                    <p className="text-gray-500">Phone</p>
                </div>
            );
        } else {
            return (
                <div>
                    <p className="font-semibold">-</p>
                    <p className="text-gray-500">Phone</p>
                </div>
            );
        }
    };

    const address = () => {
        if (profile?.address) {
            return (
                <div>
                    <p className="font-semibold">{profile?.address}</p>
                    <p className="text-gray-500">Address</p>
                </div>
            );
        } else {
            return (
                <div>
                    <p className="font-semibold">-</p>
                    <p className="text-gray-500">Address</p>
                </div>
            );
        }
    };

    return (
        <>
            <div className="mx-5 md:mx-20 lg:mx-40">
                <h4 className="font-serif text-2xl md:text-3xl font-bold mb-3 md:mb-6">Profile</h4>
                <div className="grid gap-8 sm:flex sm:justify-between justify-items-center bg-red-200 rounded-lg p-6 md:p-10 mb-10">
                    <div className="grid gap-2 order-last sm:order-none">
                        <div className="flex gap-4 items-center">
                            <img src="/assets/icon/mail.svg" alt="mail" className="h-8 fill-gray-500" />
                            <div>
                                <p className="font-semibold">{profile?.email}</p>
                                <p className="text-gray-500">Email</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">{gender()}</div>
                        <div className="flex gap-4 items-center">
                            <img src="/assets/icon/call.svg" alt="phone" className="h-8 text-gray-500" />
                            {phone()}
                        </div>
                        <div className="flex gap-4 items-center">
                            <img src="/assets/icon/location.svg" alt="address" className="h-8 text-gray-500" />
                            {address()}
                        </div>
                    </div>
                    <div>
                        <img src={profile?.avatar} alt="Profile" className="w-52 h-52 rounded object-cover mb-4" />
                        <button className="py-2 bg-red-600 text-white font-semibold w-full rounded" onClick={() => handleShow()}>
                            Edit Profile
                        </button>
                    </div>
                </div>
                <UserBooks />
                <ModalUpdateProfile show={show} onClose={() => handleClose()} />
            </div>
        </>
    );
}
