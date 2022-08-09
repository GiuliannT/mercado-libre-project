import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { ErrorScreen } from "./ErrorScreen";
import { LoadingScreen } from "./LoadingScreen";

export const ProductSelectedScreen = () => {
  const { productoId } = useParams();
  const carouselRef = useRef(null);
  const { data, loading, error } = useFetch(`https://api.mercadolibre.com/items/${productoId}`);

  const [showThisImg, setShowThisImg] = useState("");

  const handleShowThisImg = (e) => {
    setShowThisImg(e.target.src);
  };

  useEffect(() => {
    if (data) {
      document.title = `${data.title} | MercadoLibre`;
      setShowThisImg(data.pictures[0].url);
    }
  }, [data]);

  if (loading) return <LoadingScreen />;

  if (error) return <ErrorScreen message={error.message} />;

  return (
    <div>
      <div className="flex bg-grayProducts">
        <div className="flex flex-col w-full p-4 max-w-7xl mx-auto mt-6 rounded shadow bg-white">
          <p className="text-xs mb-2 text-gray-400 lg:hidden">
            {data.condition === "new" ? "Nuevo" : "Usado"} | {data.sold_quantity} vendidos
          </p>
          <p className="lg:hidden">{data.title}</p>
          <div className="flex">
            <div className="flex whitespace-nowrap overflow-x-auto lg:whitespace-normal" ref={carouselRef}>
              <div className="flex py-4 mb-6 lg:flex-col">
                {data.pictures.map((picture) => (
                  <img
                    className="w-full h-full object-contain sm:pr-[18vw] justify-center m-4 lg:pr-1 lg:m-0 lg:mb-3 lg:w-12 lg:h-12 lg:border lg:rounded 
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
