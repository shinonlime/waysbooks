import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {useQuery, useMutation} from "react-query";

import {API} from "../config/api";

export default function CardBooks() {
    let {data: books} = useQuery("booksCache", async () => {
        const response = await API.get("/books");
        return response.data.data;
    });

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <div className="mx-5 mt-12 md:mx-20 lg:mx-40">
            <h4 className="font-serif text-2xl md:text-3xl font-bold mb-3 md:mb-6">List Books</h4>
            <div className="grid justify-center">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-x-16 justify-items-center">
                    {books &&
                        books.length > 0 &&
                        books.map((book, index) => (
                            <Link to={`/detail-book/${book.id}`}>
                                <div key={index} className="w-[150px] md:w-[200px]">
                                    <img src={book.thumbnail} alt="Cover" className="w-[150px] h-[200px] md:w-[200px] md:h-[300px] object-cover" />
                                    <div className="grid py-2 content-between">
                                        <div>
                                            <h4 className="font-serif text-base md:text-xl font-bold line-clamp-1">{book.title}</h4>
                                            <p className="italic text-xs line-clamp-1 mb-4 self-end">{book.writer}</p>
                                        </div>
                                        <div>
                                            <p className="text-green-500 font-bold">{rupiah(book.price)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
}
