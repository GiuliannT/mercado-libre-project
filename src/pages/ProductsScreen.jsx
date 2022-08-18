import React, { createRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";
import next from "../assets/next.svg";
import prev from "../assets/prev.svg";
import { useRef } from "react";
import { useFetch } from "../hooks/useFetch";
import { ErrorScreen } from "./ErrorScreen";

export const ProductsScreen = () => {
  const params = useParams();
  const { productosId } = params;
  const [dataPictures, setDataPictures] = useState([]);
  const { data, loading, error } = useFetch(`https://api.mercadolibre.com/sites/MLA/search?q=${productosId}`);

  const [allRefs, setAllRefs] = useState(useRef([]));

  useEffect(() => {
    if (productosId.includes("&")) {
      document.title = `${productosId[0].toUpperCase() + productosId.split("&")[0].slice(1)} | MercadoLibre 📦`;
    } else {
      document.title = `${productosId[0].toUpperCase() + productosId.slice(1)} | MercadoLibre 📦`;
    }
  }, [productosId]);

  useEffect(() => {
    /*  window.scrollTo(0, 0); */
    if (data) {
      data.results.map((e) => {
        setAllRefs((prev) => ({
          ...prev,
          [e.id]: createRef(),
        }));
      });
    }
  }, [data]);

  const getThesePictures = (productId) => {
    if (dataPictures[productId] === undefined) {
      let dataPicturesTemporary = {};
      fetch(`https://api.mercadolibre.com/items/${productId}`)
        .then((res) => res.json())
        .then((info) => {
          let a = productId;
          let b = info.pictures;
          dataPicturesTemporary[a] = b;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setDataPictures((prev) => ({
            ...prev,
            ...dataPicturesTemporary,
          }));
        });
    }
  };

  const removeFilter = (filter) => {
    const newproductosId = productosId.split("&" + filter.id + "=" + filter.values[0].id).join("");
    return newproductosId;
  };

  const setFilter = (item, value) => {
    const removePointZero = value.id.replace(/\.0/g, "");
    if (productosId.includes(item.id + "=")) {
      return productosId.replace(
        `&${item.id}=` + productosId.split(`${item.id}=`)[1].split("&")[0],
        `&${item.id}=${removePointZero}`
      );
    }
    return `${productosId}&${item.id}=${removePointZero}`;
  };

  const prevImage = (productId) => {
    if (allRefs[productId].current.scrollLeft % 284 === 0) {
      allRefs[productId].current.scrollLeft -= 284;
    }
  };

  const nextImage = (productId) => {
    if (allRefs[productId].current.scrollLeft % 284 === 0) {
      allRefs[productId].current.scrollLeft += 284;
    }
  };

  const asd = () => {
    let a = [1, 2, 3, 4, 5];
    a.unshift(a[a.length - 1]);
    a = a.slice(0, a.length - 1);
  };

  if (loading) return <LoadingScreen />;

  if (!loading && data.results.length === 0) return <ErrorScreen message="No se encontraron resultados" />;

  if (error) return <ErrorScreen message={error.message} />;
  return (
    <div className="bg-grayProducts">
      <button onClick={asd}>asd</button>
      <div className="max-w-7xl mx-auto">
        <h1>ProductsScreen</h1>
        <div className="flex justify-center">
          <div className="hidden w-[278px] p-2 lg:block">
            <p className="text-2xl font-bold">{data?.query}</p>
            <p className="text-sm mb-6">{data?.paging?.total} resultados</p>
            <div className="flex mb-6">
              {data?.filters?.map((filter) => {
                if (!productosId.includes(filter.id)) return null;
                return (
                  <Link className="flex mb-2 mr-2" key={filter.id} to={`/buscar/productos/${removeFilter(filter)}`}>
                    <p className="text-xs pl-2 pr-1 py-1 bg-white text-[rgb(102,102,102)]">
                      {filter.name}
                      <span className="px-2 py-0.5 text-[rgb(180,180,180)] hover:text-[rgb(102,102,102)]">X</span>
                    </p>
                  </Link>
                );
              })}
            </div>
            <div className="">
              {data?.available_filters?.map((item) => (
                <div className="flex flex-col mb-6" key={item.id}>
                  <h3 className="flex text-sm font-semibold mb-1 text-[rgb(51,51,51)]">{item.name}: </h3>
                  {item.values.map((value, i) => {
                    if (i > 8) return null;
                    return (
                      <div key={value.id}>
                        <Link
                          className="text-sm mb-0.5 text-[rgb(102,102,102)]"
                          to={`/buscar/productos/${setFilter(item, value)}`}
                        >
                          {value.name}
                          <span className="ml-2 text-[rgb(140,140,140)]">({value.results})</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-center max-w-[900px]">
            {data?.results?.map((product) => {
              return (
                <div
                  className="relative flex flex-col w-1/2 border lg:max-h-[500px] lg:border-0 lg:w-[284px] lg:h-auto lg:m-2 lg:rounded lg:shadow lg:transition-shadow lg:hover:shadow-2xl bg-white"
                  key={product.id}
                >
                  <Link
                    className="flex flex-col h-full"
                    to={`/producto/${product.id}`}
                    onMouseEnter={() => getThesePictures(product.id)}
                  >
                    <div className="flex flex-col justify-center w-full lg:w-[284px] lg:h-[285px] lg:border-b mx-auto">
                      <div
                        className="flex w-full whitespace-nowrap overflow-x-hidden scroll-slow rounded-t z-10"
                        ref={allRefs[product.id]}
                      >
                        <div className="flex w-full rounded-t">
                          {dataPictures[product.id] ? (
                            dataPictures[product.id]?.map((picture) => (
                              <img
                                className="object-contain rounded-t w-full min-w-[284px]"
                                key={picture.id}
                                src={picture.url}
                                alt={product.title}
                              />
                            ))
                          ) : (
                            <img
                              className="w-full object-contain rounded-t mx-auto"
                              src={product.thumbnail}
                              alt={product.title}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-2xl">$ {product.price}</p>
                      <h2 className="text-sm">{product.title}</h2>
                    </div>
                  </Link>

                  {dataPictures[product.id]?.length > 1 && (
                    <>
                      <button
                        className="absolute bg-yellowML top-[120px] left-4 p-1 rounded-full z-20"
                        onClick={() => prevImage(product.id)}
                      >
                        <img className="w-[24px] h-[24px]" src={prev} alt="prev" />
                      </button>
                      <button
                        className="absolute bg-yellowML top-[120px] right-4 p-1 rounded-full z-20"
                        onClick={() => nextImage(product.id)}
                      >
                        <img className="w-[24px] h-[24px]" src={next} alt="next" />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
