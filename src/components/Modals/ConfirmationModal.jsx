import PropTypes from "prop-types";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const ConfirmationModal = ({ open, setOpen, children, onConfirm }) => {
  return (
    <>
      <Modal
        show={open}
        size="xl"
        onClose={() => setOpen(false)}
        position={"top-center"}
        className="backdrop:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 dark:bg-gray-900 dark:backdrop-filter backdrop-filter"
        popup
      >
        <Modal.Header className="bg-gray-100 dark:bg-gray-950 rounded-t-lg" />
        <Modal.Body className="bg-gray-100 dark:bg-gray-950 rounded-b-lg">
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <div className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">
              {children}
            </div>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-red-600 hover:!bg-red-800 dark:bg-red-800 dark:hover:!bg-red-600"
                onClick={() => {
                  setOpen(false);
                  onConfirm();
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button
                className="bg-gray-200 hover:!bg-gray-300 dark:bg-gray-800 dark:hover:!bg-gray-900 text-gray-800 dark:text-gray-200"
                onClick={() => setOpen(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmationModal;
