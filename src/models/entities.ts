

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
    bags?: Map<string, string> | null;  // "productId" to quantity
    plannedDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null; 
}

export interface OrderEditableData{
    totalPrice : string;
    deliveryCost : string;
    status : string;
    description : string;
    plannedDate : string;
    bags: Map<string,{bag:Bag,quantity:number}>;
}


export interface Bag {
    id?: string ;
    marketingName?: string | null;
    retailPrice?: string | null;
    wholesalePrice?: string | null;
    description?: string | null;
    sku?: string | null;
    colors?: string[] | null;
  
    handles?:Map<string, string> | null;
    // handles?: { [key: string]: string } | null;
    bodies?: Map<string, string> | null;
    shoulderStraps?: Map<string, string> | null;
    figures?:Map<string, string> | null;
    liners?: Map<string, string> | null;
    screws?: Map<string, string> | null;
    others?: Map<string, string> | null;
  
    materials?: { [key: string]: string } | null;
    imageUrls?: string[] | null;
  }
  
export interface Address{
    country: string | null;
    postalCode: string | null;
    address: string | null;
}

export interface Customer{
    id?: string ;
    name?: string | null;
    mail?: string | null;
    phone?: string | null;
    tva?: string | null;
    professionalAddress?: Address | null;
    shippingAddress?: Address | null;
    type?: string | null;
    
}