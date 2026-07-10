import "../styles/Profile.css";
import Layout from "../components/Layout";

export default function Profile() {
  return (
    <Layout>
      <section className="profile-content">
        <h2>Perfil de Usuario</h2>

        <div className="profile-card">
          <img
            src="https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff&size=100"
            alt="Avatar"
            className="profile-avatar"
          />
          <h3>Juan Pérez</h3>
          <p><strong>Rol:</strong> Estudiante</p>
          <p><strong>Email:</strong> juanperez@example.com</p>
        </div>

        <div className="form-section">
          <h3>Editar Perfil</h3>
          <form>
            <input type="text" placeholder="Nombre completo" defaultValue="Juan Pérez" />
            <input type="email" placeholder="Correo electrónico" defaultValue="juanperez@example.com" />
            <button type="submit">Guardar cambios</button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
