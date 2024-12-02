import { useRef } from "react";
import { useHelper } from "@react-three/drei";
import { DirectionalLightHelper } from "three";

const Light = () => {
  const lightRef = useRef();

  useHelper(lightRef, DirectionalLightHelper, 10, "blue");

  return (
    <>
      <ambientLight intensity={1} />
      <hemisphereLight intensity={0.7} groundColor="#163611" />
    </>
  );
};

export default Light;
