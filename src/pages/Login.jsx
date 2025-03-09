import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAsync, clearError } from '../redux/slices/authSlice';
import ErrorMessage from '../components/common/ErrorMessage';
import showToast from '../utils/toastUtils';
import '../styles/pages/login.css';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    setMessage(`UserName: ${userName}, UserId: ${userId}, UserRole: ${userRole}, UserEmail: ${userEmail}`);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.password) {
      showToast('Por favor complete todos los campos', 'error');
      return;
    }

    try {
      const resultAction = await dispatch(loginAsync(formData));
      if (loginAsync.fulfilled.match(resultAction)) {
        const { token, user } = resultAction.payload; // Assuming your payload structure matches this
        localStorage.setItem('authToken', token);
        localStorage.setItem('userName', user.userName);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', user.email);
        showToast('Inicio de sesión exitoso', 'success');
        navigate('/dashboard');

      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => dispatch(clearError())}
          />
        )}

        <div className="form-group">
          <label htmlFor="userName">Usuario:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        <div className="message">{message}</div>
      </form>
    </div>
  );
};

