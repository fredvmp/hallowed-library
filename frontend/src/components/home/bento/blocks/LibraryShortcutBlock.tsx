import styles from "./LibraryShortcutBlock.module.css";

const LibraryShortcutBlock = () => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>📚 Biblioteca personal 📚</h3>
      <p className={styles.subtitle}>
        Accede directamente a tus libros guardados
      </p>
    </div>
  );
};

export default LibraryShortcutBlock;
