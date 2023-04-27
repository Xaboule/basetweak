import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import "./Visualizer.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Clone,
  Html,
  Decal,
  useTexture,
  useSurfaceSampler,
} from "@react-three/drei";
import * as THREE from "three";
import { useDispatch, useSelector } from "react-redux";
import { dropTrigger, addColor } from "../features/Colors";
import { LinearEncoding, sRGBEncoding } from "three";
import materials from './materials'
import { useSpring,animated, useTransition } from "@react-spring/three";

function Teleguitar({
  trig,
  setColorList,
  colorList,
  tilt,
  pos,
  animation
}) {
  const tele = useRef();
  const meshRefs = useRef([]);
  const [hovered, setHovered] = useState(null);
  const { nodes, materials } = useGLTF("/guitar/TeleOPT2.glb");

  const path = "http://localhost:3001/";


  const [scratches, scratchesrough] = useTexture([
    "guitar/imgs/DefaultMaterial_Roughness2.jpg",
    "guitar/imgs/DefaultMaterial_Roughness2-INV.jpg",
  ]);
//   const texture_path = useSelector(
//     (state) => state.guitar_set.colorSet.texture_path
//   );
const texture_path = colorList.texture_path
  const [txUse, setTxUse] = useState(path + texture_path);

  const reactMap = useTexture(txUse);

  const woodFullTele = useTexture("woodTele-min.png");
  woodFullTele.flipY = false;



  const woodMatTele = new THREE.MeshLambertMaterial({
    map: woodFullTele,
    // transparent: true,
    opacity: colorList.wood / 20,
  });
  scratches.flipY = false;
  scratches.wrapS = THREE.RepeatWrapping;
  scratches.wrapT = THREE.RepeatWrapping;
  scratches.repeat.set(2, 2);

  scratchesrough.flipY = false;
  scratchesrough.wrapS = THREE.RepeatWrapping;
  scratchesrough.wrapT = THREE.RepeatWrapping;
  scratchesrough.repeat.set(10, 2);

  materials.un_black = new THREE.MeshBasicMaterial({ color: "black" });
  materials.strings = new THREE.MeshLambertMaterial({ color: "#595959" });
  materials.polepieces = new THREE.MeshPhongMaterial({ color: "#595959", reflectivity:1, shininess:30, specular:  '#828282' });
  materials.varnish = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0.2,
    roughnessMap: scratchesrough,
    roughness: 0.1 * colorList.scratch,
    metalness: colorList.gloss / 100,
    bumpMap: scratches,
    bumpScale: 0.001 * (colorList.scratch / 5),
  });
  (materials.metalpieces.metalness = 1),
    (materials.metalpieces.roughness = 0),
    (materials.pickup_cover.metalness = 1),
    (materials.pickup_cover.roughness = 0);


  woodFullTele.encoding = sRGBEncoding
  


// materials.body.roughness = 0
materials.body = new THREE.MeshStandardMaterial({transparent: true, color : colorList.body, opacity : (1 - (colorList.wood/10))})
materials.neckwood = new THREE.MeshStandardMaterial({transparent: true, color : colorList.neckwood, opacity : (1 - (colorList.wood/10))})

// materials.body.metalness = 0.2
//   materials.body.opacity = 1 - (colorList.wood/10) 
 

const maple = useTexture('maple.png')
maple.flipY = false
const rosewood = useTexture('rosewood.png')
rosewood.flipY = false
rosewood.encoding = sRGBEncoding

materials.fretboard.map = rosewood
materials.fretboard.roughness = 1

materials.plastic.roughness = 0.4
materials.plastic.metalness = 0.5

