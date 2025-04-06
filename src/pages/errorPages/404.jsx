// src/components/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404</h1>
      <p style={styles.message}>Página no encontrada</p>
      <Link to="/" style={styles.link}>Volver al inicio</Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: '4rem',
    color: '#ff0000',
  },
  message: {
    fontSize: '1.5rem',
    margin: '20px 0',
  },
  link: {
    fontSize: '1.2rem',
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default NotFound;
