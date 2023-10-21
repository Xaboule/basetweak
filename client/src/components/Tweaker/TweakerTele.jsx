import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import "./TweakerMain.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addColor, resetDrop } from "../../features/ColorReducer";
import { ColorPicker } from "primereact/colorpicker";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import Sliders from "./Sliders";
import "./Choice-CustomPrimereact.css";
import silverIcon from "../../assets/img/Silver.jpg";
import goldIcon from "../../assets/img/Gold.jpg";
import copperIcon from "../../assets/img/Copper.jpg";
import MetalColors from "./MetalColors";
import Draggable from "react-draggable";
import dragIcon from "../../assets/drag.svg";
import resetIcon from "../../assets/reset.svg";
import MyDropzone from "../Dropzone";
import { ArrowBendDoubleUpLeft, Coins, PiggyBank, StackSimple } from "@phosphor-icons/react";

function TweakerTele({
  colorList,
  setColorList,
  resetCam,
  dropped,
  setDropped,
  selectedParts,
  setSelectedParts,
  gtrPriceFull,
  files,
  setFiles,
  model,
  showPreview,
  setShowPreview,

}) {
  // const actual = useRef(null)
  const dispatch = useDispatch();

  const tweakDrag = useRef();




  const [pickupCover, setPickupCover] = useState({ name: "Silver", value: "#d0cbc4", icon: silverIcon });
  const [metalType, setMetalType] = useState({ name: "Silver", value: "#d0cbc4", icon: silverIcon });

 
 


const [metalVar, setMetalVar] = useState([])
const [singleVar, setSingleVar] = useState([])

const getVariation = () => {    
  axios.get(`${import.meta.env.VITE_BACKEND_URL}/itemsall/getvariation`, {}).then((res) => {
    const metalRes=res.data.filter(vari => vari.part_id ===19 )
  setMetalVar(metalRes);
  const singleRes=res.data.filter(vari => vari.part_id === 15 )
  setSingleVar(singleRes)
})}


const [metalPrice, setMetalPrice] = useState()
const [singlePrice, setSinglePrice] = useState()
const [gtrPriceFullVar, setGtrPriceFullVar] = useState(gtrPriceFull)
  useEffect(() => {



}, [gtrPriceFull]);

useEffect(() => {
// getVariation()
  for(let i = 0; i< metalVar.length; i++){
    
    if(metalVar[i].color == metalType.name.toLowerCase()){
      setMetalPrice(metalVar[i].price)

    }
  };

  for(let i = 0; i< singleVar.length; i++){
    
    if(singleVar[i].color == pickupCover.name.toLowerCase()){

      setSinglePrice(singleVar[i].price)

    }
  }
  
  setGtrPriceFullVar(gtrPriceFull + metalPrice + singlePrice)
},[ metalVar, singleVar])




  const resetGtr = () => { 
       setMetalType({ name: "Silver", value: "#d0cbc4", icon: silverIcon }),
    setPickupCover({ name: "Silver", value: "#d0cbc4", icon: silverIcon }),
    setColorList({...colorList, side: "#ffffff",
    binding: "#ffffff",
    tablefront: "#ffffff",
    tableback: "#ffffff",
    fretbinding: "#ffffff",
    fretboard: "#ffffff",
    inlay: "#ffffff",
    nut: "#ffffff",
    frets: "#ffffff",
    knobs: "#ffffff",
    pickup_cover: "#ffffff",
    pickup_ring: "#ffffff",
    neck: "#ffffff",
    metal_pieces: "#ffffff",
    gloss : 50,
    scratch : 0,
    wood : 0,
    texture_path : "//HD_transparent_picture.png",
    body: "#ffffff",
    pickguard: "#ffffff",
    single_plastic: "#ffffff",
    single_metal: "#d0cbc4",
    backplate: "#ffffff"});
    setGtrPriceFullVar(gtrPriceFull)
   }
   


  


  return (
    <>
      <Draggable
        handle="strong"
        bounds={`parent`}
        allowAnyClick={false}
        // nodeRef={tweakDrag}
        defaultPosition={{ x: 0, y: -210 }}
        onStart={(e) => e.preventDefault()}
      >
        <div className="pickers-main">
          <div className="box no-cursor">
            <strong className="cursor">
              <img className="drag-icon" src={dragIcon} alt="Click to drag" />
            </strong>

            <Button id="resetcam" onClick={resetCam}>
              <p>Reset Camera</p>
            </Button>
            <Button id="resetgtr" onClick={() => resetGtr()}>
              <p>Start again</p>{" "}
              <img
                className="reset-icon"
                src={resetIcon}
                size={24}
                weight="bold"
              />
            </Button>
            <div className="pickers-colors" ref={tweakDrag}>
              <div className="body-colors">
                <ColorPicker
                  tooltip="Body"
                  tooltipoptions={{
                    position: "bottom",
                    mouseTrack: true,
                    mouseTrackTop: 15,
                  }}
                  // id={clickedPart === "tablefront" ? "clickedPart" : ""}
                  name="body"
                  value={colorList.body}
                  onChange={(e) =>
                    setColorList({ ...colorList, body: `#${e.value}` })
                  }
                />
                <ColorPicker
                  tooltip="Pickguard"
                  tooltipoptions={{
                    position: "bottom",
                    mouseTrack: true,
                    mouseTrackTop: 15,
                  }}
                  // id={clickedPart === "tableback" ? "clickedPart" : ""}
                  name="pickguard"
                  value={colorList.pickguard}
                  onChange={(e) =>
                    setColorList({ ...colorList, pickguard: `#${e.value}` })
                  }
                />
               
              </div>
              <div className="neck-colors">
                <ColorPicker
                  tooltip="Neck"
                  tooltipoptions={{
                    position: "bottom",
                    mouseTrack: true,
                    mouseTrackTop: 15,
                  }}
                  // id={clickedPart === "neckwood" ? "clickedPart" : ""}
                  name="neckwood"
                  value={colorList.neck}
                  onChange={(e) =>
                    setColorList({ ...colorList, neck: `#${e.value}` })
                  }
                />
               
                <ColorPicker
                  tooltip="Fretboard"
                  tooltipoptions={{
                    position: "bottom",
                    mouseTrack: true,
                    mouseTrackTop: 15,
                  }}

                  name="fretboard"
                  value={colorList.fretboard}
                  onChange={(e) =>
                    setColorList({ ...colorList, fretboard: `#${e.value}` })
                  }
                />
                <ColorPicker
                  tooltip="Inlay"
                  tooltipoptions={{
                    position: "bottom",
                    mouseTrack: true,
                    mouseTrackTop: 15,
                  }}
            
                  name="inlay"
                  value={colorList.inlay}
                  onChange={(e) =>
                    setColorList({ ...colorList, inlay: `#${e.value}` })
                  }
                />
                <ColorPicker
                  tooltip="Nut"
                  tooltipoptions={{
                    position: "bottom",
                    mouseTrack: true,
                    mouseTrackTop: 15,
                  }}
                  // id={clickedPart === "nut" ? "clickedPart" : ""}
                  name="nut"
                  value={colorList.nut}
                  onChange={(e) =>
                    setColorList({ ...colorList, nut: `#${e.value}` })
                  }
                />
                
              </div>
              <div className="metal-knobs">
                {/* <Toast ref={toast} /> */}
                <MetalColors
                  setColorList={setColorList}
                  colorList={colorList}
                  pickupCover={pickupCover}
                  metalType={metalType}
                  setPickupCover={setPickupCover}
                  setMetalType={setMetalType}
                />
                <ColorPicker
                  tooltip="Pickup cap"
                  tooltipoptions={{
                    position: "bottom",
                    mouseTrack: true,
                    mouseTrackTop: 15,
                  }}
                  // id={clickedPart === "pickup_ring" ? "clickedPart" : ""}
                  name="single_plastic"
                  value={colorList.single_plastic}
                  onChange={(e) =>
                    setColorList({
                      ...colorList,
                      single_plastic: `#${e.value}`,
                    })
                  }
                />
                <ColorPicker
                  tooltip="Knobs"
                  tooltipoptions={{
                    position: "bottom",
                    mouseTrack: true,
                    mouseTrackTop: 15,
                  }}
                  // id={clickedPart === "knobs" ? "clickedPart" : ""}
                  name="knobs"
                  value={colorList.knobs}
                  onChange={(e) =>
                    setColorList({ ...colorList, knobs: `#${e.value}` })
                  }
                />
              </div>
            </div>
            <div className="pickers-sliders">
              <Sliders setColorList={setColorList} colorList={colorList} />
            </div>
            <div
              className="dropzone-line"
              onClick={() => setShowPreview(!showPreview)}
            >
              {" "}
              <StackSimple id="dropzone-icon" size={56} />
              Add an image
            </div>
            <div
              className={
                model == 2 && showPreview
                  ? "dropzone-visible"
                  : "dropzone-hidden"
              }
            >
              <MyDropzone
                selectedParts={selectedParts}
                setSelectedParts={setSelectedParts}
                setDropped={setDropped}
                dropped={dropped}
                files={files}
                setFiles={setFiles}
                model={model}
                showPreview={showPreview}
              />
            </div>
            <Button id="remove" onClick={() => dispatch(resetDrop(0))}>
              <p>Remove image</p>
            </Button>
          </div>{" "}
          <div  className="gtr-price-full">
          <p>Total: </p>
                {/* <div className="price-number">
                  &nbsp;{gtrPriceFullVar}
                  </div>
                <span id="€">€</span> */}
                <div className="piggybank">

                <PiggyBank size={64} weight="thin"/>
                <Coins size={32}/>
                </div>
          </div>
        </div>
      </Draggable>
    </>
  );
}

export default TweakerTele;
