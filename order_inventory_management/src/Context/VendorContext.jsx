import React, { createContext, useState, useEffect } from 'react';

const VendorContext = createContext();

const VendorProvider = ({ children, isVendorLoggedIn }) => {

    const storedvendor = localStorage.getItem('vendor');
    let initialUser;

    // Safely parse storedUser with a try...catch block
    try {
        initialUser = storedvendor ? JSON.parse(storedvendor) : {status: 'empty'};
    } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
        // Fallback to default if parsing fails
        initialUser = {status: 'empty'};
    }


    const [vendor, setVendor] = useState(initialUser);

    // Update local storage whenever the `vendor` state changes
    useEffect(() => {
        if(isVendorLoggedIn) {
            console.log('Setting vendor');
            localStorage.setItem('vendor', JSON.stringify(vendor));
        }
    }, [vendor]);

    return (
        <VendorContext.Provider value={{ vendor, setVendor }}>
            {children}
        </VendorContext.Provider>
    );
};

export { VendorContext, VendorProvider };
