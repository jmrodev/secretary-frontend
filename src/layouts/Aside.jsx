import React from "react";
import Menu from "./Menu";
import "../styles/components/common/aside.css";
import Calendar from '../components/Calendar';
import Navbar from './Navbar';
const Aside = () => {
  return (
    <aside className="aside">
      <Navbar />
      <Calendar />


    </aside>
  );
};

export default Aside;
