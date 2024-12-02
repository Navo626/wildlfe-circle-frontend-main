import PropTypes from "prop-types";
import { Modal } from "flowbite-react";

const keyBindings = [
  { key: "W / Arrow Up", action: "Move Forward" },
  { key: "S / Arrow Down", action: "Move Backward" },
  { key: "A / Arrow Left", action: "Turn Left" },
  { key: "D / Arrow Right", action: "Turn Right" },
  { key: "Space", action: "Jump" },
  { key: "Shift + W", action: "Run" },
  { key: "Mouse", action: "Look Around" },
  { key: "Esc", action: "Exit" },
];

const KeyBindingsModal = ({ open, setOpen }) => {
  return (
    <>
      <Modal
        show={open}
        size="xl"
        onClose={() => setOpen(false)}
        position={"center"}
        className="rounded-lg backdrop:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 dark:bg-gray-900 dark:backdrop-filter backdrop-filter"
        popup
      >
        <Modal.Header className="bg-gray-100 dark:bg-gray-950 rounded-t-lg" />
        <Modal.Body className="bg-gray-100 dark:bg-gray-950 rounded-b-lg">
          <div className="text-center">
            <div className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Key</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {keyBindings.map((binding, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{binding.key}</td>
                      <td className="border px-4 py-2">{binding.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

KeyBindingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default KeyBindingsModal;
