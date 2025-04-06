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
import ConfirmActionPopup from '../components/main/ConfirmActionPopup.tsx';

const Products = () => {


  const {auth}:any = useAuth();
  const {showTopMessage}:any = useTopMessage();

  const[Products,setProducts] = useState<Product[]>([]);
  
  const[modifiedProducts, setModifiedProducts] = useState<Map<string,Product>>(new Map());
  
  const [createProductPopupVisible,setCreateProductPopupVisible] = useState(false);
  
  const[currentProductToModify, setCurrentProductToModify] = useState<Product | undefined>(undefined);
  const [ProductModifierVisible,setProductModifierVisible] = useState(false);
  

  const [confirmProductDeletionPopupVisible, setConfirmProductDeletionPopupVisible] = useState(false);
  const [productMarkedForDeletion,setProductMarkedForDeletion] = useState<Product | null>(null);

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



  const handleDivChange = (productId :string | undefined, key: string, value: string) => {
    // console.log("value",value)
    if (productId === undefined || productId === null) return 
    
    setModifiedProducts(prev=>{
      if(!prev) return prev

      
      const updatedProducts = new Map(prev)
      const product = updatedProducts.get(productId)

      updatedProducts.set(productId, {...product,[key]:value})

      return updatedProducts
    })
  }

  const applyProductModifications = async (productId : string, productModifications : Product) => {
    

    if(productModifications === undefined) return 

    const result = await putProduct(auth,productId,productModifications)
    if(result){      
      setProducts(prev => {
        if (!prev) return prev;
  
        const updatedProducts = prev.map(existingProduct => {
          if(existingProduct.id === productId){
            const msg = `Modification of ${existingProduct.marketingName} saved`
            console.log(msg)
            showTopMessage(
              msg,
              {backgroundColor:'var(--info-green)'}
            )
            return {
              ...existingProduct,
              ...productModifications,
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


  const hadnleDeletePopupOpening = (product : Product)=>{    
    setProductMarkedForDeletion(product)
    setConfirmProductDeletionPopupVisible(true)
  }

  const removeProduct = async ()=>{
      // console.log("Product to remove",Product)
      
      const product = productMarkedForDeletion
      if(product == null) return

      if (product.id === undefined) return 

      const imageUrls = product?.imageUrls ?? []

      const result = await deleteProduct(auth,product.id,imageUrls)
      if(result) {
        setProducts(prev=>{
          if(!prev) return prev
          
          const updated  = prev.filter(currProduct => currProduct.id != product.id)
          return updated
        }) 

        showTopMessage(
          `Product removed : ${product.marketingName}`, 
          {backgroundColor:'var(--info-green)'},
        )

      }else{
        // console.log('Failed to delete Product')
      }

      setConfirmProductDeletionPopupVisible(false)
  }


  const showProductPopup = (product : Product) =>{
      // const Product = Products.find(b => b.id === ProductId)
      // console.log("clicked Product",Product)
      setCurrentProductToModify(product)
      setProductModifierVisible(true)
  }


  



  return (
    <div className='page'>
        
        <SectionTitle 
          title='Products' 
          newElementButtonText='New product'
          onCreateButtonClicked={handleCreateButtonClicked}/>

        

        {
        Products &&  
          <div className="products-list-wrapper">
            <div className='products-list'>
              {Products.map((product,index)=>(
                <div className="product" key={index} onClick={() =>showProductPopup(product)}>
  

                    {product.imageUrls && 
                      <div className="product-images">
                          <div className='product-images-wrapper'>
                            {product.imageUrls.length > 0 
                                  ?   
                                      <div className='product-image-wrapper' key={index}>
                                        {/* <IoMdClose className='product-image-close-btn' /> */}
                                        <img className='product-image' key={index} src={`${BASE_IMAGES_URL}/${product.imageUrls[0]}`}  alt={`${product.imageUrls[0]}`}/>
                                        
                                      </div>
                                    
                                  :<BsHandbag className='noproduct-image'/>
                            } 
                          </div>
                      </div>
                    }
                    <div className="product-info">              
                      <div className="product-title">{product.marketingName}</div>
                      <IoMdClose className='product-delete-btn' onClick={(e)=>{e.stopPropagation(); hadnleDeletePopupOpening(product);}} />
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

        {confirmProductDeletionPopupVisible && 

        <ConfirmActionPopup 
          title='Are you sure you want to delete this product ?'
          onConfirmActionPopupClosed={() => setConfirmProductDeletionPopupVisible(false)} 
          onConfirm={removeProduct} 
          onCancel={() => setConfirmProductDeletionPopupVisible(false)}
          confirmText='Delete product'
          confirmActionButtonStyles={{background:'var(--info-red)',borderRadius:'5px', color:'white'}}
        />                        
        }


    </div>
  )
}

export default Products