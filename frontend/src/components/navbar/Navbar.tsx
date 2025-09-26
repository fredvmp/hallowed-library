import React, { useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import logo from "../../images/hallowed_logo.png";

const LINKS = [
  { label: "Home", path: "/" },
  { label: "Login", path: "/login" },
  { label: "Pruebas BBDD", path: "/pruebas" },
  { label: "Profile", path: "/profile" },
];

function Navbar() {
  const ulRef = useRef<HTMLUListElement | null>(null);

  const [hlStyle, setHlStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
    transition: string;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
    transition: "opacity 0.15s ease",
  });

  const handleMouseEnterItem = (e: React.MouseEvent<HTMLLIElement>) => {
    const li = e.currentTarget;
    const ul = ulRef.current;
    if (!ul) return;

    const liRect = li.getBoundingClientRect();
    const ulRect = ul.getBoundingClientRect();

    const left = liRect.left - ulRect.left;
    const width = liRect.width;

    setHlStyle({
      left,
      width,
      opacity: 1,
      transition: "none",
    });

    requestAnimationFrame(() => {
      setHlStyle((prev) => ({
        ...prev,
        transition:
          "left 260ms cubic-bezier(.2,.9,.2,1), width 260ms cubic-bezier(.2,.9,.2,1), opacity 150ms linear",
      }));
    });
  };

  const handleMouseLeaveList = () => {
    setHlStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <nav className={styles.navbarWindow}>
      {/* container nav */}
      <div className={styles.navbarContainer}>
        {/* logo and app's name */}
        <div className={styles.navbarLeft}>
          <a href="/" className={styles.navbarLogo}>
            <img src={logo} alt="Logo" className={styles.logoImg} />
          </a>
        </div>

        {/* links space */}
        <div className={styles.navbarRight}>
          <ul
            className={styles.navbarLinks}
            ref={ulRef}
            onMouseLeave={handleMouseLeaveList}
          >
            {LINKS.map(({ label, path }) => (
              <li key={label} onMouseEnter={handleMouseEnterItem}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : undefined
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}

            {/* highlight */}
            <span
              className={styles.highlight}
              style={{
                left: `${hlStyle.left}px`,
                width: `${hlStyle.width}px`,
                opacity: hlStyle.opacity,
                transition: hlStyle.transition,
              }}
              aria-hidden
            />
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
