import React from "react";
import "../styles/components/common/aside.css";
import { FaCalendarAlt, FaUserMd, FaUsers, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";
import Calendar from '../components/Calendar';
 const  Aside = () => {
  return (
    <aside className="aside">
      <div className="aside-header">
        <h3>Menú</h3>
      </div>
      <nav className="aside-menu">
        <ul>
          <li>
            <Link to="/appointments">
              <FaCalendarAlt />
              Citas
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <FaUserMd />
              Perfil
            </Link>
          </li>
          <li>
            <Link to="/doctors">
              <FaUserMd />
              Doctores
            </Link>
          </li>
          <li>
            <Link to="/patients">
              <FaUsers />
              Pacientes
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <FaCog />
              Configuración
            </Link>
          </li>
        </ul>
      </nav>
      <Calendar />
      

    </aside>
  );
};

export default Aside;
