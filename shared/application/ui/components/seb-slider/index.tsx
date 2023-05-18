import React, {
  Children,
  ReactNode,
  useEffect,
  useReducer,
  useRef,
} from "react";

type State = {
  isDragging: boolean;
  isInitiated: boolean;
  currentIndex: number;
  slideCount: number;
  slideWidth: number;
  slidePerPage: number;
  translateX: number;
};
type Action =
  | {
      type:
        | "mousedown"
        | "click"
        | "previous-slide"
        | "next-slide"
        | "translate-x"
        | "mouseup";
    }
  | {
      type: "set-slider-width";
      width: number;
    }
  | {
      type: "mousemove";
      x: number;
      y: number;
    };

function reducer(state: State, action: Action): State {
  let newIndex: number;
  switch (action.type) {
    case "mousedown":
      return {
        ...state,
        isInitiated: true,
      };
    case "click":
      return {
        ...state,
        isDragging: false,
        isInitiated: false,
      };
    case "mousemove":
      return {
        ...state,
        isDragging: state.isInitiated,
        translateX: 10,
        // translateX: state.isInitiated ? action.x : state.translateX,
      };
    case "previous-slide":
      newIndex = Math.max(state.currentIndex - 1, 0);
      return {
        ...state,
        currentIndex: newIndex,
        translateX: -((state.slideWidth || 0) * newIndex),
      };
    case "next-slide":
      newIndex = Math.min(state.currentIndex + 1, state.slideCount - 1);
      return {
        ...state,
        currentIndex: newIndex,
        translateX: -((state.slideWidth || 0) * newIndex),
      };
    case "set-slider-width":
      return {
        ...state,
        slideWidth: (action.width + 10) / state.slidePerPage - 10,
      };
    case "translate-x":
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.slideCount - 1),
      };
    default:
      return state;
  }
}

type Props = {
  perPage?: number;
};
export const SebCarousel: React.FC<{
  children: ReactNode;
  options?: Props;
}> = ({ children, options }) => {
  const wrapperRef = useRef<HTMLUListElement>(null);
  const [state, dispatch] = useReducer(reducer, {
    isDragging: false,
    isInitiated: false,
    slidePerPage: options?.perPage || 5,
    currentIndex: 0,
    slideCount: Children.count(children),
    slideWidth: 0,
    translateX: 0,
  });

  useEffect(() => {
    dispatch({
      type: "set-slider-width",
      width: wrapperRef.current ? wrapperRef.current.clientWidth : 0,
    });
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          dispatch({ type: "previous-slide" });
        }}
      >
        Previous
      </button>
      <div className="relative overflow-hidden">
        <ul
          ref={wrapperRef}
          onClick={(e) => {
            if (state.isDragging) {
              e.preventDefault();
            }
            dispatch({ type: "click" });
          }}
          onMouseDown={(e) => {
            dispatch({ type: "mousedown" });
          }}
          onMouseMove={(e) => {
            dispatch({ type: "mousemove", x: e.clientX, y: e.clientY });
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            dispatch({ type: "mouseup" });
          }}
          className="flex"
          style={{
            transition: "ease-in-out 0.5s transform",
            willChange: "transform",
            transform: `translateX(${state.translateX}px)`,
          }}
        >
          {children}
        </ul>
        <button
          onClick={() => {
            dispatch({ type: "next-slide" });
          }}
        >
          Next
        </button>
      </div>

      <ul className="debug">
        {Object.keys(state).map((key) => {
          let value: any = state[key as keyof typeof state];
          if (typeof value == "boolean") {
            value = value ? "YES" : "NO";
          }
          return (
            <li key={key}>
              <strong>{key}</strong>: {value}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
