import React from 'react'
import "./assets/scss/theme.scss";
import { RouterProvider } from 'react-router-dom';import router from './routes';
import "./index.css"
const App = () => {
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App

