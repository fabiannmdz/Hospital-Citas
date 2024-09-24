import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import useLoginScript from './useLoginScript'; 
import './Login.css';

const clientId = "312226628197-vuug8kd54rhent80sea8naghsj50crd4.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate(); // Hook para redirigir
  const isSignUp = useLoginScript(); // hook para manejar la animación

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(loginData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo electrónico inválido',
        text: 'Por favor, ingresa un correo electrónico válido.',
      });
      return;
    }
    try {
      const response = await login(loginData);
      console.log('Login response:', response.data); // Verifica la respuesta del servidor
      if (response.data.token && response.data.token.length > 9) {
        localStorage.setItem('token', response.data.token); // Guarda el token en el almacenamiento local
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Bienvenido de nuevo!',
        }).then(() => {
          navigate('/home'); // Redirige al usuario al dashboard o a la página principal
        });
      } else {
        console.error('Token inválido:', response.data.token);
        throw new Error('Token inválido');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: 'Por favor, verifica tus credenciales.',
      });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(registerData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo electrónico inválido',
        text: 'Por favor, ingresa un correo electrónico válido.',
      });
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5000/register', registerData, { withCredentials: true });
      console.log('Register response:', response.data); // Verificar la respuesta del servidor
      if (response.status === 200 && response.data.token && response.data.token.length > 9) {
        localStorage.setItem('token', response.data.token); // Guarda el token en el almacenamiento local
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Bienvenido!',
        }).then(() => {
          navigate('/home'); // Redirige al usuario al dashboard o a la página principal
        });
      } else {
        console.error('Token inválido:', response.data.token);
        throw new Error('Token inválido');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: 'Por favor, verifica tus datos.',
      });
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { credential } = response;
      const loginResponse = await googleLogin(credential);
      console.log('Google login response:', loginResponse.data); // Verifica la respuesta del servidor
      if (loginResponse.data.token && loginResponse.data.token.length > 9) {
        localStorage.setItem('token', loginResponse.data.token); // Guarda el token en el almacenamiento local
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Bienvenido de nuevo!',
        }).then(() => {
          navigate('/home'); // Redirige al usuario al dashboard o a la página principal
        });
      } else {
        console.error('Token inválido:', loginResponse.data.token);
        throw new Error('Token inválido');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: 'Por favor, verifica tus credenciales.',
      });
    }
  };

  const handleGoogleFailure = (error) => {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error en el inicio de sesión',
      text: 'No se pudo iniciar sesión con Google. Por favor, intenta de nuevo.',
    });
  };

  const login = async (loginData) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', loginData, { withCredentials: true });
      console.log('Login API response:', response.data); // Verifica la respuesta del servidor
      if (response.status === 200) {
        return response;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/google-login', { credential }, { withCredentials: true });
      console.log('Google login API response:', response.data); // Verifica la respuesta del servidor
      if (response.status === 200) {
        return response;
      } else {
        throw new Error('Google login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className='container-principal'>
        <h2>Bienvenido al Hospital-Citas</h2>
        <div className="container" id="container">
          <div className="form-container sign-up-container">
            <form onSubmit={handleRegisterSubmit}>
              <h1>Crear Cuenta</h1>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleFailure}
                useOneTap
              />
              <span>o usa tu correo electrónico para registrarte</span>
              <input type="text" name="name" placeholder="Nombre" onChange={handleRegisterChange} />
              <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleRegisterChange} />
              <input type="password" name="password" placeholder="Contraseña" onChange={handleRegisterChange} />
              <button type="submit">Registrarse</button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form onSubmit={handleLoginSubmit}>
              <h1>Iniciar Sesión</h1>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleFailure}
                useOneTap
              />
              <span>o usa tu cuenta</span>
              <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleLoginChange} />
              <input type="password" name="password" placeholder="Contraseña" onChange={handleLoginChange} />
              <a href="#">¿Olvidaste tu contraseña?</a>
              <button type="submit">Iniciar Sesión</button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>¡Bienvenido de Nuevo!</h1>
                <p>Para agendar tu cita, por favor inicia sesión con tu información personal</p>
                <button className="ghost" id="signIn">Iniciar Sesión</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>¡Hola, Amigo!</h1>
                <p>Ingresa tus datos personales y agenda tu cita con nosotros</p>
                <button className="ghost" id="signUp">Registrarse</button>
              </div>
            </div>
          </div>
        </div>
        <footer>
          <p>
            Creado con <i className="fa fa-heart"></i> por
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/JaredUNACH"> Jared Salazar</a>
          </p>
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;