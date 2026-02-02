import styles from "./CurrentsBlock.module.css";

const currents = [
  { label: "Fantasía épica", icon: "⚔️" },
  { label: "Ciencia ficción", icon: "🌊" },
  { label: "Existencialismo", icon: "🌙" },
  { label: "Literatura japonesa", icon: "🕯️" },
  { label: "Terror", icon: "🩸" },
  { label: "Realismo mágico", icon: "🍃" },
  { label: "Clásicos filosóficos", icon: "🖋️" },
  { label: "Surrealismo", icon: "🌀" },
  { label: "Distopía", icon: "🏛️" },
  { label: "Romance trágico", icon: "💔" },
  { label: "Misticismo", icon: "🔮" },
  { label: "Psicología y mente", icon: "🧠" },
];

const CurrentsBlock = () => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Explorar corrientes literarias</h3>

      <div className={styles.grid}>
        {currents.map((c) => (
          <button key={c.label} className={styles.button}>
            <span className={styles.icon}>{c.icon}</span>
            <span className={styles.label}>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CurrentsBlock;
