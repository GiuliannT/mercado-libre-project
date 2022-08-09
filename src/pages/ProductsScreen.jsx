import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { LoadingScreen } from "./LoadingScreen";

export const ProductsScreen = () => {
  const params = useParams();
  const { productosId } = params;
  const [productsData, setProductsData] = useState(null);

  const { data, loading, error } = useFetch(`https://api.mercadolibre.com/sites/MLA/search?q=${productosId}`);

  useEffect(() => {
    if (data) {
      setProductsData(data.results);
    }
    document.title = `${productosId} | MercadoLibre`;
  }, [data]);

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

  if (loading) return <LoadingScreen />;

  if (error) return <ErrorScreen message={error.message} />;
  return (
    <div className="bg-grayProducts">
      <div className="max-w-7xl mx-auto">
        <h1>ProductsScreen</h1>
        <div className="flex justify-center">
          <div className="hidden w-[278px] p-2 lg:block">
            <p className="text-2xl font-bold">{data.query}</p>
            <p className="text-sm mb-6">{data.results.length} resultados</p>
            <div>
              {data.filters.map((filter) => {
                if ("category" === filter.id) return null;
                return (
                  <Link className="flex" key={filter.id} to={`/buscar/productos/${removeFilter(filter)}`}>
                    <p className="bg-white">{filter.name}</p>
                  </Link>
                );
              })}
            </div>
            <div className="">
              {data.available_filters.map((item) => (
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
            {productsData &&
              productsData.map((product) => (
                <Link
                  className="flex p-4 flex-col w-1/2 border lg:border-0 lg:w-[284px] lg:h-[450px] lg:m-2 lg:rounded lg:shadow lg:transition-shadow lg:hover:shadow-2xl bg-white"
                  to={`/producto/${product.id}`}
                  key={product.id}
                >
                  <img className="w-[284px] h-[284px] rounded-t object-contain mx-auto" src={product.thumbnail} alt={product.title} />
                  <p className="text-2xl">$ {product.price}</p>
                  <h2 className="text-sm">{product.title}</h2>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
