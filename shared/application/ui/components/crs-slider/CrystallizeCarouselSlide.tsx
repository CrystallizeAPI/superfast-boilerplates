import React from "react";

const CrystallizeCarouselSlide = (props: any) => {
  return (
    <li
      className="shrink-0 list-none m-0 relative"
      style={{
        marginRight: "10px",
        width: "calc(((100% + 10px) / 5) - 10px)",
        backfaceVisibility: "hidden",
      }}
    >
      {props.children}
    </li>
  );
};

export default CrystallizeCarouselSlide;
