import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useWindowSize } from "../hooks/useWindowSize";
import { ErrorScreen } from "./ErrorScreen";
import { LoadingScreen } from "./LoadingScreen";
import next from "../assets/next.svg";
import prev from "../assets/prev.svg";

export const ProductSelectedScreen = () => {
  const [showThisImg, setShowThisImg] = useState("");
  const [widthWindow] = useWindowSize();
  const { productoId } = useParams();
  const carouselRef = useRef(null);
  const { data, loading, error } = useFetch(
    `https://api.mercadolibre.com/items/${productoId}`,
    `https://api.mercadolibre.com/items/${productoId}/description`
  );
  const [showImgLg, setShowImgLg] = useState(false);

  useEffect(() => {
    if (widthWindow < 1024 && data) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [widthWindow]);

  useEffect(() => {
    if (data) {
      document.title = `${data.title} | MercadoLibre 📦`;
      setShowThisImg(data.pictures[0].url);
    }
  }, [data]);

  const prevImage = () => {
    if (widthWindow < 640 && carouselRef.current.scrollLeft % 240 === 0) {
      carouselRef.current.scrollLeft -= 240;
    } else if (widthWindow >= 640 && carouselRef.current.scrollLeft % 400 === 0) {
      carouselRef.current.scrollLeft -= 400;
    }
  };

  const nextImage = () => {
    if (widthWindow < 640 && carouselRef.current.scrollLeft % 240 === 0) {
      carouselRef.current.scrollLeft += 240;
    } else if (widthWindow >= 640 && carouselRef.current.scrollLeft % 400 === 0) {
      carouselRef.current.scrollLeft += 400;
    }
  };

  const prevImageLg = () => {
    let picturesLength = 0;
    data.pictures.forEach((picture) => {
      if (picture.url !== showThisImg) {
        picturesLength++;
      } else {
        if (picturesLength === 0) {
          setShowThisImg(data.pictures[data.pictures.length - 1].url);
        } else {
          setShowThisImg(data.pictures[picturesLength - 1].url);
        }
      }
    });
  };

  const nextImageLg = () => {
    let picturesLength = 0;
    data.pictures.forEach((picture) => {
      if (picture.url !== showThisImg) {
        picturesLength++;
      } else {
        if (picturesLength === data.pictures.length - 1) {
          setShowThisImg(data.pictures[0].url);
        } else {
          setShowThisImg(data.pictures[picturesLength + 1].url);
        }
      }
    });
  };

  if (loading) return <LoadingScreen />;

  if (!loading && data.title === undefined) return <ErrorScreen message="Error 404" />;

  if (error) return <ErrorScreen message={error.message} />;

  return (
    <div>
      <div
        className={`hidden fixed top-0 pt-16 w-full h-screen lg:block z-10 bg-[rgb(0,0,0,0.8)] ${
          showImgLg ? "lg:block" : "lg:hidden"
        }`}
      >
        <button
          className="absolute px-2 py-0.5 right-12 text-2xl bg-black text-white z-20"
          onClick={() => setShowImgLg(false)}
        >
          X
        </button>
        <button className="absolute top-[48%] bg-yellowML left-8 p-1 rounded-full z-20" onClick={prevImageLg}>
          <img className="w-[24px] h-[24px]" src={prev} alt="prev" />
        </button>
        <img
          className="absolute right-0 left-0 top-0 bottom-0 m-auto h-[90vh] max-w-[90vw] bg-gray-200"
          src={showThisImg}
          alt={showThisImg}
        />
        <button className="absolute top-[48%] bg-yellowML right-8 p-1 rounded-full z-20" onClick={nextImageLg}>
          <img className="w-[24px] h-[24px]" src={next} alt="next" />
        </button>
      </div>
      <div className="flex bg-grayProducts min-h-screen">
        <div className="flex flex-col w-full p-4 max-w-7xl mx-auto mt-6 rounded shadow bg-white">
          <p className="text-xs mb-2 text-gray-400 lg:hidden">
            {data.condition === "new" ? "Nuevo" : "Usado"} | {data.sold_quantity} vendidos
          </p>
          <p className="lg:hidden">{data.title}</p>

          <div className="relative flex w-[240px] min-w-[240px] sm:w-[400px] sm:min-w-[400px] mx-auto lg:w-full">
            {/* flex 2/3 container1 */}
            <div
              className="flex flex-col whitespace-nowrap overflow-x-hidden scroll-slow lg:w-2/3 lg:whitespace-normal"
              ref={carouselRef}
            >
              <div className="flex">
                <div className="flex py-4 mb-6 lg:mb-0 lg:flex-col">
                  {data.pictures.map((picture, i) => {
                    if (widthWindow >= 1024 && i < 8) {
                      if (i === 7) {
                        return (
                          <div
                            className="relative object-contain justify-center m-0 mb-3 w-12 h-12 border rounded min-w-0
                           lg:cursor-pointer lg:hover:border-blue-700"
                            key={picture.id}
                            onMouseEnter={() => setShowThisImg(picture.url)}
                          >
                            <img
                              className="absolute right-0 left-0 top-0 bottom-0 m-auto"
                              src={picture.url}
                              alt={picture.title}
                            />
                            <div
                              className="absolute w-full h-full text-2xl bg-[rgba(0,0,0,0.1)] text-blue-600"
                              onClick={() => setShowImgLg(true)}
                            >
                              <p className="p-2">+4</p>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <img
                          className="w-[240px] min-w-[240px] sm:w-[400px] sm:min-w-[400px] h-[240px] sm:h-[400px] object-contain justify-center lg:pr-1 lg:m-0 lg:mb-3 lg:w-12 lg:h-12 lg:border lg:rounded lg:min-w-0
                      lg:p-1 lg:cursor-pointer lg:hover:border-blue-700"
                          key={picture.id}
                          src={picture.url}
                          alt={picture.title}
                          onMouseEnter={() => setShowThisImg(picture.url)}
                        />
                      );
                    } else if (widthWindow < 1024) {
                      return (
                        <img
                          className="w-[240px] min-w-[240px] sm:w-[400px] sm:min-w-[400px] h-[240px] sm:h-[400px] object-contain justify-center lg:pr-1 lg:m-0 lg:mb-3 lg:w-12 lg:h-12 lg:border lg:rounded lg:min-w-0
                        lg:p-1 lg:cursor-pointer lg:hover:border-blue-700"
                          key={picture.id}
                          src={picture.url}
                          alt={picture.title}
                          onMouseEnter={() => setShowThisImg(picture.url)}
                        />
                      );
                    }
                  })}
                </div>
                <div className="hidden w-[650px] h-[450px] m-auto cursor-zoom-in lg:block" onClick={() => setShowImgLg(true)}>
                  <img className="flex mx-auto h-[400px] mt-12 bg-gray-200 object-cover" src={showThisImg} alt={showThisImg} />
                </div>

                <button
                  className="absolute bg-yellowML top-[120px] sm:top-[200px] lg:hidden left-4 sm:left-8 p-1 rounded-full z-20"
                  onClick={prevImage}
                >
                  <img className="w-[24px] h-[24px]" src={prev} alt="prev" />
                </button>
                <button
                  className="absolute bg-yellowML top-[120px] sm:top-[200px] lg:hidden right-4 sm:right-8 p-1 rounded-full z-20"
                  onClick={nextImage}
                >
                  <img className="w-[24px] h-[24px]" src={next} alt="next" />
                </button>
              </div>
              <div className="hidden border-t m-8 pt-8 pr-8 lg:flex flex-col">
                <h2 className="text-2xl mb-4 text-gray-800">Descripción</h2>
                <p className="text-lg mb-4 text-gray-500">{data.plain_text}</p>
              </div>
            </div>
            {/* flex 1/3 container2 */}
            <div className="hidden lg:flex flex-col w-1/3 min-w-[350px]">
              <div className="border rounded-lg p-4">
                <p className="text-xs mb-2 text-gray-400">
                  {data.condition === "new" ? "Nuevo" : "Usado"} | {data.sold_quantity} vendidos
                </p>
                <p className="text-xl font-semibold">{data.title}</p>
                <p className="line-through text-gray-400">{data.original_price && `$ ${data.original_price}`}</p>
                <p className="text-4xl">$ {data.price}</p>
                <p className="text-lg mb-6">en {data.price}</p>
                <p className="font-semibold mb-6">Stock disponible</p>
                <button className="w-full h-12 rounded font-semibold transition-colors mb-2 bg-bgBuyProduct hover:bg-hoverBgBuyProduct text-white">
                  Comprar ahora
                </button>
                <button className="w-full h-12 rounded font-semibold transition-colors bg-bgAddToCart hover:bg-hoverBgAddToCart text-blue-500">
                  Agregar al carrito
                </button>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-xl">Información sobre el vendedor</p>
                <p>Ubicación</p>
                <p className="text-sm text-gray-400">
                  {data.seller_address.city.name}, {data.seller_address.state.name}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h2 className="text-lg mb-4  text-gray-800">Medios de pago</h2>
                <h4 className="text-gray-800">Hasta 12 cuotas sin tarjeta</h4>
                <img
                  className="mb-4"
                  src="https://http2.mlstatic.com/storage/logos-api-admin/51b446b0-571c-11e8-9a2d-4b2bd7b1bf77-m.svg"
                  alt="mercadopago"
                />
                <h4 className="text-gray-800">Tarjetas de crédito</h4>
                <p className="text-sm text-gray-500">¡Cuotas sin interés con bancos seleccionados!</p>
                <div className="flex mb-4">
                  <img
                    className="mr-4 my-2"
                    src="https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg"
                    alt="visa"
                  />
                  <img
                    className="mr-4 my-2"
                    src="https://http2.mlstatic.com/storage/logos-api-admin/b2c93a40-f3be-11eb-9984-b7076edb0bb7-m.svg"
                    alt="american express"
                  />
                  <img
                    className="mr-4 my-2"
                    src="https://http2.mlstatic.com/storage/logos-api-admin/992bc350-f3be-11eb-826e-6db365b9e0dd-m.svg"
                    alt="naranja"
                  />
                  <img
                    className="mr-4 my-2"
                    src="https://http2.mlstatic.com/storage/logos-api-admin/aa2b8f70-5c85-11ec-ae75-df2bef173be2-m.svg"
                    alt="mastercard"
                  />
                </div>
                <h4 className="text-gray-800">Tarjetas de débito</h4>
                <div className="flex mb-4">
                  <img
                    className="mr-4 my-2"
                    src="https://http2.mlstatic.com/storage/logos-api-admin/312238e0-571b-11e8-823a-758d95db88db-m.svg"
                    alt="visa debito"
                  />
                  <img
                    className="mr-4 my-2"
                    src="https://http2.mlstatic.com/storage/logos-api-admin/ce454480-445f-11eb-bf78-3b1ee7bf744c-m.svg"
                    alt="maestro debito"
                  />
                  <img
                    className="mr-4 my-2"
                    src="https://http2.mlstatic.com/storage/logos-api-admin/157dce60-571b-11e8-95d8-631c1a9a92a9-m.svg"
                    alt="mastercard debito"
                  />
                  <img
                    className="mr-4 my-2"
                    src="https://http2.mlstatic.com/storage/logos-api-admin/cb0af1c0-f3be-11eb-8e0d-6f4af49bf82e-m.svg"
                    alt="cabal debito"
                  />
                </div>
                <h4 className="text-gray-800">Efectivo</h4>
                <div className="flex mb-4">
                  <img
                    className="mr-4 my-2"
                    src="https://http2.mlstatic.com/storage/logos-api-admin/fec5f230-06ee-11ea-8e1e-273366cc763d-m.svg"
                    alt="pago facil"
                  />
                  <img
                    className="mr-4 my-2"
                    src="https://http2.mlstatic.com/storage/logos-api-admin/443c34d0-571b-11e8-823a-758d95db88db-m.svg"
                    alt="rapipago"
                  />
                </div>
                <a href="/">Conocé otros medios de pago</a>
              </div>
            </div>
          </div>
          {/* Phone view */}
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
