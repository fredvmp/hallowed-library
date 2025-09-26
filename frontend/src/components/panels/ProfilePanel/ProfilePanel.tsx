import { useEffect, useState } from "react";
import styles from "./ProfilePanel.module.css";

// Interfaz para tipar la información de usuario
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  image_url?: string;
}

export default function ProfilePanel() {
  // Estados: usuario, loading y posibles errores
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect para montar el componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Recupera el token guardado en localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró un token válido");
          setLoading(false);
          return;
        }

        // Llamada al backend con el token en headers
        const res = await fetch("http://localhost:8080/api/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("No autorizado o token inválido");
        }

        // Guardar los datos de usuario
        const data = await res.json();
        setUser(data); 
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Estados de carga y error
  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>No se pudo cargar el perfil.</p>;

  // Renderizado principal del perfil
  return (
    <div className={styles.profileContainer}>
      {/* Header con avatar + datos básicos */}
      <section className={styles.profileHeader}>
        <img
          src={
            user.image_url ||
            "https://i.pinimg.com/736x/f2/a0/e2/f2a0e2abaa5b3853f9cdfec4ec07cb8b.jpg"
          }
          alt="User avatar"
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <h2>{user.name}</h2>
          <p className={styles.userTag}>@{user.username}</p>
          <p>{user.email}</p>
          <button className={styles.editBtn}>Edit profile</button>
        </div>
      </section>

      {/* Contenido del perfil */}
      <section className={styles.profileContent}>
        <div className={styles.card}>📚 Reading Lists</div>
        <div className={styles.card}>✍️ Reviews</div>
        <div className={styles.card}>📊 Statistics</div>
      </section>
    </div>
  );
}
