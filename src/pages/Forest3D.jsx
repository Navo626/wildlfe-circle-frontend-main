import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useProgress } from "@react-three/drei";
import { Button } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import { lineWobble } from "ldrs";
import Light from "../components/3D/Light.jsx";
import Ground from "../components/3D/Ground.jsx";
import Forest from "../components/3D/Forest.jsx";
import Giraffe from "../components/3D/animals/Giraffe.jsx";
import Elephant from "../components/3D/animals/Elephant.jsx";
import Rhinoceros from "../components/3D/animals/Rhinoceros.jsx";
import Cow from "../components/3D/animals/Cow.jsx";
import Bear from "../components/3D/animals/Bear.jsx";
import Gazelle from "../components/3D/animals/Gazelle.jsx";
import Player from "../components/3D/Player.jsx";
import ConfirmationModal from "../components/Modals/ConfirmationModal.jsx";
import KeyBindingsModal from "../components/3D/KeyBindingsModal.jsx";
import GiraffeInfo from "../components/3D/Information/GiraffeInfo.jsx";
import GazelleInfo from "../components/3D/Information/GazelleInfo.jsx";
import ElephantInfo from "../components/3D/Information/ElephantInfo.jsx";
import RhinoInfo from "../components/3D/Information/RhinoInfo.jsx";
import CowInfo from "../components/3D/Information/CowInfo.jsx";
import BearInfo from "../components/3D/Information/BearInfo.jsx";
import SidebarDrawer from "../components/Drawers/SidebarDrawer.jsx";

const animalInfo = [
  {
    name: "Giraffe",
    component: <GiraffeInfo />,
    audio: new Audio("./audio/Giraffe.mp3"),
  },
  {
    name: "Elephant",
    component: <ElephantInfo />,
    audio: new Audio("./audio/Elephant.mp3"),
  },
  {
    name: "Rhinoceros",
    component: <RhinoInfo />,
    audio: new Audio("./audio/Rhinoceros.mp3"),
  },
  {
    name: "Cow",
    component: <CowInfo />,
    audio: new Audio("./audio/Cow.mp3"),
  },
  {
    name: "Bear",
    component: <BearInfo />,
    audio: new Audio("./audio/Bear.mp3"),
  },
  {
    name: "Gazelle",
    component: <GazelleInfo />,
    audio: new Audio("./audio/Gazelle.mp3"),
  },
];

const Forest3D = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { progress } = useProgress();
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleOpenKeyBindingsModal = () => {
    setShowConfirmationModal(true);
    setShowInfoModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowModal(true);
        setShowInfoModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleAnimalClick = (animalName) => {
    setSelectedAnimal(animalName);
    setShowInfoModal(true);
    animalInfo.find((animal) => animal.name === animalName).audio.play();
  };

  lineWobble.register();

  return (
    <>
      {progress < 100 && (
        <>
          <div className="flex items-center justify-center min-h-screen bg-neutral-900">
            <l-line-wobble
              size="80"
              stroke="5"
              bg-opacity="0.1"
              speed="1.75"
              color="white"
            />
          </div>
        </>
      )}

      {progress === 100 && (
        <>
          <Button
            className="fixed top-5 right-3 z-50 !ring-0 !bg-transparent"
            onClick={handleOpenKeyBindingsModal}
          >
            Key Bindings
          </Button>

          <Button
            className="fixed top-5 z-50 !ring-0 !bg-transparent"
            onClick={setShowModal.bind(this, true)}
          >
            <IoMdClose className="size-6" />
          </Button>

          <KeyBindingsModal
            open={showConfirmationModal}
            setOpen={setShowConfirmationModal}
          />
          <ConfirmationModal
            open={showModal}
            setOpen={setShowModal}
            onConfirm={() => navigate("/")}
          >
            <p>Are you sure you want to exit?</p>
          </ConfirmationModal>
        </>
      )}

      <SidebarDrawer
        open={showInfoModal}
        setOpen={setShowInfoModal}
        title={selectedAnimal}
      >
        {animalInfo.map((info, index) => {
          if (info.name === selectedAnimal) {
            return (
              <React.Fragment key={index}>{info.component}</React.Fragment>
            );
          }
          return null;
        })}
      </SidebarDrawer>

      <div className="h-screen bg-neutral-900">
        <Canvas shadows={true}>
          <OrbitControls />
          <Light />
          <Ground />
          <Forest />
          <Giraffe
            position={[0, 0, 0]}
            onClick={() => handleAnimalClick("Giraffe")}
          />
          <Elephant
            position={[50, 0, 100]}
            onClick={() => handleAnimalClick("Elephant")}
          />
          <Rhinoceros
            position={[-50, 0, 170]}
            onClick={() => handleAnimalClick("Rhinoceros")}
          />
          <Cow
            position={[-130, 0, -100]}
            onClick={() => handleAnimalClick("Cow")}
          />
          <Bear
            position={[100, 0, -170]}
            onClick={() => handleAnimalClick("Bear")}
          />
          <Gazelle
            position={[-20, 0, 0]}
            onClick={() => handleAnimalClick("Gazelle")}
          />
          <Player position={[0, 0, 0]} />
        </Canvas>
      </div>
    </>
  );
};

export default Forest3D;
