import { useState } from "react";
import styles from "./SignUpPanel.module.css";

export default function SignUpPanel() {

  // Manejar los datos del formulario
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConf: "",
  });

  // Para mostrar mensajes de éxito o error
  const [message, setMessage] = useState("");

  // Actualizar el estado cada vez que el usuario escribe en un input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación básica de contraseñas antes de enviar al backend
    if (user.password !== user.passwordConf) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      // Petición al backend
      const res = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        // Usuario creado con éxito
        setMessage("Usuario creado con éxito!");
        setUser({
          name: "",
          username: "",
          email: "",
          password: "",
          passwordConf: "",
        });
      } else {
        // Error enviado por el backend
        setMessage(`Error: ${data.error || "No se pudo crear el usuario"}`);
      }
    } catch (err) {
      // Error de red o servidor apagado
      setMessage("Error de conexión con el servidor");
    }
  };

  return (
    <div className={styles.signUpWrap}>
      <h2>Sign up!</h2>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Enter your email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="password1">Password</label>
          <input
            type="password"
            id="password1"
            placeholder="Enter your password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            placeholder="Confirm your password"
            name="passwordConf"
            value={user.passwordConf}
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
