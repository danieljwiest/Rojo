import { useRef } from "react";

export const RenderCount = () => {
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;
  return <h1>{renderCount.current}</h1>;
};
