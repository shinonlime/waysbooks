import {useEffect} from "react";
import {useQuery} from "react-query";
import {Link} from "react-router-dom";
import {API} from "../config/api";

export default function UserBooks() {
    let {data, refetch} = useQuery("userBooksCache", async () => {
        const response = await API.get("/user/book");
        return response.data.data;
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <div>
            <h4 className="font-serif text-2xl md:text-3xl font-bold mb-3 md:mb-6">My Books</h4>
            <div className="grid justify-center">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-x-16 justify-items-center">
                    {data?.book_purchases?.map((book, index) => {
                        return (
                            <div key={index} className="w-[150px] md:w-[200px]">
                                <img src={book.thumbnail} alt="Cover Silabus" className="w-[150px] h-[200px] md:w-[200px] md:h-[300px] object-cover" />
                                <div className="py-2">
                                    <h4 className="font-serif text-base md:text-xl font-bold line-clamp-1">{book.title}</h4>
                                    <p className="italic text-xs md:text-sm line-clamp-1 mb-4">{book.writer}</p>
                                    {book.transaction.status === "success" ? (
                                        <Link
                                            to={book.book_attachment}
                                            className="inline-block text-center w-full rounded-sm border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-1">
                                            Download
                                        </Link>
                                    ) : book.transaction.status === "pending" ? (
                                        <button className="inline-block text-center w-full rounded-sm border-2 border-zinc-600 bg-zinc-600 text-white py-1" disabled>
                                            Payment Pending
                                        </button>
                                    ) : (
                                        <button className="inline-block text-center w-full rounded-sm border-2 border-red-600 bg-red-600 text-white py-1" disabled>
                                            Payment Failed
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
