import React from "react";

export const getResourceUrl = (resource: string): string =>
  process.env.NODE_ENV === "production"
    ? resource
    : `http://localhost:5000${resource}`;

export const useViewport = (): { width: number; height: number } => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);

  React.useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { width, height };
};
