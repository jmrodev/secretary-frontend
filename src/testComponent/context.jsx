import React from 'react';
import { useNotification } from '../context/NotificationContext';

const SomeComponent = () => {
  const { showNotification } = useNotification();

  const handleClick = () => {
    showNotification('This is an info notification!', 'info');
  };

  return (
    <div>
      <button onClick={handleClick}>Show Notification</button>
    </div>
  );
};

export default SomeComponent;