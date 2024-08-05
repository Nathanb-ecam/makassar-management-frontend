

export interface loginRequest{
    token: string | null;
}


export interface User {
    id: number;
    username: string | null;
    mail: string | null;
    phone: string | null;
}


export interface Order {
    id: string;
    customerId?: string | null;
    status?: string | null;
    description?: string | null;
    comments?: string | null;
    totalPrice?: string | null;
    deliveryCost?: string | null;
    discount?: string | null;
    bags?: Record<string, string> | null;  // "productId" to quantity
    plannedDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null; 
}

export interface Bag {
    id?: string ;
    marketingName?: string | null;
    retailPrice?: string | null;
    description?: string | null;
    sku?: string | null;
    colors?: string[] | null;
  
    handles?: { [key: string]: string } | null;
    bodies?: { [key: string]: string } | null;
    shoulderStraps?: { [key: string]: string } | null;
    figures?: { [key: string]: string } | null;
    liners?: { [key: string]: string } | null;
    screws?: { [key: string]: string } | null;
    others?: { [key: string]: string } | null;
  
    materials?: { [key: string]: string } | null;
    imageUrls?: string[] | null;
  }
  
export interface Customer{
    id?: string ;
    name?: string | null;
    mail?: string | null;
    phone?: string | null;
    shippingCountry?: string | null;
    shippingPostalCode?: string | null;
    shippingAddress?: string | null;
    type?: string | null;
    
}