import React, { createContext, useState, useEffect } from 'react';

const SellerContext = createContext();

const SellerProvider = ({ children, isSellerLoggedIn }) => {

    const storedSeller = localStorage.getItem('seller');
    let initialUser;

    // Safely parse storedUser with a try...catch block
    try {
        initialUser = storedSeller ? JSON.parse(storedSeller) : {status: 'empty'};
    } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
        // Fallback to default if parsing fails
        initialUser = {status: 'empty'};
    }


    const [seller, setSeller] = useState(initialUser);

    // Update local storage whenever the `Seller` state changes
    useEffect(() => {
        if(isSellerLoggedIn) {
            console.log('Setting Seller');
            localStorage.setItem('seller', JSON.stringify(seller));
        }
    }, [seller]);

    return (
        <SellerContext.Provider value={{ seller, setSeller }}>
            {children}
        </SellerContext.Provider>
    );
};

export { SellerContext, SellerProvider };
