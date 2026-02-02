import styles from "./QuoteBlock.module.css";

const QuoteBlock = () => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.quote}>
        “Si solo lees los libros que lee todo el mundo, solo puedes pensar lo
        que piensa todo el mundo.”
      </p>
      <span className={styles.author}>- Haruki Murakami</span>
    </div>
  );
};

export default QuoteBlock;
