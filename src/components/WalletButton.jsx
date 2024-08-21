import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function WalletButton() {
    return (
        <Link to="/generate-wallet">
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
            >
                Generate Wallet <FaArrowRight />
            </button>
        </Link>
    );
}

export default WalletButton;
