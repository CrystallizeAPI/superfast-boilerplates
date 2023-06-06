import React, { useCallback, useEffect, useRef, useState } from "react";

const CrystallizeCarousel = (props: any) => {
  const { options } = props;

  const [slideWidth, setSlideWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startDrag, setStartDrag] = useState(0);
  const [dragTranslate, setDragTranslate] = useState(0);
  const [currentTranslation, setCurrentTranslation] = useState(0);

  const wrapperRef = useRef(null) as React.MutableRefObject<any>;

  // Calculate the width of child elements based on perPage elements number
  useEffect(() => {
    setSlideWidth(
      (wrapperRef.current.clientWidth + 10) / (options?.perPage || 2)
    );
  }, [slideWidth]);

  console.log(currentIndex);
  // Move wrapper on next previous button
  useEffect(() => {
    const a = document.getElementById("crs-slider-wrapper__inner");
    a!.style.transition = "0.5s transform ease-in-out";
    setDragTranslate(-((slideWidth || 0) * currentIndex));
    setCurrentTranslation(-((slideWidth || 0) * currentIndex));
  }, [currentIndex]);

  const goToNextSlide = () => {
    if (currentIndex + options.perPage >= props.children.length) return;
    setCurrentIndex(currentIndex + options.perPage);
  };

  const goToPreviousSlide = () => {
    if (currentIndex - options.perPage < 0) return;
    setCurrentIndex(currentIndex - options.perPage);
  };

  const preventDefault = useCallback((e: any) => e.preventDefault(), []);

  // Reference the element on which Dragging was inititated in order to remove preventDefault listener correctly
  const clickedElement = useRef<any>();

  const handlePreciseTranslating = () => {
    const gap = dragTranslate / slideWidth;
    const rem = dragTranslate % slideWidth;
    const a = document.getElementById("crs-slider-wrapper__inner");
    a!.style.transition = "0.5s transform ease-in-out";
    if (rem < slideWidth / 2) {
      setDragTranslate(Math.floor(gap) * slideWidth);
      setCurrentTranslation(Math.floor(gap) * slideWidth);
    } else {
      setDragTranslate(Math.ceil(gap) * slideWidth);
      setCurrentTranslation(Math.ceil(gap) * slideWidth);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="absolute left-[-20px] top-[35%] z-50 p-2 cursor-pointer bg-white border border-black rounded-full scale-x-[-1] hover:scale-x-[-1] hover:bg-black hover:text-white"
        onClick={goToPreviousSlide}
        style={{ display: currentIndex === 0 ? "none" : "block" }}
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
      <div className="relative w-full overflow-hidden">
        <ul
          id="crs-slider-wrapper"
          ref={wrapperRef}
          onClick={(e) => {
            if (clickedElement.current) {
              clickedElement.current.removeEventListener(
                "click",
                preventDefault,
                true
              );
            }
            setCurrentTranslation(dragTranslate);
            setIsMouseDown(false);
            handlePreciseTranslating();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsMouseDown(true);
            clickedElement.current = e.target;
            setStartDrag(e.clientX);
            const a = document.getElementById("crs-slider-wrapper__inner");
            a!.style.transition = "0s transform ease-in-out";
          }}
          onMouseMove={(e) => {
            if (isMouseDown) {
              const currentDrag = e.clientX;
              const dragDelta = currentDrag - startDrag;

              //@todo calculate boundaries beginning and end and condition this function
              setDragTranslate(currentTranslation + dragDelta);
              if (clickedElement.current) {
                clickedElement.current.addEventListener(
                  "click",
                  preventDefault,
                  true
                );
              }
            } else {
              if (clickedElement.current) {
                clickedElement.current.removeEventListener(
                  "click",
                  preventDefault,
                  true
                );
              }
            }
          }}
          onMouseLeave={(e) => {
            if (clickedElement.current) {
              clickedElement.current.removeEventListener(
                "click",
                preventDefault,
                true
              );
            }
            setIsMouseDown(false);
            setCurrentTranslation(dragTranslate);
            handlePreciseTranslating();
          }}
        >
          <div
            id="crs-slider-wrapper__inner"
            className="flex"
            style={{
              willChange: "transform",
              transform: `translateX(${dragTranslate}px)`,
            }}
          >
            {props.children}
          </div>
        </ul>
      </div>
      <button
        type="button"
        className="absolute right-[-20px] top-[35%]  z-50 p-2  cursor-pointer bg-white border border-black rounded-full hover:bg-black hover:text-white"
        onClick={goToNextSlide}
        //dont show button if on last slide
        style={{
          display:
            currentIndex + options.perPage >= props.children.length
              ? "none"
              : "block",
        }}
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default CrystallizeCarousel;
