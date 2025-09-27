// src/components/BottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';
import { FaHome, FaDollarSign, FaBullhorn, FaUser } from 'react-icons/fa';

const BottomNav = () => {
  return (
    <nav className={styles.nav}>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
        end // 'end' prop ensures this only matches exactly "/"
      >
        <FaHome size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink 
        to="/earning" 
        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
      >
        <FaDollarSign size={24} />
        <span>Earning</span>
      </NavLink>
      <NavLink 
        to="/advertise" 
        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
      >
        <FaBullhorn size={24} />
        <span>Advertise</span>
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
      >
        <FaUser size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;

