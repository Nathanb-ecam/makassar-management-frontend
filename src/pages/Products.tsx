import React, { useEffect, useState } from 'react'

import SectionTitle from '../components/main/SectionTitle.tsx'

import './css/products.css'
import Popup from '../components/main/Popup.tsx';
import { Product } from '../models/entities.ts';

import ProductForm from '../components/products/ProductForm.tsx';
import { createProductWithImages, deleteProduct, getProducts, putProduct } from '../api/calls/Product.tsx';
import { useAuth } from '../hooks/useAuth.tsx';

import { BASE_IMAGES_URL } from '../../constants.tsx';

import { IoMdClose } from 'react-icons/io';

import { useTopMessage } from '../hooks/useTopMessagePopup.tsx';
import { BsHandbag } from 'react-icons/bs';
import ProductModifier from '../components/products/ProductModifier.tsx';

const Products = () => {


  const {auth}:any = useAuth();
  const {showTopMessage}:any = useTopMessage();

  const[Products,setProducts] = useState<Product[]>([]);
  
  const[modifiedProducts, setModifiedProducts] = useState<Map<string,Product>>(new Map());
  
  const [createProductPopupVisible,setCreateProductPopupVisible] = useState(false);
  
  const[currentProductToModify, setCurrentProductToModify] = useState<Product | undefined>(undefined);
  const [ProductModifierVisible,setProductModifierVisible] = useState(false);
  

  const handleCreateButtonClicked = () => {
    setCreateProductPopupVisible(true)
  }

  const onCreateProductPopupClosed = ()=>{
    setCreateProductPopupVisible(false)
  }


  const onProductFormSubmit = async (formData: FormData)=>{
      const createdProduct = await createProductWithImages(auth,formData)
      // console.log("createdProduct",createdProduct)
      setCreateProductPopupVisible(false)      
      if(createdProduct){
        showTopMessage(
            `New product : ${createdProduct.marketingName}`, 
            {backgroundColor:'var(--info-green)'},
        )
        setProducts(prev=> {
          if(!prev) return prev

          const updated = Array.from(prev)
          updated.push(createdProduct)
          return updated
        
        })
      }
      
  }


  useEffect(()=>{
    const fetchProducts = async ()=>{
      const result = await getProducts(auth);
      if(result.err) return 
      else if(result.products){
        setProducts(result.products)
      }
    }

    fetchProducts()
  },[])



  const handleDivChange = (ProductId :string | undefined, key: string, value: string) => {
    // console.log("value",value)
    if (ProductId === undefined || ProductId === null) return 
    
    setModifiedProducts(prev=>{
      if(!prev) return prev

      
      const updatedProducts = new Map(prev)
      const Product = updatedProducts.get(ProductId)

      updatedProducts.set(ProductId, {...Product,[key]:value})

      return updatedProducts
    })
  }

  const applyProductModifications = async (ProductId : string, ProductModifications : Product) => {
    

    if(ProductModifications === undefined) return 

    const result = await putProduct(auth,ProductId,ProductModifications)
    if(result){      
      setProducts(prev => {
        if (!prev) return prev;
  
        const updatedProducts = prev.map(existingProduct => {
          if(existingProduct.id === ProductId){
            const msg = `Modification of ${existingProduct.marketingName} saved`
            console.log(msg)
            showTopMessage(
              msg,
              {backgroundColor:'var(--info-green)'}
            )
            return {
              ...existingProduct,
              ...ProductModifications,
              imageUrls: existingProduct.imageUrls
            }
          }else return existingProduct
        });
  
        return updatedProducts;
      });
    } 
    else {
      // console.log("shit")
      showTopMessage(
        `Something went wrong`, 
        {backgroundColor:'var(--info-red)'},
      )
    }

    setProductModifierVisible(false)
  
  }

  const removeProduct = async (Product :Product)=>{
      // console.log("Product to remove",Product)
      
      if (Product.id === undefined) return 

      const imageUrls = Product?.imageUrls ?? []

      const result = await deleteProduct(auth,Product.id,imageUrls)
      if(result) {
        setProducts(prev=>{
          if(!prev) return prev
          
          const updated  = prev.filter(currProduct => currProduct.id != Product.id)
          return updated
        }) 

        showTopMessage(
          `Product removed : ${Product.marketingName}`, 
          {backgroundColor:'var(--info-green)'},
        )

      }else{
        // console.log('Failed to delete Product')
      }
  }


  const showProductPopup = (Product : Product) =>{
      // const Product = Products.find(b => b.id === ProductId)
      // console.log("clicked Product",Product)
      setCurrentProductToModify(Product)
      setProductModifierVisible(true)
  }


  



  return (
    <div className='page'>
        
        <SectionTitle 
          title='Products' 
          newElementButtonText='New product'
          onCreateButtonClicked={handleCreateButtonClicked}/>

        

        {Products &&  
          <div className="products-list-wrapper">
            <div className='products-list'>
              {Products.map((product,index)=>(
                <div className="product" key={index} onClick={() =>showProductPopup(product)}>
  

                    {product.imageUrls && 
                      <div className="product-images">
                          <div className='product-images-wrapper'>
                            {product.imageUrls.length > 0 
                                  ?
                                    // Product.imageUrls.map((imageUrl,index)=>(
                                    //   <div className='Product-image-wrapper' key={index}>
                                    //     {/* <IoMdClose className='product-image-close-btn' /> */}
                                    //     <img className='Product-image' key={index} src={`${BASE_IMAGES_URL}/${imageUrl}`}  alt={`${imageUrl}`}/>
                                    //   </div>
                                    // ))
                                    
                                      <div className='product-image-wrapper' key={index}>
                                        {/* <IoMdClose className='product-image-close-btn' /> */}
                                        <img className='product-image' key={index} src={`${BASE_IMAGES_URL}/${auth.tenantId}/${product.imageUrls[0]}`}  alt={`${product.imageUrls[0]}`}/>
                                      </div>
                                    
                                  :<BsHandbag className='noproduct-image'/>
                            } 
                          </div>
                      </div>
                    }
                    <div className="product-info">              
                      <div className="product-title">{product.marketingName}</div>
                      <IoMdClose className='product-delete-btn' onClick={(e)=>{e.stopPropagation(); removeProduct(product);}} />
                    </div>
                
                </div>
              ))}
            </div>
          </div>

          
 
        }




        {createProductPopupVisible ?
          <Popup 
              title='Add a new product' 
              onPopupClose={onCreateProductPopupClosed} 
              popupVisible={createProductPopupVisible}
              // customCSS={{height:"400px",minWidth:'45%',maxWidth:'45%'}}
              // customCSSPopupContent={{margin:'25px'}}
              >
              <ProductForm onProductFormSubmit={onProductFormSubmit}></ProductForm>
          </Popup>
          : null
        }

        {ProductModifierVisible && <ProductModifier 
                                  product={currentProductToModify}  
                                  applyProductModifications={applyProductModifications}
                                  onPopupClose={()=>setProductModifierVisible(false)} 
                                  />
        }


    </div>
  )
}

export default Products