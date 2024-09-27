import React from 'react';
import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './components/LandingPage';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  }
])
const App = () => {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
};

export default App;
