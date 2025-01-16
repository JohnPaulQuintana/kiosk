import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './app/kiosk/pages/Home3';
function App() {

  return (
    <>
       <BrowserRouter>
      {/* {isLoading && <Loader />}  */}
      <Routes>
          <Route path='/' element={<Home />} />
      </Routes>
      
    </BrowserRouter>
    </>
  )
}

export default App
