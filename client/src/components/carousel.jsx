import {Carousel} from "flowbite-react";
import {useQuery} from "react-query";
import {API} from "../config/api";
import {Link} from "react-router-dom";

export default function CarouselBooks() {
    let {data: books} = useQuery("booksTop3Cache", async () => {
        const response = await API.get("/books-top-3");
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
        <div className="h-56 sm:h-64 xl:h-80 rounded-lg bg-slate-600">
            <Carousel slideInterval={4000} leftControl=" " rightControl=" ">
                {books?.map((book, index) => {
                    return (
                        <div key={index}>
                            <Link to={`/detail-book/${book.id}`} className="flex justify-center items-center">
                                <img src={book.thumbnail} alt="Cover" className="w-[150px] md:w-[220px] h-56 sm:h-64 xl:h-80 object-cover" />
                                <div className="grid w-full py-5 pl-5 pr-10 content-between bg-white">
                                    <div>
                                        <h4 className="text-2xl font-semibold">#{index + 1}</h4>
                                        <h4 className="font-serif text-xl font-bold line-clamp-2">{book.title}</h4>
                                        <p className="italic text-sm line-clamp-2 mb-4 self-end">{book.writer}</p>
                                        <div className="text-justify line-clamp-1 sm:line-clamp-3 text-sm" dangerouslySetInnerHTML={{__html: book?.description}}></div>
                                    </div>
                                    <div>
                                        <p className="text-green-500 font-bold mt-6">{rupiah(book.price)}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </Carousel>
        </div>
    );
}
