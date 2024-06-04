// import { useEffect, useRef, useState } from "react";
import "./titlePop.scss";

type TitlePopProps = {
  title: string;
  className: string;
};

function TitlePop({ title, className }: TitlePopProps) {
  // const [position, setPosition] = useState({
  //   x: 0,
  //   y: 0,
  // });
  // const titleRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     setPosition({
  //       x: e.clientX,
  //       y: e.clientY,
  //     });
  //   };
  //   window.addEventListener("mousemove", handleMouseMove);

  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, []);

  // const style: React.CSSProperties = {
  //   top: `${position.y}px`,
  //   left: `${position.x}px`,
  // };

  return (
    <>
      <div className={className + " " + "title-pop-container"}>
        <p>{title}</p>
      </div>
    </>
  );
}

export default TitlePop;
