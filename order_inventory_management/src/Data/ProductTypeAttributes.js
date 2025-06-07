const productCategories = {
    Electronics: {
        productTypes: {
            SmartPhone: {
                attributes: [
                    { name: 'Ram', type: 'number', required: true},
                    { name: 'Processor', type: 'string', required: true},
                    { name: 'Storage', type: 'number', required: true},
                    { name: 'Color', type: 'string', required: true}
                ]
            },
            Laptop: {
                attributes: [
                    { name: 'Ram', type: 'number', required: true},
                    { name: 'Processor', type: 'string', required: true},
                    { name: 'SSD Capacity', type: 'number', required: true},
                    { name: 'Color', type: 'string', required: true}
                ]
            },
            Tablet: {
                attributes: [
                    { name: 'ScreenSize', type: 'number', required: true}, // Screen size in inches
                    { name: 'BatteryCapacity', type: 'number', required: true}, // Battery capacity in mAh
                    { name: 'OperatingSystem', type: 'string', required: true}
                ]
            },
            Television: {
                attributes: [
                    { name: 'ScreenType', type: 'string', required: true}, // e.g., LED, OLED
                    { name: 'ScreenSize', type: 'number', required: true}, // Size in inches
                    { name: 'Resolution', type: 'string', required: true}, // e.g., 4K, 1080p
                    { name: 'SmartTV', type: 'boolean', required: true} // Whether it's a Smart TV
                ]
            }
        },
        imageUrl: "electronics.jpg"
    },
    HomeAppliances: {
        productTypes: {
            Bulb: {
                attributes: [
                    { name: 'Voltage', type: 'number', required: true},
                    { name: 'Lifetime', type: 'number', required: true}, // Lifetime in hours
                    { name: 'Color', type: 'string', required: true}
                ]
            },
            WashingMachine: {
                attributes: [
                    { name: "Capacity", type: "number", required: true }, // Capacity in kg
                    { name: "PowerConsumption", type: "number", required: true }, // Power consumption in watts
                    { name: "Type", type: "string", required: true} // e.g., Front Load, Top Load
                ]
            },
            Refrigerator: {
                attributes: [
                    { name: "Capacity", type: "number", required: true }, // Capacity in liters
                    { name: "Freezer", type: "boolean", required: true }, // Whether it has a freezer compartment
                    { name: "EnergyRating", type: "number", required: true} // Energy rating in stars
                ]
            },
            AirConditioner: {
                attributes: [
                    { name: "CoolingCapacity", type: "number", required: true }, // Capacity in tons
                    { name: "EnergyEfficiency", type: "number", required: true}, // EER rating
                    { name: "Type", type: "string", required: true } // e.g., Split, Window
                ]
            }
        },
        imageUrl: "home_appliences.jpg"
    },
    Fashion: {
        productTypes: {
            Shirt: {
                attributes: [
                    { name: 'Size', type: 'string', required: true }, // e.g., Small, Medium, Large
                    { name: 'Material', type: 'string', required: true }, // e.g., Cotton, Polyester
                    { name: 'Color', type: 'string', required: true }
                ]
            },
            Shoes: {
                attributes: [
                    { name: 'Size', type: 'number', required: true }, // Shoe size
                    { name: 'Material', type: 'string', required: true }, // e.g., Leather, Synthetic
                    { name: 'Type', type: 'string', required: true } // e.g., Sports, Formal
                ]
            },
            Jeans: {
                attributes: [
                    { name: 'Size', type: 'string', required: true }, // e.g., 30, 32, 34
                    { name: 'Fit', type: 'string', required: true }, // e.g., Slim, Regular, Relaxed
                    { name: 'Color', type: 'string', required: true }
                ]
            },
            Jacket: {
                attributes: [
                    { name: 'Size', type: 'string', required: true }, // e.g., Small, Medium, Large
                    { name: 'Material', type: 'string', required: true }, // e.g., Leather, Wool
                    { name: 'Waterproof', type: 'boolean', required: true }
                ]
            }
        },
        imageUrl: "fashion.jpg"
    },
    Groceries: {
        productTypes: {
            Rice: {
                attributes: [
                    { name: 'Weight', type: 'number', required: true }, // Weight in kg
                    { name: 'Type', type: 'string', required: true }, // e.g., Basmati, Sona Masoori
                    { name: 'Organic', type: 'boolean', required: true } // Whether it's organic
                ]
            },
            Milk: {
                attributes: [
                    { name: 'Volume', type: 'number', required: true }, // Volume in liters
                    { name: 'FatContent', type: 'string', required: true }, // e.g., Full Cream, Skimmed
                    { name: 'ExpiryDate', type: 'string', required: true } // Expiry date in YYYY-MM-DD
                ]
            },
            Spices: {
                attributes: [
                    { name: 'Weight', type: 'number', required: true }, // Weight in grams
                    { name: 'Type', type: 'string', required: true }, // e.g., Turmeric, Cumin
                    { name: 'Organic', type: 'boolean', required: true }
                ]
            }
        },
        imageUrl: "groceries.jpeg"
    },
};


export default productCategories;