export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`La contraseña debe tener al menos ${minLength} caracteres`);
  }
  if (!hasUpperCase) {
    errors.push('La contraseña debe contener al menos una mayúscula');
  }
  if (!hasLowerCase) {
    errors.push('La contraseña debe contener al menos una minúscula');
  }
  if (!hasNumbers) {
    errors.push('La contraseña debe contener al menos un número');
  }
  if (!hasSpecialChar) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateTimeSlot = (timeSlot) => {
  const errors = {};

  if (!timeSlot.time) {
    errors.time = 'La hora es requerida';
  }

  if (timeSlot.available === undefined) {
    errors.available = 'La disponibilidad es requerida';
  }

  return errors;
};

