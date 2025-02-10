import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { Product } from '../../models/entities.ts';
import { useAuth } from '../../hooks/useAuth.tsx';






import '../css/Productselector.css'
import ProductCard from './ProductCard.tsx';
import { getProducts } from '../../api/calls/Product.tsx';


interface Props {
    addProductsToCurrentProducts: (Products : Map<string,{product: Product, quantity: number}>) => void;
    customProductSelectionWrapperCSS?: React.CSSProperties;
    customButtonSectionStyle?: React.CSSProperties;
    customSaveButtonStyle?: React.CSSProperties;
}

const ProductSelector = React.forwardRef(({ addProductsToCurrentProducts,customProductSelectionWrapperCSS,customButtonSectionStyle,customSaveButtonStyle }: Props,ref ) => {

    const {auth}:any = useAuth();
    const[products,setProducts] = useState<Product[]>([]);

    const [selectedProducts,setSelectedProducts] = useState<Map<string,{product:Product, quantity : number}>>(new Map());
    const [selectionPrice,setSelectionPrice] = useState(0)
    

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


    const handleProductQuantityChange =(product: Product, newQuantity: number) => {
        setSelectedProducts(prev => {
            if (!prev || product.id === undefined) return prev;

            const updatedProducts = new Map(prev);
            updatedProducts.set(product.id, { product, quantity: newQuantity });

             

            return updatedProducts;
        });
    }


    const saveProductsSelection = () =>{
        // console.log(selectedProducts)
        addProductsToCurrentProducts(selectedProducts)
    }

  return (
    <>
        {products instanceof Array && products.length >= 1 &&
        <div className='product-selector-container' style={customProductSelectionWrapperCSS}>
                {/* <div className='product-selector-name'>
                    Sélection des sacs:
                </div> */}

                <div className="product-selection-list">
                
                {products ?
                        products.map((p,index)=>(
                            // <div 
                            // className={`product-list-item`} 
                            // key={index} 
                            // // onClick={()=>handleSelectedProduct(index,p)}
                            // >
                                <ProductCard key={index} product={p} initialQuantity={0} updateProductQuantity={handleProductQuantityChange} bottomVisible={false}>

                                </ProductCard>
                            // </div>
                            )
                        )
                        
                        : <p>{error}</p>
                    }
                </div>
                


                <div className='bottom-section' style={customButtonSectionStyle} >
                    <button type="button" style={customSaveButtonStyle} onClick={saveProductsSelection}>Enregistrer la sélection</button>
                </div>

            
        </div>
        }
    </>

  )
})

export default ProductSelector



