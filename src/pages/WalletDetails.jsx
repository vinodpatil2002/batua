import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function WalletDetails() {
    const { state } = useLocation();
    const { wallets } = state || {};
    const navigate = useNavigate();

    const [visibility, setVisibility] = useState({
        solana: { address: false, secret: false },
        ethereum: { address: false, secret: false },
    });

    const toggleVisibility = (coin, key) => {
        setVisibility(prev => ({
            ...prev,
            [coin]: {
                ...prev[coin],
                [key]: !prev[coin][key]
            }
        }));
    };

    const handleCardClick = (coin, wallet) => {
        navigate('/dashboard', { state: { coin, wallet } });
    };

    if (!wallets || Object.keys(wallets).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-4">
                <h1 className="text-3xl font-bold mb-8">Wallet Details</h1>
                <p className="text-xl text-gray-600">No wallet data available.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <h1 className="text-3xl font-bold mb-8">Wallet Details</h1>
            {Object.entries(wallets).map(([coin, wallet]) => (
                <div 
                    key={coin} 
                    className="p-6 rounded-lg shadow-lg mb-6 w-full max-w-md cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => handleCardClick(coin, wallet)}
                >
                    <h2 className="text-2xl font-bold mb-4">{coin.toUpperCase()} Wallet</h2>
                    <div className="mb-4">
                        <p className="font-bold">Public Address:</p>
                        <p className="mt-2 overflow-hidden break-words text-sm">
                            {wallet.address || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="font-bold">Private Key:</p>
                        <p 
                            className={`${!visibility[coin].secret ? 'blur-sm' : ''} mt-2 overflow-hidden break-words text-sm`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleVisibility(coin, 'secret');
                            }}
                        >
                            {wallet.secret || 'N/A'}
                        </p>
                        {!visibility[coin].secret && (
                            <p className="text-sm text-gray-400">Click to reveal</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default WalletDetails;