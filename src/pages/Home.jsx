import React from 'react'
import WalletButton from '../components/WalletButton'
function Home() {
  return (
    <div>
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className='font-roboto text-3xl font-semibold text-center'>One Stop for creating multiple wallets</h2>
            <WalletButton />
        </div>
    </div>
  )
}

export default Home