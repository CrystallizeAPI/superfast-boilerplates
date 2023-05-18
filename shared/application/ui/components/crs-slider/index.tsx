import { getEventListeners } from "events";
import React, { useCallback, useEffect, useRef, useState } from "react";

const CrystallizeCarousel = (props) => {
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
      (wrapperRef.current.clientWidth + 10) / (options?.perPage || 5)
    );
  }, [slideWidth]);

  // Move wrapper on next previous button
  useEffect(() => {
    const a = document.getElementById("crs-slider-wrapper__inner");
    a.style.transition = "0.5s transform ease-in-out";
    setDragTranslate(-((slideWidth || 0) * currentIndex));
    setCurrentTranslation(-((slideWidth || 0) * currentIndex));
  }, [currentIndex]);

  const goToNextSlide = () => {
    setCurrentIndex(currentIndex + options.perPage);
  };

  const goToPreviousSlide = () => {
    setCurrentIndex(currentIndex - options.perPage);
  };

  const preventDefault = useCallback((e) => e.preventDefault(), []);

  // Reference the element on which Dragging was inititated in order to remove preventDefault listener correctly
  const clickedElement = useRef<any>();

  const handlePreciseTranslating = () => {
    const gap = dragTranslate / slideWidth;
    const rem = dragTranslate % slideWidth;
    const a = document.getElementById("crs-slider-wrapper__inner");
    a.style.transition = "0.5s transform ease-in-out";
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
      <div
        className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-50 p-2 bg-[red] cursor-pointer"
        onClick={goToPreviousSlide}
      >
        Previous
      </div>
      <div className="relative overflow-hidden">
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
            a.style.transition = "0s transform ease-in-out";
          }}
          onMouseMove={(e) => {
            if (isMouseDown) {
              const currentDrag = e.clientX;
              const dragDelta = currentDrag - startDrag;

              //@todo calculate boundaries beginning and end and condition this functoin
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
      <div
        className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-50 p-2 bg-[red] cursor-pointer"
        onClick={goToNextSlide}
      >
        Next
      </div>
    </div>
  );
};

export default CrystallizeCarousel;
