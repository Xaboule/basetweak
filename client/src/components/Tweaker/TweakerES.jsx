import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
} from "react";
import "./TweakerMain.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addColor, triggerDrop, resetDrop } from "../../features/ColorReducer";
import { ColorPicker } from "primereact/colorpicker";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import Sliders from "./Sliders";
import "./Choice-CustomPrimereact.css";
import MetalColors from "./MetalColors";
import Draggable from "react-draggable";
import dragIcon from "../../assets/drag.svg";
import resetIcon from "../../assets/reset.svg";
import MyDropzone from "../Dropzone";
import ChipsDemo from "./Multiselect";
import silverIcon from "../../assets/img/Silver.jpg";
import { ShopContext } from "../../context/shop-context";
import {
  ArrowBendDoubleUpLeft,
  Coin,
  Coins,
  Palette,
  PiggyBank,
  StackSimple,
  X,
} from "@phosphor-icons/react";
import {
  textureClear,
  textureDelete,
  textureNone,
} from "../../features/TextureReducer";

function TweakerES({
  mobSize,
  colorList,
  setColorList,
  resetCam,
  dropped,
  setDropped,
  gtrPriceFull,
  selectedParts,
  setSelectedParts,
  files,
  setFiles,
  model,
  showPreview,
  setShowPreview,
  gtrName,
}) {
  // const actual = useRef(null);
  const dispatch = useDispatch();

  const tweakDrag = useRef();

  const [yPos, setYPos] = useState(0);

  useEffect(() => {
    mobSize ? setYPos(-510) : setYPos(-210);

  }, [yPos]);

  const [pickupCover, setPickupCover] = useState({
    name: "Silver",
    value: "#d0cbc4",
    icon: silverIcon,
  });
  const [metalType, setMetalType] = useState({
    name: "Silver",
    value: "#d0cbc4",
    icon: silverIcon,
  });

  const [metalVar, setMetalVar] = useState([]);
  const [hBVar, setHBVar] = useState([]);

  const getVariation = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/itemsall/getvariation`, {})
      .then((res) => {
        const metalRes = res.data.filter((vari) => vari.part_id === 19);
        setMetalVar(metalRes);
        const HBRes = res.data.filter((vari) => vari.part_id === 12);
        setHBVar(HBRes);
      });
  };

  const [metalPrice, setMetalPrice] = useState();
  const [hBPrice, setHBPrice] = useState();
  const [gtrPriceFullVar, setGtrPriceFullVar] = useState(gtrPriceFull);

  useEffect(() => {}, [gtrPriceFull]);

  useEffect(() => {
    // getVariation();
    for (let i = 0; i < metalVar.length; i++) {
      if (metalVar[i].color == metalType.name.toLowerCase()) {
        setMetalPrice(metalVar[i].price);
      }
    }

    for (let i = 0; i < hBVar.length; i++) {
      if (hBVar[i].color == pickupCover.name.toLowerCase()) {
        setHBPrice(hBVar[i].price);
      }
    }

    setGtrPriceFullVar(gtrPriceFull + metalPrice + hBPrice);
  }, [metalVar, hBVar]);

  const resetGtr = () => {
    setMetalType({ name: "Silver", value: "#d0cbc4", icon: silverIcon }),
      setPickupCover({ name: "Silver", value: "#d0cbc4", icon: silverIcon }),
      setColorList({
        ...colorList,
        side: "#ffffff",
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
        gloss: 50,
        scratch: 0,
        wood: 0,
        texture_path: "/HD_transparent_picture.png",
        body: "#ffffff",
        pickguard: "#ffffff",
        single_plastic: "#ffffff",
        single_metal: "#d0cbc4",
        backplate: "#ffffff",
      }),
    dispatch(textureNone()),
    setSelectedParts([])
    setGtrPriceFullVar(gtrPriceFull);
  };
  const { addToCart, removeFromCart, getCartAmount, addGuitarToCart } =
    useContext(ShopContext);

  const currentDate = new Date();

  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
  const currentYear = currentDate.getFullYear();

  const dateString =
    currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;
  // "27-11-2020"


  const addGtrToCart = () => {
    const guitarToAdd = {
      id: model,
      name: gtrName != "" ? gtrName : "guitar" + dateString,
      side: colorList.side,
      binding: colorList.binding,
      tablefront: colorList.tablefront,
      tableback: colorList.tableback,
      neckwood: colorList.neck,
      fretboard: colorList.fretboard,
      fretbinding: colorList.fretbinding,
      frets: colorList.frets,
      inlay: colorList.inlay,
      nut: colorList.nut,
      metal_pieces: colorList.metal_pieces,
      pickup_cover: colorList.pickup_cover,
      pickup_ring: colorList.pickup_ring,
      knobs: colorList.knobs,
      texture_path: colorList.texture_path,
      gloss: colorList.gloss,
      scratch: colorList.scratch,
      body: colorList.body,
      wood: colorList.wood,
      pickguard: colorList.pickguard,
      single_plastic: colorList.single_plastic,
      single_metal: colorList.single_metal,
      backplate: colorList.backplate,
      price: gtrPriceFullVar,
    };
    //   const gtrAndPrice = {guitarToAdd, gtrPriceFullVar}
    //  addGuitarToCart(gtrAndPrice)
    addToCart(guitarToAdd);
  };
  const handlePointerDown = (e) => {
    document.body.classList.add("no-scroll");
    document.body.addEventListener("touchmove", preventScroll, {
      passive: false,
    });
  };

  const preventScroll = (e) => {
    e.preventDefault();
  };

  const [tweakOpen, setTweakOpen] = useState(false);

  return (
    <>
      <Draggable
        handle="strong"
        bounds={`parent`}
        allowAnyClick={false}
        // nodeRef={tweakDrag}

        onStart={(e) => e.preventDefault()}
      >
        <div className="pickers-main">
          {mobSize && (
            <button
              className={
                tweakOpen ? "tweaker-toggle-open" : "tweaker-toggle-closed"
              }
              onClick={() => setTweakOpen(!tweakOpen)}
            >
              {" "}
              {tweakOpen ? <X size={32} /> : <Palette size={46} />}
            </button>
          )}
          <div className={tweakOpen ? "controls-open" : "controls-closed"}>
            <div className="box no-cursor">
              <strong className="cursor">
                <img className="drag-icon" src={dragIcon} alt="Click to drag" />
              </strong>

              <Button id="resetcam" onClick={resetCam}>
                <p>Reset Camera</p>
              </Button>
              <Button id="resetgtr" onClick={() => resetGtr()}>
                <p>Start again</p>
                <img
                  className="reset-icon"
                  src={resetIcon}
                  size={24}
                  weight="bold"
                />
              </Button>

              <div className="pickers-colors" ref={tweakDrag}>
                <div
                  className="body-colors"
                  onPointerDown={() => handlePointerDown}
                >
                  <ColorPicker
                    tooltip="Front table"
                    tooltipoptions={{
                      position: "bottom",
                      mouseTrack: true,
                      mouseTrackTop: 15,
                    }}
                    name="tablefront"
                    value={colorList.tablefront}
                    onChange={(e) =>
                      setColorList({ ...colorList, tablefront: `#${e.value}` })
                    }
                  />
                  <ColorPicker
                    tooltip="Back table"
                    tooltipoptions={{
                      position: "bottom",
                      mouseTrack: true,
                      mouseTrackTop: 15,
                    }}
                    name="tableback"
                    value={colorList.tableback}
                    onChange={(e) =>
                      setColorList({ ...colorList, tableback: `#${e.value}` })
                    }
                  />
                  <ColorPicker
                    tooltip="Side"
                    tooltipoptions={{
                      position: "bottom",
                      mouseTrack: true,
                      mouseTrackTop: 15,
                    }}
                    name="side"
                    value={colorList.side}
                    onChange={(e) =>
                      setColorList({ ...colorList, side: `#${e.value}` })
                    }
                    onMouseUp={() => dispatch(addColor(colorList))}
                  />

                  <ColorPicker
                    tooltip="Binding"
                    tooltipoptions={{
                      position: "bottom",
                      mouseTrack: true,
                      mouseTrackTop: 15,
                    }}
                    name="binding"
                    value={colorList.binding}
                    onChange={(e) =>
                      setColorList({ ...colorList, binding: `#${e.value}` })
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
                    name="neck"
                    value={colorList.neck}
                    onChange={(e) =>
                      setColorList({ ...colorList, neck: `#${e.value}` })
                    }
                  />
                  <ColorPicker
                    tooltip="Frets binding"
                    tooltipoptions={{
                      position: "bottom",
                      mouseTrack: true,
                      mouseTrackTop: 15,
                    }}
                    name="fretbinding"
                    value={colorList.fretbinding}
                    onChange={(e) =>
                      setColorList({ ...colorList, fretbinding: `#${e.value}` })
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
                    name="nut"
                    value={colorList.nut}
                    onChange={(e) =>
                      setColorList({ ...colorList, nut: `#${e.value}` })
                    }
                  />
                  <ColorPicker
                    tooltip="Frets"
                    tooltipoptions={{
                      position: "bottom",
                      mouseTrack: true,
                      mouseTrackTop: 15,
                    }}
                    name="frets"
                    value={colorList.frets}
                    onChange={(e) =>
                      setColorList({ ...colorList, frets: `#${e.value}` })
                    }
                  />
                </div>
                <div className="metal-knobs">
                  <MetalColors
                    setColorList={setColorList}
                    colorList={colorList}
                    setPickupCover={setPickupCover}
                    setMetalType={setMetalType}
                    pickupCover={pickupCover}
                    metalType={metalType}
                  />
                  <ColorPicker
                    tooltip="Pickup rings"
                    tooltipoptions={{
                      position: "bottom",
                      mouseTrack: true,
                      mouseTrackTop: 15,
                    }}
                    name="pickup_ring"
                    value={colorList.pickup_ring}
                    onChange={(e) =>
                      setColorList({ ...colorList, pickup_ring: `#${e.value}` })
                    }
                  />
                  <ColorPicker
                    tooltip="Knobs"
                    tooltipoptions={{
                      position: "bottom",
                      mouseTrack: true,
                      mouseTrackTop: 15,
                    }}
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
                  model == 1 && showPreview
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

              <div onClick={addGtrToCart} className="gtr-price-full">
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
              <button onClick={addGtrToCart} className="addtocart">
                Add to cart
              </button>
            </div>{" "}
          </div>
        </div>
      </Draggable>
    </>
  );
}

export default TweakerES;
