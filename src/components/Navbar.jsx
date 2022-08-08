import { Link, useNavigate } from "react-router-dom";
import iconLogoSmall from "../assets/iconLogoSmall.png";
import iconLogoLarge from "../assets/iconLogoLarge.png";
import iconSearch from "../assets/iconSearch.svg";
import iconMenu from "../assets/iconMenu.svg";
import iconCart from "../assets/iconCart.svg";
import { useRef } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/buscar/productos/${inputRef.current.value}`);
  };

  return (
    <nav className="bg-yellowML">
      <div className="flex flex-col max-w-7xl mx-auto">
        <section className="flex justify-between p-2">
          <div className="flex w-11 h-[34px] mr-2 lg:w-[134px] lg:mr-12">
            <Link className="w-11 h-[34px] lg:w-[134px]" to="/">
              <img className="w-11 h-[34px] lg:hidden" src={iconLogoSmall} alt="logo" />
              <img className="hidden w-[134px] h-[34px] lg:block" src={iconLogoLarge} alt="logo" />
            </Link>
          </div>

          <div className="flex w-full text-center bg-white rounded shadow items-center lg:h-[40px] lg:w-[600px]">
            <form className="flex w-full">
              <label className="flex items-center w-full">
                <img className="flex w-4 h-4 m-2 backdrop-filter lg:hidden" src={iconSearch} alt="logo" />
                <input
                  className="w-full h-full outline-none text-gray-600 placeholder:text-gray-300 lg:pl-4"
                  placeholder="Buscar productos, marcas y más..."
                  ref={inputRef}
                />
              </label>
              <button type="submit" onClick={handleSubmit}>
                <img className="hidden w-4 h-4 m-2 backdrop-filter lg:block" src={iconSearch} alt="logo" />
              </button>
            </form>
          </div>

          <div className="flex justify-around w-[90px] lg:hidden">
            <button>
              <img className="w-6 h-6" src={iconMenu} alt="menu" />
            </button>
            <button>
              <img className="w-6 h-6" src={iconCart} alt="menu" />
            </button>
          </div>

          <div className="hidden lg:flex w-[340px] bg-green-200">hola</div>
        </section>
        <section className="flex justify-between border-t">
          <div>direc</div>
          <div>menu</div>
          <div>menu2</div>
        </section>
      </div>
    </nav>
  );
};
