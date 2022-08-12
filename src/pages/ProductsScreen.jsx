import { createRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";
import next from "../assets/next.svg";
import prev from "../assets/prev.svg";
import { useRef } from "react";

export const ProductsScreen = () => {
  const params = useParams();
  const { productosId } = params;
  const [dataPictures, setDataPictures] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allRefs, setAllRefs] = useState(useRef([]));

  useEffect(() => {
    document.title = `${productosId[0].toUpperCase() + productosId.slice(1)} | MercadoLibre 📦`;
    const fetchData = async () => {
      setData(null);
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${productosId}`);
        const json = await response.json();
        setData(json);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
          console.log(info.pictures);
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
    if (productosId.includes(item.id)) {
      return productosId.replace(
        `&${item.id}=` + productosId.split(`${item.id}=`)[1].split("&")[0],
        `&${item.id}=${value.id}`
      );
    }
    return `${productosId}&${item.id}=${value.id}`;
  };

  const asd = () => {
    let a = [1, 2, 3, 4, 5];
    a.unshift(a[a.length - 1]);
    a = a.slice(0, a.length - 1);
    /* console.log(a);
    console.log(dataPictures); */
    console.log(Object.keys(dataPictures).length);
  };

  const asdsa = {
    4421421: {},
  };

  if (loading) return <LoadingScreen />;

  if (error) return <ErrorScreen message={error.message} />;
  return (
    <div className="bg-grayProducts">
      <button onClick={asd}>asd</button>
      <div className="max-w-7xl mx-auto">
        <h1>ProductsScreen</h1>
        <div className="flex justify-center">
          <div className="hidden w-[278px] p-2 lg:block">
            <p className="text-2xl font-bold">{data?.query}</p>
            <p className="text-sm mb-6">{data?.results?.length} resultados</p>
            <div>
              {data?.filters?.map((filter) => {
                if ("category" === filter.id) return null;
                return (
                  <Link className="flex" key={filter.id} to={`/buscar/productos/${removeFilter(filter)}`}>
                    <p className="bg-white">{filter.name}</p>
                  </Link>
                );
              })}
            </div>
            <div className="">
              {data?.available_filters?.map((item) => (
                <div className="flex flex-col mb-6" key={item.id}>
                  <h3 className="flex text-sm font-bold mb-1">{item.name}: </h3>
                  {item.values.map((value, i) => {
                    if (i > 8) return null;
                    return (
                      <div key={value.id}>
                        <Link className="text-sm mb-0.5" to={`/buscar/productos/${setFilter(item, value)}`}>
                          {value.name}
                          <span className="ml-2 text-gray-500">({value.results})</span>
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
              console.log("product");
              return (
                <div
                  className="relative flex flex-col w-1/2 border lg:border-0 lg:w-[284px] lg:h-auto lg:m-2 lg:rounded lg:shadow lg:transition-shadow lg:hover:shadow-2xl bg-white"
                  key={product.id}
                >
                  <Link
                    className="flex flex-col h-full"
                    to={`/producto/${product.id}`}
                    onMouseEnter={() => getThesePictures(product.id)}
                  >
                    <div className="flex flex-col justify-center w-[284px] h-[285px] border-b mx-auto">
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
                              className="w-[25vw] max-w-full object-contain rounded-t mx-auto"
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
                        className="absolute bg-blue-500 top-[120px] left-0 z-20"
                        onClick={() => (allRefs[product.id].current.scrollLeft -= 284)}
                      >
                        <img className="w-[24px] h-[24px] ml-4" src={prev} alt="prev" />
                      </button>
                      <button
                        className="absolute bg-red-500 top-[120px] right-0 z-20"
                        onClick={() => (allRefs[product.id].current.scrollLeft += 284)}
                      >
                        <img className="w-[24px] h-[24px] mr-4" src={next} alt="next" />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
            <button onClick={() => console.log("asd")}>clg</button>
          </div>
        </div>
      </div>
    </div>
  );
};
