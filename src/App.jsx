import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './app/kiosk/pages/HomePage';
import NavigationPage from './app/kiosk/pages/NavigationPage';
import AdminPage from './app/kiosk/pages/AdminPage';
function App() {

  return (
    <>
       <BrowserRouter>
      {/* {isLoading && <Loader />}  */}
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/navigation' element={<NavigationPage />} />
          {/* admin side */}
          <Route path='/admin' element={<AdminPage />} />
      </Routes>
      
    </BrowserRouter>
    </>
  )
}

export default App
