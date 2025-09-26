import { useEffect, useRef } from "react";
import styles from "./Rain.module.css";

export const Rain = () => {
  const rainCount = 15;
  const animationTiming = 7;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    for (let index = 0; index < rainCount; index++) {
      const i = document.createElement("i");

      const sizeX = Math.random() * 6;
      const sizeY = Math.random() * 300;
      const delay = Math.random() * 20;
      const posX = Math.floor(Math.random() * window.innerWidth);

      i.classList.add(styles.rain);
      i.style.width = 0.6 + sizeX + "px";
      i.style.height = 0.2 + sizeY + "px";
      i.style.left = posX + "px";
      i.style.animationDelay = delay + "s";
      const duration = 4 + Math.random() * 6;
      i.style.animationDuration = duration + "s";

      containerRef.current.appendChild(i);
    }
  }, [rainCount, animationTiming]);

  return <div ref={containerRef} className={styles.rainContainer}></div>;
};
