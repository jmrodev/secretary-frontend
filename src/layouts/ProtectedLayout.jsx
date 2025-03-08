import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import Aside from './Aside';
import '../styles/common.css';
import '../styles/layouts/protectedLayout.css';

const ProtectedLayout = () => {
  const { user, isLoading } = useSelector(state => state.auth);

  if (isLoading) {
    return <div className="page-container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="layout">
      <Header />
      <Aside/>

      <div className="main-container">
          <main>
            <Outlet />
          </main>
        
      </div>
      <Footer />
    </div>

  
  )
  

};

export default ProtectedLayout; 