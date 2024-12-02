import PropTypes from "prop-types";

const LightboxDisplay = ({ selectedImage, embedInfo, closeLightbox }) => {
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;

  return (
    selectedImage && (
      <div
        className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-80 flex py-6 px-3 justify-center items-center"
        onClick={closeLightbox}
      >
        <span
          className="text-white text-3xl absolute top-5 right-10 cursor-pointer"
          onClick={closeLightbox}
        >
          &times;
        </span>
        {embedInfo ? (
          <div className="relative">
            <img
              src={
                urlPrefix +
                (Array.isArray(selectedImage.image_path)
                  ? selectedImage.image_path[0]
                  : selectedImage.image_path)
              }
              alt={selectedImage?.title}
              className="lg:max-w-7xl lg:max-h-[40rem] rounded-lg"
            />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 rounded-bl-lg">
              <p>Title: {selectedImage?.title}</p>
              <p>Captured by: {selectedImage?.captured_by}</p>
            </div>
          </div>
        ) : (
          <img
            src={
              urlPrefix +
              (Array.isArray(selectedImage.image_path)
                ? selectedImage.image_path[0]
                : selectedImage.image_path)
            }
            alt={selectedImage?.title}
            className="lg:max-w-7xl lg:max-h-[40rem] rounded-lg"
          />
        )}
      </div>
    )
  );
};

LightboxDisplay.propTypes = {
  selectedImage: PropTypes.object,
  embedInfo: PropTypes.bool,
  closeLightbox: PropTypes.func,
};

export default LightboxDisplay;
