import Header from "../components/Layouts/Header.jsx";
import Footer from "../components/Layouts/Footer.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/content.css";

const News = () => {
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [news, setNews] = useState(null);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${urlPrefix}/api/news?id=${id}`);

      if (response.data.status === true) {
        setNews(response.data.data);

        // Check if response contains images
        if (response.data.data.image_path) {
          let imagesFromResponse = Array.isArray(response.data.data.image_path)
            ? response.data.data.image_path
            : [response.data.data.image_path];

          setImages(imagesFromResponse);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNews().then((r) => r);
  }, [urlPrefix]);

  // Determine number of columns based on number of images
  const numImages = images.length;
  let numColumns;
  if (numImages === 1) {
    numColumns = 1;
  } else if (numImages === 2) {
    numColumns = 2;
  } else {
    numColumns = 3;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="max-w-5xl px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto">
          <div className="space-y-5 md:space-y-8">
            <div className="space-y-3">
              {!isLoading && (
                <h2 className="flex justify-center text-2xl font-bold md:text-3xl dark:text-white transition duration-500">
                  {news.title}
                </h2>
              )}
            </div>

            {/* Conditionally render news body */}
            {!isLoading && (
              <div
                className="text-lg text-gray-800 dark:text-neutral-200 transition duration-500 content-body text-justify"
                dangerouslySetInnerHTML={{ __html: news.body }}
              />
            )}

            {/* Conditionally render images */}
            {!isLoading && images.length !== 0 && (
              <div
                className={`grid grid-cols-1 gap-4 sm:grid-cols-${numColumns}`}
              >
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={urlPrefix + image}
                    alt={news.title}
                    className="object-cover w-full h-full rounded-lg shadow-lg"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default News;
