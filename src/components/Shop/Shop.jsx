import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [itemsPerPage,setItemsPerPage] = useState(10)
    const [currentPage,setCurrentPage] = useState(0);
    const [count,setCount] = useState(0)
    const [cart,setCart] =useState([])
    const carts = useLoaderData();
    const numberOfPages = Math.ceil(count / itemsPerPage);

    // const pages = [];
    // for(let i = 0; i<numberOfPages; i++){
    //     pages.push(i)
    // }
    const pages = [...Array(numberOfPages).keys()]

    

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage,itemsPerPage]);

    useEffect(()=>{
        fetch('http://localhost:5000/productsCount')
        .then(res => res.json())
        .then(data => setCount(data.count))
    },[])

    useEffect(()=>{
        fetch('http://localhost:5000/products')
        .then(res => res.json())
        .then(data => setCart(data))
    },[])


    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        console.log({newCart})

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handleItemsPerPage = e =>{
        console.log(e.target.value)
        setItemsPerPage(parseInt(e.target.value))
        setCurrentPage(0)
    }


    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={carts}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
            <p>Current Page: {currentPage}</p>
            <button 
            className={currentPage === 0?'Disable':' '}
            onClick={()=> setCurrentPage(currentPage-1)}
            >
            Previous
            </button>
            {
                pages.map(page => <button 
                    className={currentPage === page ? 'selected':' '}
                    onClick={()=>setCurrentPage(page)} 
                    key={page}>
                    {page}
                    </button>)
            }
            <button 
            className={currentPage === pages.length-1?'Disable':''} 
            onClick={()=> setCurrentPage(currentPage+1)}>
            Next
            </button>
            <select  defaultValue={itemsPerPage} onChange={handleItemsPerPage}>
               <option value="5">5</option>
               <option value="10">10</option>
               <option value="20">20</option>
               <option value="50">50</option>
          </select>
            </div>
        </div>
    );
};

export default Shop;