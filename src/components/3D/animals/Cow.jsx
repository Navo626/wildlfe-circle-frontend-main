import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import PropTypes from "prop-types";

const Cow = ({ position, onClick }) => {
  const { scene } = useLoader(GLTFLoader, "./modals/animals/Cow.glb");

  const preparedScene = useMemo(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true; // Set shadow casting only once
      }
    });
    return scene;
  }, [scene]);

  return (
    <primitive
      object={preparedScene}
      position={position}
      scale={[5, 5, 5]}
      onClick={onClick}
    />
  );
};

Cow.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  onClick: PropTypes.func,
};

export default Cow;
