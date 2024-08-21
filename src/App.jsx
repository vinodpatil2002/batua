import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import WalletGenerator from './pages/WalletGenerator'
import WalletDetails from './pages/WalletDetails'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
            <h1 className='flex font-roboto text-4xl pl-4 pt-2 font-bold text-center'>Batua 🛍️</h1>
      </div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/generate-wallet' element={<WalletGenerator />} />
        <Route path='/wallet-details' element={<WalletDetails />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App