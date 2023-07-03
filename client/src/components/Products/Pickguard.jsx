

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Pickguard(){
  const { nodes, materials } = useGLTF("/products/product-pickguard.glb");
  return (
    <group  dispose={null}>
           <mesh
        castShadow
        receiveShadow
        geometry={nodes.pickguard002.geometry}
        material={materials["plastic.002"]}
        // scale={6}
      />
    </group>
  );
}

useGLTF.preload("/product-pickguard.glb");


export default Pickguard