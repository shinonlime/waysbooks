import CardBooks from "../components/card-books";
import CarouselBooks from "../components/carousel";

export default function LandingPage() {
    document.title = "WaysBooks";
    return (
        <>
            <div className="mx-auto my-12 lg:my-24 w-5/6 md:w-4/6">
                <h1 className="font-serif text-2xl md:text-5xl text-center leading-normal md:leading-normal">With us, you can shop online & help save your high street at the same time</h1>
            </div>
            <div className="mx-auto w-5/6 md:w-2/3 lg:w-1/2">
                <CarouselBooks />
            </div>
            <CardBooks />
        </>
    );
}
