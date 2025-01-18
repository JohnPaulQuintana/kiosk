import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './app/kiosk/pages/HomePage';
import NavigationPage from './app/kiosk/pages/NavigationPage';
function App() {

  return (
    <>
       <BrowserRouter>
      {/* {isLoading && <Loader />}  */}
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/navigation' element={<NavigationPage />} />
      </Routes>
      
    </BrowserRouter>
    </>
  )
}

export default App
