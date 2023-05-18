import React, { useState } from "react";

const CrystallizeCarouselSlide = (props) => {
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
