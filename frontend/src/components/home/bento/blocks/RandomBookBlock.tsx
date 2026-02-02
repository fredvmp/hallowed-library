import styles from "./RandomBookBlock.module.css";
import BookImage from "/src/assets/book.png";

const RandomBookBlock = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <img src={BookImage} alt="Libro" />
      </div>
      <div className={styles.text}>
        <h3 className={styles.title}>Libro aleatorio</h3>
        <p className={styles.subtitle}>
          Descubre tu próxima lectura inesperada
        </p>
      </div>
    </div>
  );
};

export default RandomBookBlock;
