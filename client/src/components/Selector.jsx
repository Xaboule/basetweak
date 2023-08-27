import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import Visualizer from "./Visualizer";
import "./css/Selector.css";
import {  useSelector } from "react-redux";

function Selector() {


  const userData = useSelector((state) => state.user_data.userData);
  const modelFetched = useSelector((state) => state.guitar_set.colorSet.model)
  const [itemsListFull, setItemsListFull] = useState([]);
  const [guitarsList, setGuitarsList] = useState([]);

  const [model, setModel] = useState('1');
  const [changed, setChanged] = useState(false);
  const [gtrPrice, setGtrPrice] = useState(0);

  const getItemsFullGtr = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/itemsall`, {
        params: { model: model },
      })
      .then((res) => {
        setItemsListFull(res.data);
      });
  };


  function fullPrice() {
    let fullGtrPrice = 0;
    for (let i = 0; i < itemsListFull.length; i++) {
      fullGtrPrice += itemsListFull[i].price;
    }

    setGtrPrice(fullGtrPrice);
  }

  useEffect(() => {
    fullPrice();
  }, [itemsListFull]);

  useEffect(() => {
    getItemsFullGtr();

    fullPrice();
  }, [model]);

  useEffect(() => {

    if( modelFetched != undefined) {
      setModel(modelFetched)
    }
  }, [])

  const handleModelSelect = (e) => {
    setModel(e.target.value);
   
   
    getItemsFullGtr();
    setChanged(!changed);
  };


  return (
    <div className="main-select">
      <div className="buttonselect">
        <button
          className={model == 1 ? "es-icon-selected" : "es-icon"}
          value="1"
          onClick={(e) => {
            {
              e.preventDefault(), handleModelSelect(e);
            }
          }}
          alt="ES-335"
        ></button>
        <button
          className={model == 2 ? "tele-icon-selected" : "tele-icon"}
          value="2"
          onClick={(e) => {
            e.preventDefault(), handleModelSelect(e);
          }}
          alt="Telecaster"
        ></button>
      </div>

      <div className="visu-sum">
        <Visualizer
          guitarsList={guitarsList}
          model={model}
          setModel={setModel}
          changed={changed}
          setChanged={setChanged}
          gtrPrice={gtrPrice}
        />
      </div>
    </div>
  );
}

export default Selector;