materials.varnish = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0.2,
    // color : colorList.body,
    roughnessMap: scratchesrough,
    roughness: 0.1 * colorList.scratch,
    metalness: colorList.gloss / 100,
    bumpMap: scratches,
    bumpScale: 0.001 * (colorList.scratch / 5),
})
  // useLayoutEffect(() => {
  //   console.log("pipi");
  //   console.log(texture_path);
  //   setTxUse(path + texture_path);
  // }, [triggs]);

  useFrame(() => {
    meshRefs.current.forEach((mesh) => {
      mesh.material = mesh.material.clone();

    });
  });

  const springProps = useSpring({
    to: { opacity: animation ? 1 : 0.5, scale: animation ? 4 : 0.1 },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  return (
    <>
    <animated.mesh scale={springProps.transform}>
 
      <group rotation={tilt} position={pos}
    //    dispose={[nodes, materials]}
    dispose={null}
       >
        <group
         
          ref={tele}
          position={[0, -0.5, 0]}
          scale={2.5}

        >
      <mesh
       ref={(mesh) => (meshRefs.current[0] = mesh)}
        // castShadow
        receiveShadow
        geometry={nodes.pickguard.geometry}
        material={materials.plastic}
        material-color={colorList.pickguard}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[1] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.selector_arm.geometry}
        material={materials.metalpieces}
        material-color={colorList.metalpieces}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[2] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.selector.geometry}
        material={materials.plastic}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[3] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.pickup.geometry}
        material={materials.pickup_cover}
        material-color={colorList.pickup_cover}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[4] = mesh)}
        // castShadow
        receiveShadow
        geometry={nodes.selector_plate.geometry}
        material={materials.metalpieces}
        material-color={colorList.metalpieces}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[5] = mesh)}
        castShadow
        // receiveShadow
        geometry={nodes.pickup_bridge.geometry}
        material={materials.pickupplastic}
        material-color={colorList.single_plastic}
      />

      <mesh
       ref={(mesh) => (meshRefs.current[6] = mesh)}
        // castShadow
        receiveShadow
        geometry={nodes.body.geometry}
        material={materials.body}
        material-color={colorList.body}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[7] = mesh)}
        // castShadow
        receiveShadow
        geometry={nodes.neck.geometry}
        material={materials.neckwood}
        material-color={colorList.neckwood}
      />
      {/* WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD */}

<mesh
       ref={(mesh) => (meshRefs.current[21] = mesh)}
        // castShadow
        receiveShadow
        geometry={nodes.body.geometry}
        material={woodMatTele}
        // material={materials.body}
        // material-color={colorList.body}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[22] = mesh)}
        // castShadow
        receiveShadow
        geometry={nodes.neck.geometry}
        material={woodMatTele}
        // material={materials.neckwood}
        // material-color={colorList.neckwood}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[8] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.frets.geometry}
        material={materials.frets}
        material-color={colorList.metalpieces}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[9] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.nut.geometry}
        material={materials.nut}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[10] = mesh)}
        castShadow
        // receiveShadow
        geometry={nodes.strings.geometry}
        material={materials.strings}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[11] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.straplocks.geometry}
        material={materials.metalpieces}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[12] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.neckplate.geometry}
        material={materials.metalpieces}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[13] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.Inlay.geometry}
        material={materials.inlay}
        material-color={colorList.inlay}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[14] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.tailpiece.geometry}
        material={materials.metalpieces}
        material-color={colorList.metalpieces}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[15] = mesh)}
        // castShadow
        receiveShadow
        geometry={nodes.fretboard.geometry}
        material={materials.fretboard}
        material-color={colorList.fretboard}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[16] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.cylindersback.geometry}
        material={materials.metalpieces}
        material-color={colorList.metalpieces}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[17] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.mechs.geometry}
        material={materials.metalpieces}
        material-color={colorList.metalpieces}
      />
      <mesh
       ref={(mesh) => (meshRefs.current[18] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.screws.geometry}
        material={materials.metalpieces}
        material-color={colorList.metalpieces}
      />   
         <mesh
       ref={(mesh) => (meshRefs.current[19] = mesh)}
        castShadow
        // receiveShadow
        geometry={nodes.knobs.geometry}
        material={materials.metalpieces}
        material-color={colorList.knobs}

      />
          <mesh
          ref={(mesh) => (meshRefs.current[20] = mesh)}
        castShadow
        receiveShadow
        geometry={nodes.varnish.geometry}
        material={materials.varnish}
      />
           <mesh
        castShadow
        receiveShadow
        geometry={nodes.polepieces.geometry}
        material={materials.polepieces}

      />


    </group>
    </group>
    </animated.mesh>
    </>
  );
}


useGLTF.preload("/TeleOPT2.glb");
export default Teleguitar;
