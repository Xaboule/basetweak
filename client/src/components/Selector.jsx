import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import Body from "./Body";
import Neck from "./Neck";
import Pickups from "./Pickups";
import Visualizer from "./Visualizer";
import './Selector.css'

function Selector() {
  const initialValues = {
    name: "",
    price: 0,
    id:0
  };



  
  const [itemsList, setItemsList] = useState([]);
  const [guitarsList, setGuitarsList] = useState([])
  const [body, setBody] = useState(initialValues);
  const [neck, setNeck] = useState(initialValues);
  const [pickup1, setPickup1] = useState(initialValues);
  const [pickup2, setPickup2] = useState(initialValues);
 const [model, setModel] = useState(1)
  const getItems = () => {
    axios.get("http://localhost:3001/items", {}).then((res) => {
      // console.log(res.data)
      // setItemsList(res.data[0]);
      // setVariationList(res.data[1])
    });
  };

  const addGuitar = () => {
    axios.post("http://localhost:3001/items/saveguitar", {
body, neck, pickup1, pickup2
    })
  };

  const getGuitars = () =>{
    axios.get("http://localhost:3001/items/getguitars",{}).then((res) => {
      setGuitarsList(res.data)

    })
  }

  const total = parseInt(body.price) + parseInt(neck.price) + parseInt(pickup1.price)+ parseInt(pickup2.price)
  useEffect(() => {
    getGuitars()
    getItems();
  }, []);


  const [isHover, setIsHover] = useState(false);

  const [animation, setAnimation] = useState(false);

const handleModelSelect = (e) => {

  setModel(e.target.value)
  setAnimation(true)
}
console.log(model)


useEffect(() => {
  if (animation) {
    // Perform animation logic here
    console.log('PROUTUUUUUUTUTUTUTUTUTUTU')
  }
}, [animation]);

  return (
    <div className="main-select"> 
     <div className="buttonselect">
   <button value="1" 
  //  onPointerOver={(e) =>  {e.preventDefault(), setIsHover(!isHover)}}
    onClick={(e) => handleModelSelect(e)}>ES-335</button>
   <button value="2" onClick={(e) => handleModelSelect(e)}>Telecaster</button>
   </div>
      {/* <div className="selector-section">

        <Body itemsList={itemsList} setBody={setBody}/>
        <Neck itemsList={itemsList} setNeck={setNeck}/>
        <Pickups itemsList={itemsList} setPickup1={setPickup1} setPickup2={setPickup2}/>
 <div>
        Wiring :
        <select name="" id="">
          {itemsList
            .filter((item) => item.id_category === 4)
            .map((filteredItem, key) => (
              <option value={filteredItem} key={key}>
                {filteredItem.name} {filteredItem.price}$
              </option>
            ))}
        </select>
      </div>
   </div> */}
   <div className="visu-sum">
   <Visualizer guitarsList={guitarsList} model={model} setModel={setModel} animation={animation}/>
   {/* <div className="list-sum">

      <div className="item-price">
       <span> {body.name}</span> <span>{body.price}$</span>
      </div >
      <div className="item-price">
      <span> {neck.name}</span>  <span>{neck.price}$</span>
      </div >
      <div className="item-price">
      <span>{pickup1.name}</span>  <span>{pickup1.price}$</span>
      </div >  
      <div className="item-price">
      <span> {pickup2.name} </span> <span>{pickup2.price}$</span>
      </div > 
       <h3>{total}$</h3>
      <button onClick={()=> {addGuitar, getGuitars()}}>Save this guitar</button>
      <button
      //  style={{position : 'absolute', left: '400px'}}
      // onClick={addGuitar}
      onClick={ (e) => (
        e.stopPropagation(),getGuitars())}
      >Get guitars</button>
   </div> */}
   </div>
 
    </div>
  );
}

export default Selector;
