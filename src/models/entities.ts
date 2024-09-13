

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
    orderNumber?: string | null;
    createdLocation?: string | null;
    status?: string | null;
    description?: string | null;
    comments?: string | null;
    price: Price | null;
    bags?: Map<string, string> | null;  // "productId" to quantity
    // plannedDate?: {best:string,worst:string} | null;
    plannedDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null; 
}

export interface Price{
    finalPrice: string | undefined | null;
    alreadyPaid: string | undefined | null;
    deliveryCost: string | undefined | null;
    discount: string | undefined | null;
}

export interface BagWithQuantity{
    bag: Bag;
    quantity: number;
}


export interface OrderFullyDetailed{
    id: string | null;
    customer: Customer;
    orderNumber: string | null;
    createdLocation: string | null;
    status: string | null;
    description: string | null;
    comments: string | null;
    price: Price | null;
    // bags: Map<Bag,String> | null;
    bags: Map<string,BagWithQuantity> | null;
    plannedDate: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}



export interface OrderDto{
    customerId?: string | null;
    orderNumber?: string | null;
    createdLocation?: string | null;
    status?: string | null;
    description?: string | null;
    comments?: string | null;
    price: Price | null;
    bags?: Map<string, string> | null;  // "productId" to quantity
    // plannedDate?: {best:string,worst:string} | null;
    plannedDate?: string | null;
    
}

export interface OrderOverview{
    id: string | null;
    customerName: string | null;
    orderNumber: string | null;
    status :  string | null,
    price: Price | null,
    // plannedDate: PlannedDate | null,
    plannedDate: string | null,
    createdAt: string | null,
    updatedAt: string | null,
}



export interface OrderEditableData{
    price: Price | null | undefined;
    createdLocation: string | null;
    comments: string | null;
    status : string | null;
    description : string | null;
    // plannedDate : {best:string,worst:string} | null;
    plannedDate?: string | null;
    bags: Map<string,BagWithQuantity> | null;
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
    professionalAddress?: string | null;
    shippingAddress?: string | null;
    // professionalAddress?: Address | null;
    // shippingAddress?: Address | null;
    type?: string | null;
    
}

export interface PlannedDate{
    worst:string | null;
    best:string | null;
}