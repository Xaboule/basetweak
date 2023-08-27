import React, {
  useRef,
  useState,
  useEffect,
  Suspense,
  useContext,
  createRef,
} from "react";

import "./css/Visualizer.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Text } from "@react-three/drei";
import { Perf } from "r3f-perf";
import axios from "axios";
import * as THREE from "three";
import { MotionConfig } from "framer-motion";
import { motion } from "framer-motion-3d";
import { useDispatch, useSelector } from "react-redux";
import TweakerES from "./Tweaker/TweakerES";
import TweakerTele from "./Tweaker/TweakerTele";
import ESguitar from "./ESguitar";
import Teleguitar from "./Teleguitar";
import LightAmb from "./LightAmb";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./css/confirm-modal.css";
import "./css/confirm-lara-blue.css";
import { FloppyDisk } from "@phosphor-icons/react";
import { ThemeContext } from "../App";

import { userGuitarsSave } from "../features/UserReducer";
import { useScreenshot } from "use-react-screenshot";

function Visualizer({  model, gtrPrice }) {
  const colus = useSelector((state) => state.guitar_set.colorSet);
  const triggs = useSelector((state) => state.guitar_set.dropped);
  const loggedIn = useSelector((state) => state.user_data.userData);
  let date = new Date().toJSON();
  const orbCam = useRef();
  const gtrnameref = useRef();

  const [colorList, setColorList] = useState(colus);
  const [gtrNameInput, setGtrNameInput] = useState("");
  const [gtrName, setGtrName] = useState("");
  const [dropped, setDropped] = useState(triggs);
  const [showPreview, setShowPreview] = useState(false);
  const [mobSize, setMobSize] = useState(false);

  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;

  const thbid = "Guitar" + date;
  const gtrPriceFull = gtrPrice;

  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);
  const [thumbImg, setThumbImg] = useState();
  const ref = createRef(null);
  const formData = new FormData();
  const [image, takeScreenshot] = useScreenshot({
    type: "image/png",
    quality: 1.0,
    width: 240,
    height: 200,
  });

  const getImage = () => {
    takeScreenshot(ref.current).then((capturedImage) => {
      // The capturedImage contains the screenshot
      const formData = new FormData();
      formData.append("file", capturedImage);
      formData.append("id", thbid);

      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/uploadthb`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setThumbImg(response);
        });
    });
  };

  function getSize() {
    if (window.innerWidth < 1223) {
      setMobSize(true);
    } else setMobSize(false);
  }
  window.addEventListener("resize", getSize);

  const toPascalCase = (str) =>
    (str.match(/[a-zA-Z0-9]+/g) || [])
      .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
      .join(" ");

  const accept = () => {
    addGuitar(),
      toast.current.show({
        severity: "info",
        summary: "Confirmed",
        detail: "Saved !",
        life: 3000,
      });
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejected",
      detail: "Not saved...",
      life: 3000,
    });
  };

  const resetCam = () => {
    orbCam.current.reset();
  };


  const addGuitar = () => {
    getImage();
    // const textureData = useSelector((state) => state.texture_data.texture_assign)
    const guitarData = {

      side: colorList.side,
      binding: colorList.binding,
      tablefront: colorList.tablefront,
      tableback: colorList.tableback,
      fretbinding: colorList.fretbinding,
      fretboard: colorList.fretboard,
      inlay: colorList.inlay, 
      nut: colorList.nut,
      frets: colorList.frets,
      knobs: colorList.knobs,
       pickup_cover: colorList.pickup_cover,
      pickup_ring: colorList.pickup_ring,
      neck: colorList.neck,
      metal_pieces: colorList.metal_pieces,
      texture_path: colorList.texture_path,
      gloss: colorList.gloss,
      scratch: colorList.scratch,
      wood: colorList.wood,
      body: colorList.body,
      pickguard: colorList.pickguard,
      single_plastic: colorList.single_plastic,
      single_metal: colorList.single_metal,
      backplate: colorList.backplate,
      user: loggedIn.user.id,
      thumbnail: thbid.replace(/[:.]/g, ""), 
           id: model,
      gtrname: gtrName !== "" ? gtrName : thbid,
    };
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/items/saveguitar`, guitarData)
      .then((response) => {
  
        const gtrToAdd = {
          id: response.data.id_guitar,
          model : response.data.model,
          name : response.data.name,
          user: loggedIn.user.id,
          thumbnail: thbid.replace(/[:.]/g, ""),
        }
        dispatch(userGuitarsSave(gtrToAdd));
      });
  };

  useEffect(() => {}, [model, theme]);

  const [allTx, setAllTx] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/stocked`)
      .then((response) => {
        let filesReached = [];

        filesReached.push(response.data);
        setAllTx(filesReached);
      });
  }, [triggs]);

  useEffect(() => {
    setColorList(colus);
    getSize();
   
  }, []);

  const handleGtrNameSet = () => {
    setGtrName(gtrNameInput);
    setGtrNameInput("");
  };

  function GuitarName() {
    useFrame(({ camera }) => {
      // Make text face the camera
      gtrnameref.current.quaternion.copy(camera.quaternion);
    });

    return (
      <group ref={gtrnameref} position={[0.2, -0.5, 0.9]} scale={0.2}>
        <Suspense fallback={null}>
          <Text
            color={"#000000"}
            fontSize={2}
            maxWidth={3}
            lineHeight={0.8}
            textAlign={"left"}
            font="/Summer_Pisces.ttf"
            anchorX="-60%"
            anchorY="middle"
            outlineOffsetX={"-1%"}
            outlineOffsetY={"1%"}
            outlineOpacity={1}
            strokeWidth={0}
            outlineWidth={0.02}
          >
            <meshBasicMaterial
              side={THREE.DoubleSide}
              color={"#000000"}
              transparent
              opacity={1}
            />
            {gtrName}
            <group position={[0, 0, 0.01]} scale={1.01}>
              <Text
                color={"#000000"}
                fontSize={2}
                maxWidth={3}
                fontWeight={"bold"}
                lineHeight={0.8}
                // letterSpacing={0.02}
                textAlign={"left"}
                fillOpacity={0}
                glyphGeometryDetail={0}
                font="/Summer_Pisces.ttf"
                anchorX="-60%"
                anchorY="middle"
                outlineBlur={"2%"}
                outlineOpacity={0.9}
                outlineColor="#000000"
              >
                <meshBasicMaterial
                  side={THREE.DoubleSide}
                  color={"#000000"}
                  transparent
                  opacity={1}
                />
                {gtrName}
              </Text>
            </group>
          </Text>
          {loggedIn[0] && (
            <Text
              position={[4, -1, 0.2]}
              color={"#000000"}
              fontSize={1}
              maxWidth={3}
              fontWeight={"bold"}
              lineHeight={0.8}
              // letterSpacing={0.02}
              textAlign={"left"}
              fillOpacity={1}
              glyphGeometryDetail={0}
              font="/Summer_Pisces.ttf"
              strokeWidth={0}
              outlineWidth={0.002}
              anchorX="100%"
              anchorY="middle"
              outlineBlur={"2%"}
              outlineOpacity={0.9}
              outlineColor="#000000"
            >
              <meshBasicMaterial
                side={THREE.DoubleSide}
                color={"#000000"}
                transparent
                opacity={1}
              />
              by {toPascalCase(loggedIn.user.username)}
            </Text>
          )}
        </Suspense>
      </group>
    );
  }

  return (
    <div className="mainviz">
      <div className="visualizer">
        <div></div>
        <div className="canvas" style={{ display: "flex" }}>
          <Canvas
            ref={ref}
            fallback={null}
            camera={{ position: mobSize ? [0, 0, 5] : [0, 0, 3], fov: 60 }}
            linear
            shadows
            dpr={[1, 2]}
            gl={{
              preserveDrawingBuffer: true,
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              // precision: "lowp",
              // powerPreference: "low-power"
            }}
          >
            <OrbitControls
              ref={orbCam}
              target={mobSize ? [0, 2, 0] : [0, 0, 0]}
              enableZoom={false}
              enableDamping={false}
              position0={[0, 0, 3]}
            />

            <>
              <LightAmb />
              <ContactShadows
                depthWrite={false}
                position={[0, -1.3, 0]}
                opacity={0.85}
                scale={10}
                blur={0.7}
                far={5}
                frames={100}
                resolution={512}
              />
            </>

            <MotionConfig
              transition={{
                type: "spring",
                duration: 2,
                ease: "easeInOut",
                repeat: 0,
                repeatDelay: 1,
              }}
            >
              <motion.group animate={model === "1" ? "es335" : "tele"}>
                <motion.group
                  variants={{
                    es335: { opacity: 0, x: 0 },
                    tele: {
                      x: 10,
                      scale: 0,
                    },
                  }}
                >
                  <ESguitar
                    setColorList={setColorList}
                    colorList={colorList}
                    tilt={
                      mobSize ? [0, 0, 0] : [-Math.PI / 7, -0.2, -Math.PI * 0.3]
                    }
                    pos={mobSize ? [0, 1, 0] : [-1, -0.5, -0.3]}
                    files={files}
                    selectedParts={selectedParts}
                  />
                </motion.group>

                <motion.group
                  variants={{
                    es335: { x: -10, scale: 0, visibility: 0 },
                    tele: {},
                  }}
                >
                  <Teleguitar
                    setColorList={setColorList}
                    colorList={colorList}
                    tilt={
                      mobSize ? [0, 0, 0] : [-Math.PI / 7, -0.2, -Math.PI * 0.3]
                    }
                    pos={mobSize ? [0, 1, 0] : [-1, -0.8, -0.4]}
                    files={files}
                    selectedParts={selectedParts}
                  />
                </motion.group>
              </motion.group>
            </MotionConfig>
            {/* <Perf deepAnalyze={true} position={"top-left"} /> */}
            {gtrName && <GuitarName />}
          </Canvas>
          {model == 1 && (
            <TweakerES
              colorList={colorList}
              setColorList={setColorList}
              resetCam={resetCam}
              setDropped={setDropped}
              dropped={dropped}
              gtrPriceFull={gtrPriceFull}
              selectedParts={selectedParts}
              setSelectedParts={setSelectedParts}
              files={files}
              setFiles={setFiles}
              model={model}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
              gtrName={gtrName}
              mobSize={mobSize}
            />
            // ''
          )}
          {model == 2 && (
            <TweakerTele
              colorList={colorList}
              setColorList={setColorList}
              setDropped={setDropped}
              dropped={dropped}
              resetCam={resetCam}
              gtrPriceFull={gtrPriceFull}
              selectedParts={selectedParts}
              setSelectedParts={setSelectedParts}
              files={files}
              setFiles={setFiles}
              model={model}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
              gtrName={gtrName}
              mobSize={mobSize}
            />
          )}
        </div>
      </div>
      <div id="save-guitar">
        <Toast ref={toast} />
        <ConfirmDialog
          draggable={false}
          className="confirm-save"
          visible={visible}
          onHide={() => setVisible(false)}
          message="Are you sure you want to save this guitar?"
          closeOnEscape
          header="Confirmation"
          label="Confirm"
          icon="pi pi-exclamation-triangle"
          accept={accept}
          reject={reject}
        />
        <div className="card flex justify-content-center">
          {/* <Button onClick={() => setVisible(true)} icon="pi pi-check" /> */}
          {loggedIn ? (
            <div
              className="floppydisk-wrap"
              onClick={(e) => (e.stopPropagation(), setVisible(true))}
            >
              <FloppyDisk size={56} className="floppydisk" />
            </div>
          ) : (
            <div
              className="floppydisk-wrap"
              onClick={(e) => e.stopPropagation()}
            >
              <a href="/account">
                <FloppyDisk size={56} className="floppydisk" />
              </a>
            </div>
          )}
        </div>
        {!mobSize && (
          <div className="guitar-name">
            <input
              type="text"
              value={gtrNameInput}
              onChange={(e) => setGtrNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGtrNameSet();
                }
              }}
              placeholder="Give it a name..."
            ></input>
            <button onClick={handleGtrNameSet}>
              <p>OK</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Visualizer;
