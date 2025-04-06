import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { Product } from '../../models/entities';
import { getProducts } from '../../api/calls/Product';
import { useAuth } from '../../hooks/useAuth';


import { FaList } from "react-icons/fa";
import { RiGalleryView2 } from "react-icons/ri";



import '../css/Productselector.css'
import ProductCard from './ProductCard.tsx';


interface Props {
    addProductsToCurrentProducts: (products : Map<string,{product: Product, quantity: number}>) => void;
    customProductSelectionWrapperCSS?: React.CSSProperties;
    customButtonSectionStyle?: React.CSSProperties;
    customSaveButtonStyle?: React.CSSProperties;
}

const ProductSelector = React.forwardRef(({ addProductsToCurrentProducts,customProductSelectionWrapperCSS,customButtonSectionStyle,customSaveButtonStyle }: Props,ref ) => {

    const {auth}:any = useAuth();
    const[products,setProducts] = useState<Product[]>([]);

    const [selectedProducts,setSelectedProducts] = useState<Map<string,{product:Product, quantity : number}>>(new Map());
    const [selectionPrice,setSelectionPrice] = useState(0)
    
    const [displayMode, setDisplayMode] = useState("list");
    const [error,setError] = useState('');


    useImperativeHandle(ref,()=>({
        getSelectionPrice(){
            return selectionPrice
        }
        
    }))


    useEffect(()=>{
        const fetchProducts = async()=> {
            const {products,err} = await getProducts(auth);
        
            if(err === undefined) setProducts(products)
            else setError(err)

            if(products?.length == 0) return;
        }

        fetchProducts()
    },[])

    useEffect(()=>{

        var totalPrice = 0
        selectedProducts.forEach(({product,quantity})=>{
            totalPrice += (Number(product.retailPrice) * quantity)
        })
        setSelectionPrice(totalPrice)

    },[selectedProducts])

    const getSelectionPrice = () => {
        return selectionPrice
    }


    const handleProductQuantityChange =(product: Product, quantity: number) => {
        setSelectedProducts(prev => {
            if (!prev || product.id === undefined) return prev;

            const updatedProducts = new Map(prev);
            updatedProducts.set(product.id, { product, quantity });

             

            return updatedProducts;
        });
    }


    const saveProductsSelection = () =>{
        // console.log(selectedProducts)
        addProductsToCurrentProducts(selectedProducts)
    }

    return (
    <>
        <div className='product-selector-wrapper'>
            {products instanceof Array && products.length >= 1 &&
            <div className='product-selector-component' style={customProductSelectionWrapperCSS}>
                    {/* <div className='product-selector-name'>
                        Sélection des sacs:
                    </div> */}

                    <div className='display-mode-selector'>
                        
                        <div onClick={()=>setDisplayMode("list")} className={`list-icon ${displayMode === "list" ? 'selected':''}`}><FaList /></div>
                        <div onClick={()=>setDisplayMode("gallery")} className={`gallery-icon ${displayMode === "gallery" ? 'selected':''}`}><RiGalleryView2 /></div>
                    </div>
                    <div className="product-selection-list">
                    
                        {displayMode==="gallery" && products ?
                                <div className='gallery'>
                                    {
                                    products.map((product,index)=>(
                                            <ProductCard 
                                                key={index} 
                                                product={product} 
                                                initialQuantity={selectedProducts.get(product.id!!)?.quantity ?? 0} 
                                                updateProductQuantity={handleProductQuantityChange} 
                                                bottomVisible={false}>
    
                                            </ProductCard>                                    
                                        )
                                    )
                                    }
                                </div>
                                
                                : <p>{error}</p>
                        }

                        {displayMode==="list" && products && products.length > 0 ?
                            <ul className='product-list'>
                                <li className='product-list-items-title product-list-item'>
                                    <label htmlFor="">Product</label>
                                    <label htmlFor="">SKU</label>
                                    <input value="Quantity" disabled/>                                
                                </li>
                                {products.map((product,index)=>(
                                    <li key={index} className='product-list-item'>
                                        <label htmlFor="">{product.marketingName} ({product.retailPrice}€)</label>
                                        <label htmlFor="">{product?.sku?.length===0 ?  "/" : product.sku}</label>
                                        <input type="text" placeholder={`${selectedProducts.get(product.id!!)?.quantity.toString() ?? '0'}`} onBlur={(e)=>handleProductQuantityChange(product,parseInt(e.target.value,10))}/>
                                    </li>
                                ))}
                            </ul>
                            
                            : <p>{error}</p>

                        }


                    </div>
                    


                    <div className='bottom-section' style={customButtonSectionStyle} >
                        <button type="button" style={customSaveButtonStyle} onClick={saveProductsSelection}>Save selection</button>
                    </div>

                
            </div>
            }
        </div>
    </>

  )
})

export default ProductSelector



