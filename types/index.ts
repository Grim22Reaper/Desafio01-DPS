export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    
}

export interface CartItem extends Product {
    quantity: number;
}

export interface User {
    email: string;
    name: string;
    password?: string;
}