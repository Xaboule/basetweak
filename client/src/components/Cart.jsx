import React, { useContext, useEffect } from "react";
import Construction from "./Construction/MainConstruction";
import { ShopContext } from "../context/shop-context";
import { useSelector } from "react-redux";
import './eshop.css'
import { CaretRight } from "@phosphor-icons/react";
function Cart() {
  const { addToCart, removeFromCart, getCartAmount } = useContext(ShopContext);
  const totalAmount = getCartAmount();
  const cartItemsObj = useSelector((state) => state.cart_items.cartItems)
  console.log(cartItemsObj)
  const cartItems = Object.values(cartItemsObj).filter(item => item && item !== null);
    const cartGuitarsObj = useSelector((state) => state.cart_items.cartGuitars)
  console.log(cartGuitarsObj)
  const cartGuitars = Object.values(cartGuitarsObj).filter(item => item && item !== null);
  const toPascalCase = str => (str.match(/[a-zA-Z0-9]+/g) || []).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join(' ');

console.log(cartGuitarsObj)
  return (
    <div>
      {/* <Construction/> */}
      <div className="cart">
        <h1 id="cart-title">Cart</h1>

        <div className="cart-items">
          {cartItems && cartItems.length != 0 && (cartItems.map((itemInfo) => {

if (itemInfo.item) { // Add this check
  return (
    <div key={itemInfo.id} className="cart-list-item">
      <div className="item-unit">
        <h2>{toPascalCase(itemInfo.item.name)}</h2>
        <p id="unit"> unit: {itemInfo.item.price}€</p>
      </div>
      <div className='cart-actions'>
        <button onClick={() => removeFromCart(itemInfo.item)}>-</button>
        <p>{itemInfo.qty}</p>
        <button onClick={() => addToCart(itemInfo.item)}>+</button>
      </div>
    </div>
  );
}
return null; // Return null for items without 'item' property
})
)}
{cartGuitars && cartGuitars.length != 0 && (cartGuitars.map((itemInfo) => {

if (itemInfo.item) { // Add this check
  return (
    <div key={itemInfo.id} className="cart-list-item">
      <div className="item-unit">
        {/* <h2>{toPascalCase(itemInfo.item.name)}</h2> */}
        <p id="unit"> unit: {itemInfo.item.price}€</p>
      </div>
      <div className='cart-actions'>
        <button onClick={() => removeFromCart(itemInfo.item)}>-</button>
        <p>{itemInfo.qty}</p>
        <button onClick={() => addToCart(itemInfo.item)}>+</button>
      </div>
    </div>
  );
}
return null; // Return null for items without 'item' property
})
)}
          {cartItems.length === 0 && cartGuitars.length === 0 &&(
        <div className="empty-cart"><p id="title">Your cart is empty</p>

       <div className="empty-redirect"> 
        <a href="/">Create your guitar</a> &nbsp; or &nbsp; <a href="/parts">find spare parts</a>!
        </div></div>
         )}

          <div className="cart-total"><p>Total: {totalAmount}€</p></div>
        </div>
        <div className="delivery-checkout">

        <div className="country-delivery"> Average time estimated : 10 days</div>
        <div className="checkout-button">Checkout<CaretRight id="arrow" size={32} weight="bold"/></div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
