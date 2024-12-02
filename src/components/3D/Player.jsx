import PropTypes from "prop-types";
import { OrbitControls, useAnimations } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import useInput from "../../hooks/useInput.jsx";
import * as THREE from "three";

const Player = ({ position }) => {
  const { scene, animations } = useLoader(GLTFLoader, "./modals/Player.glb");
  const { actions } = useAnimations(animations, scene);
  const { forward, backward, left, right, shift, jump } = useInput();
  const [velocity, setVelocity] = useState(new THREE.Vector3());
  const [speed, setSpeed] = useState(1);
  const { camera } = useThree();

  const preparedScene = useMemo(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
      }
    });
    return scene;
  }, [scene]);

  const currentAction = useRef("");
  const controlRef = useRef();

  // Set the initial camera position relative to the player
  useEffect(() => {
    const initialCameraPosition = new THREE.Vector3()
      .copy(preparedScene.position)
      .add(new THREE.Vector3(0, 15, -30)); // Move the camera behind the player
    camera.position.copy(initialCameraPosition);
    camera.lookAt(preparedScene.position);
  }, [camera, preparedScene.position]);

  // Handle player movement
  useEffect(() => {
    let action = "idle";
    let forwardVec = new THREE.Vector3(0, 0, 1);
    let rightVec = new THREE.Vector3(1, 0, 0);

    // Apply the player rotation to the movement vectors
    forwardVec.applyQuaternion(preparedScene.quaternion);
    rightVec.applyQuaternion(preparedScene.quaternion);

    let moveDirection = new THREE.Vector3();

    // Set the movement direction based on the input
    if (forward) {
      moveDirection.add(forwardVec);
      action = "walk";
    }
    if (backward) {
      moveDirection.sub(forwardVec);
      action = "walk";
    }
    if (left) {
      moveDirection.add(rightVec);
      action = "walk";
    }
    if (right) {
      moveDirection.sub(rightVec);
      action = "walk";
    }
    if (shift && forward) {
      moveDirection.multiplyScalar(2);
      action = "run";
      setSpeed(30);
    } else {
      setSpeed(15);
    }
    if (jump) {
      action = "jump";
    }

    // Normalize the move direction
    moveDirection.normalize();
    setVelocity(moveDirection);

    // Play the correct animation
    if (currentAction.current !== action) {
      const nextAction = actions[action];
      const current = actions[currentAction.current];
      current?.fadeOut(0.2);
      nextAction.reset().fadeIn(0.2).play();
      currentAction.current = action;
    }
  }, [
    forward,
    backward,
    left,
    right,
    shift,
    jump,
    actions,
    preparedScene.quaternion,
  ]);

  // Move the player
  useFrame((state, delta) => {
    const direction = new THREE.Vector3()
      .copy(velocity)
      .multiplyScalar(delta * speed);
    const newPosition = new THREE.Vector3()
      .copy(preparedScene.position)
      .add(direction);

    // Prevent the player from moving outside the boundaries
    if (
      newPosition.x < -240 ||
      newPosition.x > 240 ||
      newPosition.z < -290 ||
      newPosition.z > 290
    ) {
      direction.multiplyScalar(0);
    }

    // Update the player position
    preparedScene.position.add(direction);

    // Update the camera position
    if (direction.lengthSq() > 0) {
      const lookAtTarget = new THREE.Vector3().addVectors(
        preparedScene.position,
        direction
      );
      preparedScene.lookAt(lookAtTarget);

      const cameraTargetPosition = new THREE.Vector3()
        .copy(preparedScene.position)
        .sub(direction.normalize().multiplyScalar(30))
        .add(new THREE.Vector3(0, 15, 0));
      camera.position.lerp(cameraTargetPosition, 0.05);
      camera.lookAt(preparedScene.position);
    } else {
      camera.lookAt(preparedScene.position);
    }
  });

  return (
    <>
      <OrbitControls ref={controlRef} />
      <primitive object={preparedScene} position={position} scale={[5, 5, 5]} />
    </>
  );
};

Player.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Player;
