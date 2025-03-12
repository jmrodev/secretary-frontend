
import React from 'react';
import { FaCalendarAlt, FaUserMd, FaUsers, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/components/common/menu.css';


const Menu = () => {
    return (

        <div className="menu">
            <div className="aside-header">
                <h3>Menú</h3>
            </div>
            <nav className="menu-nav">
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
        </div>
    );
}

export default Menu;