import React from 'react';
import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SetupRoom from './components/auth/Setup-Room';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Dashboard from './components/admin/Dashboard';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/setup-room",
    element: <SetupRoom />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/admin/dashboard",
    element: <Dashboard />
  },
  
])
const App = () => {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
};

export default App;
