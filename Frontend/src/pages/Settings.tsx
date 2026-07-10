import "../styles/Settings.css";
import Layout from "../components/Layout";

export default function Settings() {
  return (
    <Layout>
      <section className="settings-content">
        <h2>Configuración</h2>

        <div className="form-section">
          <h3>Preferencias de Cuenta</h3>
          <form>
            <label>
              Tema:
              <select>
                <option>Claro</option>
                <option>Oscuro</option>
              </select>
            </label>
            <label>
              Notificaciones:
              <select>
                <option>Activadas</option>
                <option>Desactivadas</option>
              </select>
            </label>
            <button type="submit">Guardar configuración</button>
          </form>
        </div>

        <div className="form-section">
          <h3>Cambiar Contraseña</h3>
          <form>
            <input type="password" placeholder="Contraseña actual" required />
            <input type="password" placeholder="Nueva contraseña" required />
            <input type="password" placeholder="Confirmar nueva contraseña" required />
            <button type="submit">Actualizar contraseña</button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
