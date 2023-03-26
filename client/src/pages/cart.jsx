import {useQuery} from "react-query";
import {useMutation} from "react-query";
import {useState, useEffect} from "react";
import {API} from "../config/api";
import {useNavigate} from "react-router-dom";

export default function Cart() {
    const title = "Cart";
    document.title = "WaysBooks | " + title;

    const [totalPrices, setTotalPrices] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    let {data: cart, refetch} = useQuery("userCart", async () => {
        const response = await API.get(`/user/cart`);
        return response.data.data.cart;
    });

    let {data: profile} = useQuery("userCache", async () => {
        const response = await API.get("/profile");
        return response.data.data;
    });

    const [quantity, setQuantity] = useState(cart?.length || 0);

    useEffect(() => {
        refetch();
        if (cart) {
            setQuantity(cart?.length);

            let totalPrice = 0;
            cart.forEach((item) => {
                totalPrice += item.book.price;
            });

            setTotalPrices(totalPrice);
        }
    }, [refetch, cart]);

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);

    const handleDelete = useMutation(async (id) => {
        try {
            await API.delete(`/cart/${id}`);

            refetch();
        } catch (error) {
            console.log(error);
        }
    });

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            setLoading(true);

            const config = {
                header: {
                    "Content-type": "multipart/form-data",
                },
            };

            const formTransaction = new FormData();
            formTransaction.set("name", profile?.name);
            formTransaction.set("email", profile?.email);
            formTransaction.set("total", totalPrices);

            const response = await API.post("/transaction", formTransaction, config);

            cart.forEach((item) => {
                const formCart = new FormData();
                formCart.set("book_id", item.book_id);
                formCart.set("title", item.book.title);
                formCart.set("publication_date", item.book.publication_date);
                formCart.set("pages", item.book.pages);
                formCart.set("isbn", item.book.isbn);
                formCart.set("writer", item.book.writer);
                formCart.set("price", item.book.price);
                formCart.set("description", item.book.description);
                formCart.set("book_attachment", item.book.book_attachment);
                formCart.set("thumbnail", item.book.thumbnail);

                const responseCart = API.post("/book-purchase", formCart, config);

                console.log(responseCart);
            });

            console.log("transaction success: ", response);

            API.delete("/user/cart/delete", config);

            const token = response.data.data.token;
            window.snap.pay(token, {
                onSuccess: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onPending: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onError: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onClose: function () {
                    /* You may add your own implementation here */
                    alert("you closed the popup without finishing the payment");
                },
            });

            setLoading(false);
        } catch (error) {
            console.log("transaction failed: ", error);
        }
    });

    const cartIsEmpty = () => {
        if (quantity !== 0) {
            return (
                <>
                    <p className="mb-2">Review your order</p>
                    <div className="grid md:flex gap-4">
                        <div className="grid divide-y divide-gray-300 border-y-2 border-black w-full lg:w-4/6">
                            {cart?.map((item, index) => (
                                <div key={index} className="flex gap-4 p-2 md:p-4">
                                    <img src={item.book.thumbnail} alt="" className="w-16 h-24 md:w-28 md:h-44 object-cover" />
                                    <div className="w-full flex justify-between">
                                        <div>
                                            <h1 className="font-serif text-base md:text-xl font-bold line-clamp-2 w-full md:w-72">{item.book.title}</h1>
                                            <p className="italic text-sm lg:text-base text-gray-400 mb-2 md:mb-6">{item.book.writer}</p>
                                            <p className="text-sm lg:text-base text-green-500 font-bold">{rupiah(item.book.price)}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => handleDelete.mutate(item.id)} className="py-2">
                                                <img src="/assets/icon/bin.png" alt="" className="w-6 h-auto" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full h-fit lg:w-2/6">
                            <div className="border-y-2 border-black">
                                <div className="flex justify-between py-3">
                                    <p>Total</p>
                                    <p>{rupiah(totalPrices)}</p>
                                </div>
                                <div className="flex justify-between py-3">
                                    <p>Quantity</p>
                                    <p>{quantity}</p>
                                </div>
                            </div>
                            {isLoading ? (
                                <button
                                    className="w-full mt-4 rounded-sm border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-2 flex gap-2 justify-center items-center"
                                    disabled>
                                    <div
                                        class="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-neutral-100 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                        role="status">
                                        <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                    </div>
                                    Please wait...
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => handleSubmit.mutate(e)}
                                    className="w-full mt-4 rounded-sm border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-2">
                                    Pay
                                </button>
                            )}
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <p className="mb-2">Your cart is empty!</p>
                </>
            );
        }
    };

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <div className="mx-5 md:mx-20 lg:mx-40">
            <h4 className="font-serif text-2xl md:text-3xl font-bold mb-3 md:mb-6">Cart</h4>
            <div>{cartIsEmpty()}</div>
        </div>
    );
}
