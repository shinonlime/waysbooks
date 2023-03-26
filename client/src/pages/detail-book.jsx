import {useParams, Link} from "react-router-dom";
import {useState, useContext, useEffect} from "react";
import {UserContext} from "../context/user-context";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import {API} from "../config/api";
import "react-quill/dist/quill.bubble.css";

export default function DetailBook() {
    const title = "Detail Book";
    document.title = "WaysBooks | " + title;

    const [state, dispatch] = useContext(UserContext);

    const [isLoading, setLoading] = useState(false);

    const {id} = useParams();
    const navigate = useNavigate();

    let {data: book} = useQuery("bookCache", async () => {
        const response = await API.get(`/book/${id}`);
        return response.data.data;
    });

    const publicationDate = new Date(book?.publication_date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    let {data: cart, refetch: refetchCart} = useQuery("userCart", async () => {
        const response = await API.get(`/user/cart`);
        return response.data.data.cart;
    });

    useEffect(() => {
        refetchCart();
    }, [refetchCart]);

    let {data: userBooks} = useQuery("userBooksCache", async () => {
        const response = await API.get("/user/transaction");
        return response.data.data.transaction;
    });

    const user = state.user.is_admin === false;

    const cartButton = () => {
        if (user) {
            let isInCart = false;
            let purchasedBook = null;

            if (Array.isArray(userBooks) && userBooks.length > 0) {
                for (const userBook of userBooks) {
                    if (Array.isArray(userBook.book_purchases) && userBook.book_purchases.length > 0) {
                        purchasedBook = userBook.book_purchases.find((bookPurchase) => bookPurchase.book_id === book?.id && userBook.status === "success");
                        if (purchasedBook) {
                            return (
                                <Link
                                    to={purchasedBook.book_attachment}
                                    className="inline-block rounded-sm gap-3 items-center border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-2 px-6 font-semibold">
                                    Download
                                </Link>
                            );
                        }
                    }
                }
            }

            if (Array.isArray(cart) && cart.length > 0) {
                isInCart = cart.some((inCart) => inCart.book_id === book?.id);
                if (isInCart) {
                    return (
                        <>
                            <Link to="/cart" className="inline-block rounded-sm border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-2 px-6 font-semibold">
                                This book already in Cart! Click here!
                            </Link>
                        </>
                    );
                }
            }

            return (
                <>
                    {isLoading ? (
                        <button
                            className="rounded-sm border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-2 px-6 hover font-semibold flex gap-3 justify-center items-center"
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
                            onClick={onSubmit}
                            className="rounded-sm flex gap-3 items-center border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-2 px-6 font-semibold">
                            Add to cart <img src="/assets/icon/cart-white.png" alt="" className="h-6" />
                        </button>
                    )}
                </>
            );
        }
    };

    const onSubmit = async (e) => {
        try {
            e.preventDefault();

            setLoading(true);

            const config = {
                header: {
                    "Content-type": "multipart/form-data",
                },
            };

            const formCart = new FormData();
            formCart.set("book_id", book.id);

            const response = await API.post("/cart", formCart, config);

            console.log("success added to cart: ", response);

            refetchCart();
            navigate("/cart");

            setLoading(false);
        } catch (error) {
            console.log("add cart failed : ", error);
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
            <div className="grid justify-items-center md:flex justify-center items-center gap-4 lg:gap-20 mb-10">
                <img src={book?.thumbnail} alt="" className="rounded-lg w-44 h-72 md:w-80 md:h-[500px] object-cover" />
                <div className="md:w-72 lg:w-96">
                    <div className="mb-4 md:mb-10">
                        <h1 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold mb-2">{book?.title}</h1>
                        <p className="italic text-sm lg:text-base text-gray-400">{book?.writer}</p>
                    </div>
                    <div className="grid gap-2 md:gap-4">
                        <div>
                            <h5 className="font-sans text-base lg:text-lg font-bold">Publication date</h5>
                            <p className="text-sm lg:text-base text-gray-400">{publicationDate}</p>
                        </div>
                        <div>
                            <h5 className="font-sans text-base lg:text-lg font-bold">Pages</h5>
                            <p className="text-sm lg:text-base text-gray-400">{book?.pages}</p>
                        </div>
                        <div>
                            <h5 className="font-sans text-base lg:text-lg text-red-600 font-bold">ISBN</h5>
                            <p className="text-sm lg:text-base text-gray-400">{book?.isbn}</p>
                        </div>
                        <div>
                            <h5 className="font-sans text-base lg:text-lg font-bold">Price</h5>
                            <p className="text-sm lg:text-base text-green-500 font-bold">{rupiah(book?.price)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold mb-2">About this book</h1>
                <div className="text-justify text-gray-600" dangerouslySetInnerHTML={{__html: book?.description}}></div>
            </div>
            <div className="mt-4 flex justify-end">{cartButton()}</div>
        </div>
    );
}
