import { useState } from "react";
import styles from "./LoginPanel.module.css";

export default function LoginPanel() {
  // Estado para las credenciales (username/email + password)
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  // Estado para mensajes de error o éxito
  const [message, setMessage] = useState("");

  // Manejar los cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario de login
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Llamada al backend Spring Boot
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar token y usuario en localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirigir al perfil
        window.location.href = "/profile";
      } else {
        // Mostrar error enviado por el backend
        setMessage(`Error: ${data.error || "No se pudo iniciar sesión"}`);
      }
    } catch (err) {
      // Error de red o backend apagado
      setMessage("Error de conexión con el servidor");
    }
  };

  return (
    <div className={styles.loginWrap}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="identifier">Username or Email</label>
          <input
            type="text"
            id="identifier"
            placeholder="Enter your username or email"
            name="identifier"
            value={credentials.identifier}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <button type="submit">Submit</button>
          <button type="reset" className={styles.resetButton}>Reset</button>
        </fieldset>
      </form> 
    
      {/* Mensajes de error o éxito */}
      {message && <p>{message}</p>}
    </div>
  );
}
