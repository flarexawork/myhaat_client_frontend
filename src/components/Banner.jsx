import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { get_banners } from "../store/reducers/homeReducer";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Banner = () => {
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.home);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    dispatch(get_banners());
  }, []);
  return (
    <div className="w-full">
      <div className="max-w-[1440px] mx-auto px-14 sm:px-5 md-lg:px-12 md:px-10">
        <div className="mt-6 w-full">
          <Carousel
            autoPlay={true}
            infinite={true}
            arrows={true}
            showDots={true}
            responsive={responsive}
          >
            {banners &&
              banners.length > 0 &&
              banners.map((b, i) =>
                b.link ? (
                  <Link
                    className="block sm:h-auto h-[330px] w-full overflow-hidden sm:rounded-sm rounded-3xl border border-[#f3d8c9] bg-[#fff8f3]"
                    key={i}
                    to={
                      b.link.startsWith("/")
                        ? b.link
                        : `/product/details/${b.link}`
                    }
                  >
                    <img
                      className="h-full w-full object-contain"
                      loading={i === 0 ? "eager" : "lazy"}
                      src={b.banner}
                      alt="Home banner"
                    />
                  </Link>
                ) : (
                  <div
                    className="block sm:h-auto h-[330px] w-full overflow-hidden sm:rounded-sm rounded-3xl border border-[#f3d8c9] bg-[#fff8f3]"
                    key={i}
                  >
                    <img
                      className="h-full w-full object-contain"
                      loading={i === 0 ? "eager" : "lazy"}
                      src={b.banner}
                      alt="Home banner"
                    />
                  </div>
                ),
              )}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Banner;
