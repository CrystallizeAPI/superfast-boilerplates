import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Product } from "../components/item/product";
import { ProductSlim } from "~/use-cases/contracts/Product";
import CrystallizeCarousel from "./crs-slider";
import CrystallizeCarouselSlide from "./crs-slider/CrystallizeCarouselSlide";
import React from "react";

export const CategoryList: React.FC<{ products: ProductSlim[] }> = ({
  products,
}) => {
  return (
    <div className="my-10 w-full">
      <div className="w-full">
        <CrystallizeCarousel
          options={{
            perPage: 5,
            itemLength: products?.length,
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
        </CrystallizeCarousel>
      </div>
    </div>
  );
};
