import {useState} from "react";
import {useForm} from "react-hook-form";
import {API} from "../../config/api";
import {useNavigate} from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AddBook() {
    const title = "Add Book";
    document.title = "WaysBooks | " + title;
    
    const [description, setDescription] = useState("");
    const [preview, setPreview] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [form, setForm] = useState({book_attachment: "", image: ""});
    const {
        register,
        handleSubmit,
        resetField,
        formState: {errors},
    } = useForm();

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
        });

        if (e.target.type === "file" && e.target.accept.includes("image")) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onSubmit = async (input) => {
        try {
            setLoading(true);

            const hasBook = form.book_attachment && form.book_attachment[0];
            const hasImage = form.image && form.image[0];

            const config = {
                header: {
                    "Content-type": "multipart/form-data",
                },
            };

            const formData = new FormData();
            formData.append("title", input.title);
            formData.append("publication_date", input.publication_date);
            formData.append("pages", input.pages);
            formData.append("isbn", input.isbn);
            formData.append("writer", input.writer);
            formData.append("price", input.price);
            formData.append("description", description);
            if (hasBook) {
                formData.set("book_attachment", form.book_attachment[0], form.book_attachment[0].name);
            }
            if (hasImage) {
                formData.set("image", form.image[0], form.image[0].name);
            }

            const response = await API.post("/book", formData, config);
            console.log(response);

            setLoading(false);

            navigate("/list-books");
        } catch (error) {
            console.log("update failed : ", error);
            setLoading(false);
        }
    };
    return (
        <div className="my-10 mx-5 md:mx-20 lg:mx-40 flex gap-8 justify-center">
            <div className="w-1/2">
                <h4 className="font-serif text-2xl md:text-3xl font-bold mb-3 md:mb-6">Add Book</h4>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            {...register("title")}
                            name="title"
                            type="text"
                            placeholder="Title"
                            className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0 mb-3"
                        />
                        <input
                            {...register("publication_date")}
                            name="publication_date"
                            type="date"
                            placeholder="Publication Date"
                            className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0 mb-3"
                        />
                        <input
                            {...register("pages")}
                            name="pages"
                            type="number"
                            placeholder="Pages"
                            className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0 mb-3"
                        />
                        <input
                            {...register("isbn")}
                            name="isbn"
                            type="number"
                            placeholder="ISBN"
                            className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0 mb-3"
                        />
                        <input
                            {...register("writer")}
                            name="writer"
                            type="text"
                            placeholder="Writer"
                            className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0 mb-3"
                        />
                        <input
                            {...register("price")}
                            name="price"
                            type="number"
                            placeholder="Price"
                            className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0 mb-3"
                        />
                        <label className="text-gray-500">Description</label>
                        <ReactQuill theme="snow" value={description} onChange={setDescription} className="mt-1" />
                        <div className="flex justify-between gap-4 mt-3">
                            <div className="w-1/2">
                                <label className="text-gray-500">Upload book</label>
                                <input
                                    onChange={handleChange}
                                    name="book_attachment"
                                    type="file"
                                    placeholder="Book"
                                    accept="application/pdf"
                                    className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0 mb-3"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="text-gray-500">Upload image</label>
                                <input
                                    onChange={handleChange}
                                    name="image"
                                    type="file"
                                    placeholder="Thumbnail"
                                    accept="image/*"
                                    className="rounded-sm w-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 focus:ring-0 mb-3"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-8">
                            {isLoading ? (
                                <button className="rounded-sm flex gap-2 items-center border-2 border-zinc-600 bg-zinc-600 hover:border-zinc-700 hover:bg-zinc-700 text-white py-2 px-6 hover" disabled>
                                    <div
                                        class="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-neutral-100 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                        role="status">
                                        <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                    </div>
                                    Please wait...
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="rounded-sm flex gap-3 items-center border-2 border-zinc-800 bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-700 text-white py-2 px-6 hover">
                                    Add book <img src="assets/icon/book-white.png" alt="" className="h-6" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <div>{preview && <img src={preview} alt="Cover" className="w-96 h-[550px] mt-16 object-cover" />}</div>
        </div>
    );
}
