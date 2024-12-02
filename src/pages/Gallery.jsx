import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../components/Layouts/Header.jsx";
import Footer from "../components/Layouts/Footer.jsx";
import axios from "axios";
import LightboxDisplay from "../components/Modals/LightboxDisplay.jsx";

const Gallery = () => {
  const [lightboxDisplay, setLightboxDisplay] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const [page, setPage] = useState(1);
  const observer = useRef();

  const lastImageElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const generatePattern = (start, max) => {
    let numbers = [start];
    let current = start;
    let addFour = true;

    while (current <= max) {
      current += addFour ? 4 : 6;
      addFour = !addFour;
      numbers.push(current);
    }

    return numbers;
  };

  const specialIndexes = generatePattern(0, images.length + 10);

  const getGridClasses = (index) => {
    return specialIndexes.includes(index + 1)
      ? "md:col-span-8 h-80"
      : "md:col-span-4 h-80";
  };

  const openLightbox = (src) => {
    setSelectedImage(src);
    setLightboxDisplay(true);
  };

  const closeLightbox = () => {
    setLightboxDisplay(false);
  };

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${urlPrefix}/api/gallery?page=${page}`
        );

        if (response.data.status === true) {
          setIsLoading(false);
          const fetchedImages = response.data.data.data;
          setImages((prevImages) => [...prevImages, ...fetchedImages]);

          const { to, total } = response.data.data;
          setHasMore(to < total);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages().then((r) => r);
  }, [urlPrefix, page]);

  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-8 mx-auto">
        <div className="grid gap-2.5 lg:pb-16 pb-10">
          <h2 className="text-3xl mb-6 text-center font-bold text-gray-800 sm:text-4xl dark:text-white transition duration-500">
            Gallery
          </h2>
          <div className="w-full text-center text-gray-600 dark:text-gray-400 text-lg leading-8 transition duration-500">
            Step into a realm where wildlife comes to life. Explore the beauty
            of nature through our lens. Our gallery is a collection of the most
            exquisite and rare moments captured in the wild.
          </div>
        </div>
        {isLoading && images.length === 0 ? (
          <div className="max-w-7xl px-4 mx-auto">
            <div className="flex flex-col mb-10 animate-pulse">
              <div className="grid md:grid-cols-12 gap-8 lg:mb-11 mb-7">
                <div className="md:col-span-4 h-80 w-full rounded-3xl bg-gray-200 dark:bg-gray-800"></div>
                {/* Skeleton for Image */}
                <div className="md:col-span-8 h-80 w-full rounded-3xl bg-gray-200 dark:bg-gray-800"></div>
                {/* Skeleton for Image */}
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-80 w-full rounded-3xl bg-gray-200 dark:bg-gray-800"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              <div className="grid md:grid-cols-12 gap-8 px-4 ">
                {images.map((image, index) => (
                  <div
                    ref={
                      index === images.length - 1 ? lastImageElementRef : null
                    }
                    key={index}
                    className={`${getGridClasses(
                      index
                    )} w-full rounded-3xl overflow-hidden`}
                  >
                    <img
                      src={urlPrefix + image?.image_path}
                      alt={image?.title}
                      className="object-cover w-full h-full cursor-pointer hover:grayscale transition-all duration-700 ease-in-out"
                      onClick={() => openLightbox(image)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {lightboxDisplay && (
              <LightboxDisplay
                selectedImage={selectedImage}
                embedInfo={true}
                closeLightbox={closeLightbox}
              />
            )}

            {isLoading && (
              <div className="max-w-7xl px-4 pt-8 mx-auto">
                <div className="flex flex-col mb-10 animate-pulse">
                  <div className="grid md:grid-cols-12 gap-8 lg:mb-11 mb-7">
                    <div className="md:col-span-4 h-80 w-full rounded-3xl bg-gray-200 dark:bg-gray-800"></div>
                    {/* Skeleton for Image */}
                    <div className="md:col-span-8 h-80 w-full rounded-3xl bg-gray-200 dark:bg-gray-800"></div>
                    {/* Skeleton for Image */}
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-80 w-full rounded-3xl bg-gray-200 dark:bg-gray-800"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </section>
  );
};

export default Gallery;
