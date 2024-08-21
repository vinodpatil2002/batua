import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import nacl from 'tweetnacl';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import { HDKey } from "@scure/bip32";
import { secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';
import { Buffer } from 'buffer';
import { MdContentCopy } from "react-icons/md";
import { CiWallet } from "react-icons/ci";
function WalletGenerator({ onGenerateWallet }) {
    const [mnemonics, setMnemonics] = useState("");
    const [wallets, setWallets] = useState({});
    const navigate = useNavigate();

    const handleGenerateMnemonics = () => {
        const mnemonic = generateMnemonic();
        setMnemonics(mnemonic);

        const seed = mnemonicToSeedSync(mnemonic);
        const paths = {
            solana: "m/44'/501'/0'/0'",
            ethereum: "m/44'/60'/0'/0/0",
        };

        const generatedWallets = {};

        Object.entries(paths).forEach(([coin, path]) => {
            try {
                if (coin === 'solana') {
                    const derivedSeed = derivePath(path, seed.toString('hex')).key;
                    const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);
                    const publicKey = Keypair.fromSecretKey(keypair.secretKey).publicKey.toBase58();
                    generatedWallets[coin] = {
                        address: publicKey,
                        secret: Buffer.from(keypair.secretKey).toString('hex'),
                    };
                } else if (coin === 'ethereum') {
                    const hdkey = HDKey.fromMasterSeed(seed);
                    const derived = hdkey.derive(path);
                    const privateKey = derived.privateKey;
                    if (!privateKey) throw new Error("Failed to derive private key");
                    
                    const publicKey = secp256k1.getPublicKey(privateKey, false).slice(1);
                    const address = keccak_256(publicKey).slice(-20);
                    
                    generatedWallets[coin] = {
                        address: `0x${Buffer.from(address).toString('hex')}`,
                        secret: Buffer.from(privateKey).toString('hex'),
                    };
                }
            } catch (error) {
                generatedWallets[coin] = { error: `Error generating ${coin} keypair: ${error.message}` };
            }
        });

        setWallets(generatedWallets);

        if (onGenerateWallet) {
            onGenerateWallet({ mnemonic, wallets: generatedWallets });
        }
    };
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(mnemonics);
        alert("Mnemonics copied to clipboard!");
    };

    const handleViewWallet = () => {
        navigate("/wallet-details", { state: { wallets } });
    };

    return (
        <div
            className="
                flex
                flex-col
                items-center
                justify-center
                h-screen
            "
        >
            <button
                className="
                    bg-[#1C1816]
                    hover:bg-[#2d2a28e9]
                    text-white 
                    font-bold 
                    py-2 
                    px-4 
                    rounded-full 
                    focus:outline-none 
                    focus:shadow-outline
                    hover:text-white 
                    font-roboto 
                    text-xl 
                    mt-4
                    flex
                    gap-2
                    items-center
                "
                onClick={handleGenerateMnemonics}
            >
                Generate Mnemonics
            </button>

            {mnemonics && (
                <div className="mt-4 text-white flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">Mnemonics:</h2>
                    <div
                        className="
                            grid 
                            grid-cols-3 
                            gap-4 
                            border-2
                            border-[#1C1816]
                            p-4 
                            rounded-lg
                        "
                    >
                        {mnemonics.split(" ").map((word, index) => (
                            <div
                                key={index}
                                className="bg-[#1C1816] text-white p-2 rounded-md text-center"
                            >
                                {word}
                            </div>
                        ))}
                    </div>
                    <button
                        className="
                            bg-[#1C1816]
                            hover:bg-[#2d2a28e9]
                            text-white 
                            font-bold 
                            py-2 
                            px-4 
                            rounded-full 
                            focus:outline-none 
                            focus:shadow-outline
                            hover:text-white 
                            font-roboto 
                            text-xl 
                            mt-4
                            flex
                            items-center   
                            justify-center
                            gap-2
                            w-full
                        "
                        onClick={handleCopyToClipboard}
                    >
                        Copy Phrase <MdContentCopy />
                    </button>
                    <button
                        className="
                            bg-[#1C1816]
                            hover:bg-[#2d2a28e9]
                            text-white 
                            font-bold 
                            py-2 
                            px-4 
                            rounded-full 
                            focus:outline-none 
                            focus:shadow-outline
                            hover:text-white 
                            font-roboto 
                            text-xl 
                            mt-4
                            items-center
                            justify-center
                            gap-2
                            flex
                            w-full
                        "
                        onClick={handleViewWallet}
                    >
                        View Wallet <CiWallet />
                    </button>
                </div>
            )}
        </div>
    );
}

export default WalletGenerator;
