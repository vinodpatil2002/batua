import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Connection, PublicKey } from "@solana/web3.js";
import { ethers } from "ethers"; // Make sure this is correct

function Dashboard() {
    const { state } = useLocation();
    const { coin, wallet } = state || {};
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function fetchBalance() {
            if (coin === 'solana') {
                const connection = new Connection("https://solana-mainnet.quiknode.pro/YOUR_QUICKNODE_KEY/");
                let attempts = 0;
                while (attempts < 3) {
                    try {
                        const publicKey = new PublicKey(wallet.address);
                        const balance = await connection.getBalance(publicKey);
                        setBalance(balance / 1e9); // Convert lamports to SOL
                        break; // exit loop if successful
                    } catch (error) {
                        attempts += 1;
                        if (attempts >= 3) {
                            console.error("Error fetching Solana balance:", error);
                            setBalance("Error");
                        } else {
                            console.log(`Retrying... (${attempts})`);
                            await new Promise(res => setTimeout(res, 1000 * attempts)); // Exponential backoff
                        }
                    }
                }
            } else if (coin === 'ethereum') {
                const provider = new ethers.providers.JsonRpcProvider("https://holesky.infura.io/v3/bf372eb34dc84dd3ac9844a660dcabc6");
                try {
                    const balanceWei = await provider.getBalance(wallet.address);
                    setBalance(ethers.utils.formatEther(balanceWei));
                } catch (error) {
                    console.error("Error fetching Ethereum balance:", error);
                    setBalance("Error");
                }
            }
        }

        fetchBalance();
        // Placeholder data for transactions
        setTransactions([
            { id: 1, amount: "100", type: "receive", date: "2023-06-01" },
            { id: 2, amount: "50", type: "send", date: "2023-05-28" },
        ]);
    }, [coin, wallet]);

    if (!coin || !wallet) {
        return <div>No wallet data available.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">{coin.toUpperCase()} Dashboard</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-bold mb-4">Wallet Address</h2>
                <p className="mb-4 break-all">{wallet.address}</p>
                <h2 className="text-xl font-bold mb-4">Balance</h2>
                <p className="mb-4">{balance !== null ? `${balance} ${coin.toUpperCase()}` : 'Loading...'}</p>
            </div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                {transactions.map((tx) => (
                    <div key={tx.id} className="border-b py-2">
                        <p>{tx.type === 'receive' ? 'Received' : 'Sent'} {tx.amount} {coin.toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{tx.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
