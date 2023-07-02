import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import * as THREE from "three";
import Construction from "./Construction/MainConstruction";
import "./eshop.css";
import {
  Environment,
  OrbitControls,
  useGLTF,
  useSelect,
} from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "../../public/DRACOLoader";
import { ShopContext } from "../context/shop-context";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/CartReducer";
import Product from "./ProductMain";
function Parts() {
  const dispatch = useDispatch();
  const { addToCart, removeFromCart, getCartAmount } = useContext(ShopContext);

  const totalAmount = getCartAmount();
  const [activeItem, setActiveItem] = useState();
  const [itemsList, setItemsList] = useState([]);
  const cartItemsObj = useSelector((state) => state.cart_items.cartItems);

  const cartItems = Object.values(cartItemsObj).filter(
    (item) => item && item !== null
  );
  // console.log(cartItems)
  const getItems = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/items`, {}).then((res) => {
      setItemsList(res.data);
    });
  };

  console.log(itemsList)

  const toPascalCase = (str) =>
    (str.match(/[a-zA-Z0-9]+/g) || [])
      .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
      .join(" ");

  const handleClearStorage = () => {
    // localStorage.clear()
    dispatch(clearCart());
    // removeFromCart(itemsList)
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleClick = (item) => {
    if (item) {
      setActiveItem(item.name);
    }
    if (!item.name) {
      setActiveItem(null);
    }
  };
  useEffect(() => {}, [handleClick]);

  const [posX, setPosX] = useState();
  const [posY, setPosY] = useState();
  const handleMouseMove = (e) => {

    const cursorX =
      (window.innerWidth - e.clientX - window.innerWidth * 0.5) ;
    const cursorY =  (window.innerHeight - e.clientY - window.innerHeight * 0.5) ;

    setPosX(cursorX);
    setPosY(cursorY)


  };

  return (
    <div className={activeItem != null ? "e-shop-active" : "e-shop"} onMouseMove={(e) => handleMouseMove(e)}>
      <div
        className={activeItem != null ? "overlay-active" : "overlay"}
        onClick={() => setActiveItem(null)}
      ></div>
      <div className="parts-products">
        {itemsList.map((item) => (
          <div
            key={item.id}
            className={item.name === activeItem ? "product-active" : "product"}
            style={{ }}
            
          >
            <h3>
              {item.name === "pickup_cover"
                ? (item.name = "Humbucker")
                : toPascalCase(item.name)}
            </h3>
            <div
              className={item.name === activeItem ? "canvas-active" : "canvas"}
              onClick={() => handleClick(item)}
            >
              <Product item={item.name} activeItem={activeItem} />
            </div>
            <p>{item.price}€</p>
            <div className="cart-actions">
              <button onClick={() => removeFromCart(item)}>Remove</button>
              <p>
                 
                {cartItems.find((element) => element.item.id === item.id)
                  ?.qty || 0}
              </p>
              <button onClick={() => addToCart(item)}>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
      <div className="sub-cart">
        <h3>{totalAmount}€</h3>

        <button
          onClick={() => {
            handleClearStorage();
          }}
        >
          Clear cart <ArrowCounterClockwise size={26} />
        </button>
      </div>
    </div>
  );
}

export default Parts;
