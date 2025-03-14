import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { logoutAsync } from '../redux/slices/authSlice';
import showToast from "../utils/toastUtils";
import '../styles/layouts/header.css';

const Header = () => {
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync());
      showToast("Sesión cerrada exitosamente", "success");
    } catch (error) {
      showToast("Error al cerrar sesión", "error");
    }
  };

  return (
    <header className="header">
      <nav className="navbar container">
        <Link to="/" className="nav-brand">
          <span className="text-gradient">Sistema de Citas</span>
        </Link>
        <div className="nav-content">
          {isAuthenticated && (
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">{userRole}</span>
            </div>
          )}

          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Inicio</Link>
            </li>
            {isAuthenticated && (
              <>

                <li>
                  <button 
                    className="button button-outline logout-btn"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <li>
                <Link to="/login" className="button button-primary login-btn">
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
