import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

export const ProductsScreen = () => {
  const params = useParams();
  const { productoId } = params;
  const [productsData, setProductsData] = useState(null);

  const { data, loading, error } = useFetch(`https://api.mercadolibre.com/sites/MLA/search?q=${productoId}`);
  console.log(data);
  /* https://api.mercadolibre.com/sites/MLA/search?q=g27q&COLOR=52049 */
  useEffect(() => {
    if (data) {
      setProductsData(data.results);
    }
  });

  if (loading) return <div>Loading...</div>;

  if (error) return <ErrorScreen message={error.message} />;
  return (
    <div className="bg-grayProducts">
      <div className="max-w-7xl mx-auto">
        <h1>ProductsScreen</h1>
        <div className="flex">
          <div className="w-[300px] p-2">
            <p className="text-2xl font-bold">{data.query}</p>
            <p className="text-sm mb-6">{data.results.length} resultados</p>
            <div className="flex flex-col">
              {data.available_filters.map((item) => (
                <div className="flex flex-col mb-6">
                  <h3 className="text-sm font-bold mb-1">{item.name}: </h3>
                  {item.values.map((value) => (
                    <Link className="text-sm mb-0.5" to={`/buscar/productos/${productoId}&${item.id}=${value.id}`} >
                      {value.name}
                      <span className="ml-2 text-gray-500">({value.results})</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-center max-w-[800px]">
            {productsData &&
              productsData.map((product) => (
                <div className="w-[240px] h-[450px] m-3 rounded bg-white" key={product.id}>
                  <img className="w-[240px] h-[240px]" src={product.thumbnail} alt={product.title} />
                  <p className="text-2xl">$ {product.price}</p>
                  <h2 className="text-sm">{product.title}</h2>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
