import {Modal} from "flowbite-react";
import {useQuery, useMutation} from "react-query";
import {useState, useEffect} from "react";
import {API} from "../../config/api";
import {Link} from "react-router-dom";

export default function ListBooks() {
    const title = "List Books";
    document.title = "WaysBooks | " + title;

    let {data: books, refetch} = useQuery("booksCache", async () => {
        const response = await API.get("/books");
        return response.data.data;
    });

    useEffect(() => {
        refetch();
    }, []);

    const [show, setShow] = useState(false);
    const [itemName, setItemName] = useState("");
    const [itemId, setItemId] = useState("");
    const [isLoading, setLoading] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (id, name) => {
        setItemId(id);
        setItemName(name);
        setShow(true);
    };

    const handleDelete = useMutation(async (id) => {
        try {
            setLoading(true);

            await API.delete(`/book/${id}`);

            handleClose();
            setLoading(false);
            refetch();
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    });

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };
    return (
        <div>
            <h4 className="font-serif text-2xl md:text-3xl font-bold mb-3 ml-16 md:mb-6">List Books</h4>
            <table className="mx-auto w-11/12 text-sm text-left text-gray-500 dark:text-gray-400 border">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            No
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Thumbnail
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Publication Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Writer
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Book Attachment
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Sold
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {books?.map((item, index) => {
                        const publicationDate = new Date(item?.publication_date).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        });
                        return (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th className="px-6 py-4 font-medium text-gray-900">{index + 1}</th>
                                <td className="px-6 py-4 line-clamp-1">
                                    <img src={item?.thumbnail} alt="Thumbnail Book" className="w-32 h-32 object-cover" />
                                </td>
                                <td className="px-6 py-4">{item?.title}</td>
                                <td className="px-6 py-4">{publicationDate}</td>
                                <td className="px-6 py-4">{item?.writer}</td>
                                <td className="px-6 py-4">{rupiah(item?.price)}</td>
                                <td className="px-6 py-4 break-all">
                                    <Link to={item?.book_attachment}>{item?.book_attachment}</Link>
                                </td>
                                <td className="px-6 py-4">{item?.sold}</td>
                                <td>
                                    <div className="flex gap-4 px-6">
                                        <Link to={`/edit-book/${item.id}`} className="font-medium text-blue-600 hover:underline">
                                            Edit
                                        </Link>
                                        <button onClick={() => handleShow(item.id, item.title)} className="font-medium text-red-600 hover:underline">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <Modal show={show} onClose={handleClose} size="md" popup={true}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <svg
                            aria-hidden="true"
                            class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete {itemName}?</h3>
                        <div className="flex justify-center gap-4">
                            {isLoading ? (
                                <button
                                    onClick={() => handleDelete.mutate(itemId)}
                                    className="py-2 bg-red-600 hover:bg-red-800 text-white font-semibold w-full flex gap-2 justify-center items-center rounded-sm">
                                    <div
                                        class="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-neutral-100 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                        role="status">
                                        <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                    </div>
                                    Please wait...
                                </button>
                            ) : (
                                <button onClick={() => handleDelete.mutate(itemId)} className="py-2 bg-red-600 hover:bg-red-800 text-white font-semibold w-full rounded-sm">
                                    Yes, I'm sure
                                </button>
                            )}
                            <button onClick={handleClose} className="py-2 bg-white border-zinc-800 border-2 text-zinc-800 hover:bg-zinc-800 hover:text-white font-semibold w-full rounded-sm">
                                No, cancel
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
