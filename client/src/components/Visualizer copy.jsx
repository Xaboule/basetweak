import React, { useRef, useState, useEffect } from "react";
import "./Visualizer.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Clone, Html, Decal, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useSnapshot } from "valtio";
import { HexColorPicker } from "react-colorful";
import { useControls } from "leva";
import {Perf} from "r3f-perf"
function Modelos({ status}) {
  const state = status;
  const ref = useRef();
  const snap = useSnapshot(state);
  const [hovered, set] = useState(null);
  const { nodes, materials } = useGLTF("/guitar/335full2.glb");


  // const debouncedApply = debounce((color) => { applyColor(color) }, 1000)

  
const controls = useControls({
  gloss:{
    value: 0,
    min:0,
    max: 1,
    step:0.01
  },
  side :{
    value:
    state.colorList.side,
    onChange: (c) => {
      state.colorList.side = c
    }
  },
  binding :{
    value:
    state.colorList.binding,
    onChange: (c) => {
      state.colorList.binding = c
    }
  },
  tablefront :{
    value:
    state.colorList.tablefront,
    onChange: (c) => {
      state.colorList.tablefront = c
    }
  },
  tableback :{
    value:
    state.colorList.tableback,
    onChange: (c) => {
      state.colorList.tableback = c
    }
  },
  neckwood :{
    value:
    state.colorList.neckwood,
    onChange: (c) => {
      state.colorList.neckwood = c
    }
  },
  fretboard :{
    value:
    state.colorList.fretboard,
    onChange: (c) => {
      state.colorList.fretboard = c
    }
  },
  fretbinding :{
    value:
    state.colorList.fretbinding,
    onChange: (c) => {
      state.colorList.fretbinding = c
    }
  },
  frets :{
    value:
    state.colorList.frets,
    onChange: (c) => {
      state.colorList.frets = c
    }
  },
  inlay :{
    value:
    state.colorList.inlay,
    onChange: (c) => {
      state.colorList.inlay = c
    }
  },  
  nut :{
    value:
    state.colorList.nut,
    onChange: (c) => {
      state.colorList.nut = c
    }
  },
  metalpieces :{
    value:
    state.colorList.metalpieces,
    onChange: (c) => {
      state.colorList.metalpieces = c
    }
  },  pickup_cover :{
    value:
    state.colorList.pickup_cover,
    onChange: (c) => {
      state.colorList.pickup_cover = c
    }
  },  pickup_ring :{
    value:
    state.colorList.pickup_ring,
    onChange: (c) => {
      state.colorList.pickup_ring = c
    }
  }, 
  knobs :{
    value:
    state.colorList.knobs,
    onChange: (c) => {
      state.colorList.knobs = c
    }
  },
  
    })






  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.colorList[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="10" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;

    const auto = `<svg width="96" height="64" fill="none" ><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`;
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
        cursor
      )}'), none`;
      return () =>
        (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
          auto
        )}'), default`);
    }
  }, [hovered, state]);




materials.varnish = new THREE.MeshStandardMaterial({ transparent:true, opacity:0.2, roughness: 0.01, metalness: controls.gloss})
materials.metalpieces.metalness = 1,
materials.metalpieces.roughness = 0,
materials.pickup_cover.metalness = 1,
materials.pickup_cover.roughness = 0


const reactMap = useTexture("/wood.jpg")



  return (
    <>

    <group
      // {...props}
      dispose={null}
      ref={ref}
      position={[0, -0.5, 0]}
      onPointerOver={(e) => (e.stopPropagation(), set(e.object.material.name))}
      onPointerOut={(e) => e.intersections.length === 0 && set(null)}
      onPointerMissed={() => (state.current = null)}
      onClick={(e) => (
        // e.stopPropagation(), (state.current = e.object.material.name)
      console.log(e)
        )}
    >
  <Perf
          deepAnalyze
          />

 <mesh
        castShadow
        receiveShadow
        geometry={nodes.side.geometry}
        material={materials.side}
        material-color={snap.colorList.side}
      />

     
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.binding.geometry}
        material={materials.binding}
        material-color={snap.colorList.binding}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.tableback.geometry}
        material={materials.tableback}
        material-color={snap.colorList.tableback}
   
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.tablefront.geometry}
        material={materials.tablefront}
        material-color={snap.colorList.tablefront}
        
      >
        <Decal mesh={ref} >
           <meshStandardMaterial
             roughness={0.2}
             transparent
             depthTest={false}
             map={reactMap}
             alphaTest={0}
             polygonOffset={true}
             polygonOffsetFactor={-10}
           />
           </Decal>
        </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.inlay.geometry}
        material={materials.inlay}
        material-color={snap.colorList.inlay}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.jackinput.geometry}
        material={materials.metalpieces}
        material-color={snap.colorList.metalpieces}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.fretbinding.geometry}
        material={materials.fretbinding}
        material-color={snap.colorList.fretbinding}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.fretboard.geometry}
        material={materials.fretboard}
        material-color={snap.colorList.fretboard}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.frets.geometry}
        material={materials.frets}
        material-color={snap.colorList.frets}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.knobs.geometry}
        material={materials.knobs}
        material-color={snap.colorList.knobs}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.nut.geometry}
        material={materials.nut}
        material-color={snap.colorList.nut}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.neckwood.geometry}
        material={materials.neckwood}
        material-color={snap.colorList.neckwood}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pickup_cover.geometry}
        material={materials.pickup_cover}
        material-color={snap.colorList.pickup_cover}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pickup_ring.geometry}
        material={materials.pickup_ring}
        material-color={snap.colorList.pickup_ring}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mechs.geometry}
        material={materials.metalpieces}
        material-color={snap.colorList.metalpieces}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.selector.geometry}
        material={materials.metalpieces}
        material-color={snap.colorList.metalpieces}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.tail_saddle.geometry}
        material={materials.metalpieces}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pickup_screws.geometry}
        material={materials.pickup_cover}
      />
      </group>
      <group position={[0,-.5,0]} dispose={null}>
        
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.UN_inside.geometry}
          material={materials.un_black}
          // material-color={snap.colorList.}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.strings.geometry}
          material={materials.strings}
        />

<mesh
        castShadow
        receiveShadow
        geometry={nodes.varnish.geometry}
        material={materials.varnish}
      // visible={false}
      />
        
      </group>
    
    </>
  );
}

export default Modelos;
