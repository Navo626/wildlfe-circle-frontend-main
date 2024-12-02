import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import PropTypes from "prop-types";

const Bear = ({ position, onClick }) => {
  const { scene } = useLoader(GLTFLoader, "./modals/animals/Bear.glb");

  const preparedScene = useMemo(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
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

Bear.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  onClick: PropTypes.func,
};

export default Bear;
