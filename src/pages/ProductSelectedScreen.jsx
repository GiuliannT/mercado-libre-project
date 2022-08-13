import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useWindowSize } from "../hooks/useWindowSize";
import { ErrorScreen } from "./ErrorScreen";
import { LoadingScreen } from "./LoadingScreen";
import next from "../assets/next.svg";
import prev from "../assets/prev.svg";

export const ProductSelectedScreen = () => {
  const { productoId } = useParams();
  const carouselRef = useRef(null);
  const { data, loading, error } = useFetch(`https://api.mercadolibre.com/items/${productoId}`);

  const [widthWindow] = useWindowSize();

  useEffect(() => {
    if (widthWindow < 1024 && data) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [widthWindow]);

  const [showThisImg, setShowThisImg] = useState("");

  const handleShowThisImg = (e) => {
    console.log(e.target.src);
    setShowThisImg(e.target.src);
  };

  useEffect(() => {
    if (data) {
      document.title = `${data.title} | MercadoLibre 📦`;
      setShowThisImg(data.pictures[0].url);
    }
  }, [data]);

  const prevImage = () => {
    if (widthWindow < 640 && carouselRef.current.scrollLeft % 240 === 0) {
      carouselRef.current.scrollLeft -= 240;
    } else if (widthWindow >= 640 && widthWindow < 768 && carouselRef.current.scrollLeft % 400 === 0) {
      carouselRef.current.scrollLeft -= 400;
    } else if (widthWindow >= 768 && widthWindow < 1024 && carouselRef.current.scrollLeft % 550 === 0) {
      carouselRef.current.scrollLeft -= 550;
    }
  };

  const nextImage = () => {
    if (widthWindow < 640 && carouselRef.current.scrollLeft % 240 === 0) {
      carouselRef.current.scrollLeft += 240;
    } else if (widthWindow >= 640 && widthWindow < 768 && carouselRef.current.scrollLeft % 400 === 0) {
      carouselRef.current.scrollLeft += 400;
    } else if (widthWindow >= 768 && widthWindow < 1024 && carouselRef.current.scrollLeft % 550 === 0) {
      carouselRef.current.scrollLeft += 550;
    }
  };

  if (loading) return <LoadingScreen />;

  if (error) return <ErrorScreen message={error.message} />;

  return (
    <div>
      <div className="flex bg-grayProducts min-h-screen">
        <div className="flex flex-col w-full p-4 max-w-7xl mx-auto mt-6 rounded shadow bg-white">
          <p className="text-xs mb-2 text-gray-400 lg:hidden">
            {data.condition === "new" ? "Nuevo" : "Usado"} | {data.sold_quantity} vendidos
          </p>
          <p className="lg:hidden">{data.title}</p>
          <div className="relative flex w-[240px] min-w-[240px] sm:w-[400px] sm:min-w-[400px] md:w-[550px] md:min-w-[550px] mx-auto lg:w-full">
            <div
              className="flex whitespace-nowrap overflow-x-hidden scroll-slow lg:whitespace-normal"
              ref={carouselRef}
            >
              <div className="flex py-4 mb-6 lg:flex-col">
                {data.pictures.map((picture) => (
                  <img
                    className="w-[240px] min-w-[240px] sm:w-[400px] sm:min-w-[400px] md:w-[550px] md:min-w-[550px] h-full object-contain justify-center lg:pr-1 lg:m-0 lg:mb-3 lg:w-12 lg:h-12 lg:border lg:rounded lg:min-w-0
                    lg:p-1 lg:cursor-pointer lg:hover:border-blue-700"
                    key={picture.id}
                    src={picture.url}
                    alt={picture.title}
                    onMouseOver={handleShowThisImg}
                  />
                ))}
              </div>

              <div className="hidden w-[850px] h-[550px] lg:block">
                <img className="flex mx-auto mt-12 bg-gray-200" src={showThisImg} alt={showThisImg} />
              </div>
              <div className="hidden border rounded-lg p-4 max-w-[350px] lg:block">
                <p className="text-xs mb-2 text-gray-400 ">
                  {data.condition === "new" ? "Nuevo" : "Usado"} | {data.sold_quantity} vendidos
                </p>
                <p className="text-xl font-semibold">{data.title}</p>
                <p className="text-4xl font-extralight">$ {data.price}</p>
                <p className="text-lg font-extralight mb-6">en {data.price}</p>
                <p className="font-semibold mb-6">Stock disponible</p>
                <p className="text-xl">Información sobre el vendedor</p>
                <p>Ubicación</p>
                <p className="text-sm text-gray-400">
                  {data.seller_address.city.name}, {data.seller_address.state.name}
                </p>
              </div>
            </div>
            <button
              className="absolute bg-yellowML top-[140px] sm:top-[240px] md:top-[340px] lg:hidden left-4 sm:left-8 md:left-12 p-1 rounded-full z-20"
              onClick={prevImage}
            >
              <img className="w-[24px] h-[24px]" src={prev} alt="prev" />
            </button>
            <button
              className="absolute bg-yellowML top-[140px] sm:top-[240px] md:top-[340px] lg:hidden right-4 sm:right-8 md:right-12 p-1 rounded-full z-20"
              onClick={nextImage}
            >
              <img className="w-[24px] h-[24px]" src={next} alt="next" />
            </button>
          </div>
          <div className="lg:hidden">
            <p className="text-4xl font-extralight">$ {data.price}</p>
            <p className="text-lg font-extralight mb-6">en {data.price}</p>
            <p className="font-semibold mb-6">Stock disponible</p>
            <p className="text-xl">Información sobre el vendedor</p>
            <p>Ubicación</p>
            <p className="text-sm text-gray-400">
              {data.seller_address.city.name}, {data.seller_address.state.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
