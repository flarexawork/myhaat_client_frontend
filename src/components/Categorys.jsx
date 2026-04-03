import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Categorys = () => {
  const { categorys } = useSelector((state) => state.home);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mdtablet: {
      breakpoint: { max: 991, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 3,
    },
    smmobile: {
      breakpoint: { max: 640, min: 0 },
      items: 2,
    },
    xsmobile: {
      breakpoint: { max: 440, min: 0 },
      items: 2,
    },
  };
  return (
    <div className="w-full mx-auto relative">
      <Carousel
        autoPlay={true}
        infinite={true}
        arrows={true}
        responsive={responsive}
        transitionDuration={500}
      >
        {categorys.map((c, i) => (
          <Link
            key={i}
            to={`/products?category=${c.name}`}
            className="block px-3"
          >
            <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 p-6 flex flex-col items-center mb-[4px]">
              {/* CIRCLE IMAGE */}
              <div className="sm:h-20 sm:w-20 w-28 h-28 rounded-full overflow-hidden border-4 border-transparent group-hover:border-gradient-to-r group-hover:from-[#1E40AF] group-hover:to-[#F97316] transition-all duration-500">
                <img
                  src={c.image}
                  alt="category"
                  className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-110"
                />
              </div>

              {/* CATEGORY NAME */}
              <h3 className="mt-4 text-[15px] font-semibold text-gray-700 group-hover:text-[#1E40AF] transition-colors duration-300 text-center">
                {c.name}
              </h3>

              {/* Small decorative line */}
              <div className="w-10 h-[2px] bg-gradient-to-r from-[#EC4899] to-[#F97316] mt-3 opacity-70 group-hover:w-16 transition-all duration-500" />
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};

export default Categorys;
