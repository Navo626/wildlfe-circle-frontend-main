import { useMemo } from "react";
import { DoubleSide } from "three";

const Ground = () => {
  const rotationX = useMemo(() => Math.PI * -0.5, []);

  return (
    <mesh rotation-x={rotationX} receiveShadow>
      <planeGeometry args={[500, 600]} />
      <meshStandardMaterial color="#163611" side={DoubleSide} />
    </mesh>
  );
};

export default Ground;
