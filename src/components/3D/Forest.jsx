import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Forest = () => {
  const { scene } = useLoader(GLTFLoader, "./modals/Forest.glb");

  const preparedScene = useMemo(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
      }
    });
    return scene;
  }, [scene]);

  return <primitive object={preparedScene} position={[100, 0, -100]} />;
};

export default Forest;
