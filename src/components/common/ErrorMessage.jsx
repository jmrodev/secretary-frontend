import React from 'react';
import PropTypes from 'prop-types';
import { FaExclamationCircle, FaTimes } from 'react-icons/fa';
import '../../styles/components/common/errorMessage.css';

const ErrorMessage = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="error-container">
      <div className="error-icon">
        <FaExclamationCircle />
      </div>
      <div className="error-content">
        <h4 className="error-title">Error</h4>
        <p className="error-message">{message}</p>
        <div className="error-actions">
          {onRetry && (
            <button className="retry-button" onClick={onRetry}>
              Reintentar
            </button>
          )}
          {onDismiss && (
            <button className="dismiss-button" onClick={onDismiss}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  onDismiss: PropTypes.func,
};

export default ErrorMessage;
