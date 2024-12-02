import { Modal } from "flowbite-react";
import PropTypes from "prop-types";

const FormModal = ({
  open,
  setOpen,
  onClose,
  size,
  position,
  headerText,
  children,
}) => {
  // Call the function when the modal is closed
  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <Modal
        show={open}
        onClose={handleClose}
        size={size}
        position={position}
        className="bg-gray-100 bg-opacity-75 dark:bg-opacity-75 dark:bg-gray-900 dark:backdrop-filter backdrop-filter"
      >
        <Modal.Header className="bg-white dark:bg-gray-950 rounded-t-lg px-3 pt-3">
          <span className="text-xl font-semibold text-gray-600 dark:text-gray-400">
            {headerText}
          </span>
        </Modal.Header>
        <Modal.Body className="bg-white dark:bg-gray-950 rounded-b-lg">
          {children}
        </Modal.Body>
      </Modal>
    </>
  );
};

FormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  size: PropTypes.string,
  position: PropTypes.string,
  headerText: PropTypes.string,
  children: PropTypes.node,
};

export default FormModal;
