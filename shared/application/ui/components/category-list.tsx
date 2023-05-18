import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Product } from "../components/item/product";
import { ProductSlim } from "~/use-cases/contracts/Product";
import CrystallizeCarousel from "./crs-slider";
import CrystallizeCarouselSlide from "./crs-slider/CrystallizeCarouselSlide";
import { SebCarousel } from "./seb-slider";
import GPTCarousel from "./gpt-slider";
import React from "react";

export const CategoryList: React.FC<{ products: ProductSlim[] }> = ({
  products,
}) => {
  return (
    <div className="my-10 w-full">
      <div className="w-full">
        {/* <SebCarousel
          options={{
            perPage: 5,
            itemLength: 24,
          }}
        >
          {products?.slice(0, 12)?.map((product, i) => {
            return (
              <CrystallizeCarouselSlide
                key={`${product.name}-${product.path}`}
                className="slide items-stretch pb-10"
                perPage={5}
                itemIndex={i}
              >
                <Product item={product} />
              </CrystallizeCarouselSlide>
            );
          })}
        </SebCarousel> */}

        <CrystallizeCarousel
          options={{
            perPage: 5,
            itemLength: 24,
          }}
        >
          {products?.slice(0, 12)?.map((product, i) => {
            return (
              <CrystallizeCarouselSlide
                key={`${product.name}-${product.path}`}
                className="slide items-stretch pb-10"
                perPage={5}
                itemIndex={i}
              >
                <Product item={product} />
              </CrystallizeCarouselSlide>
            );
          })}
          {products?.slice(0, 12)?.map((product, i) => {
            return (
              <CrystallizeCarouselSlide
                key={`${product.name}-${product.path}`}
                className="slide items-stretch pb-10"
                perPage={5}
                itemIndex={i}
              >
                <Product item={product} />
              </CrystallizeCarouselSlide>
            );
          })}
        </CrystallizeCarousel>
        <Splide
          options={{
            rewind: true,
            perPage: 5,
            breakpoints: {
              1200: {
                perPage: 4,
              },
              940: {
                perPage: 3,
              },
              480: {
                perPage: 2,
              },
            },
            pagination: false,
            gap: 10,
          }}
          className="splide "
        >
          {products?.slice(0, 12)?.map((product) => {
            return (
              <SplideSlide
                key={`${product.name}-${product.path}`}
                className="slide items-stretch pb-10"
              >
                <Product item={product} />
              </SplideSlide>
            );
          })}
        </Splide>
      </div>
    </div>
  );
};
