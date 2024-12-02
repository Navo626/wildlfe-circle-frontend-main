import Header from "../components/Layouts/Header.jsx";
import Footer from "../components/Layouts/Footer.jsx";
import { FaCalendarCheck, FaUsers } from "react-icons/fa";
import { MdOutlineWork } from "react-icons/md";
import CountUp from "react-countup";

const Home = () => {
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="pattern">
        <div className="max-w-7xl mx-auto ">
          <div className="relative overflow-hidden">
            <div className="pb-80 pt-18 sm:pb-40 pt-12 lg:pb-48 lg:pt-40">
              <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                <div className="sm:max-w-lg">
                  <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white transition duration-500">
                    Begin your adventure with{" "}
                    <span className="text-gray-50 dark:text-black transition duration-500">
                      Wildlife-Circle
                    </span>
                  </h1>
                </div>
                <div>
                  <div className="mt-10">
                    {/* Decorative image grid */}
                    <div className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
                      <div className="absolute transform sm:left-1/2 sm:top-5 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                        <div className="flex items-center space-x-6">
                          <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                              <img
                                src={urlPrefix + "/storage/home/6.jpg"}
                                alt=""
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                              <img
                                src={urlPrefix + "/storage/home/5.jpg"}
                                alt=""
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                          </div>
                          <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                              <img
                                src={urlPrefix + "/storage/home/3.jpg"}
                                alt=""
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                              <img
                                src={urlPrefix + "/storage/home/7.jpg"}
                                alt=""
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                              <img
                                src={urlPrefix + "/storage/home/1.jpg"}
                                alt=""
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                          </div>
                          <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                              <img
                                src={urlPrefix + "/storage/home/2.jpg"}
                                alt=""
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                              <img
                                src={urlPrefix + "/storage/home/4.jpg"}
                                alt=""
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full px-4 xl:px-0 pt-16 pb-8 md:pb-0 mx-auto">
            <div className="p-4 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-y-20 gap-x-12">
                <div className="relative text-center">
                  <FaUsers className="flex-shrink-0 size-6 sm:size-8 text-primary-600 mx-auto" />
                  <div className="mt-3 sm:mt-5">
                    <h3 className="text-4xl font-bold text-gray-700 dark:text-white transition duration-500">
                      <CountUp end="2000" />+
                    </h3>
                    <p className="mt-1 text-md sm:text-base text-gray-600 dark:text-neutral-400 transition duration-500">
                      Registered Members
                    </p>
                  </div>
                </div>

                <div className="relative text-center">
                  <FaCalendarCheck className="flex-shrink-0 size-6 sm:size-8 text-primary-600 mx-auto" />
                  <div className="mt-3 sm:mt-5">
                    <h3 className="text-4xl font-bold text-gray-700 dark:text-white transition duration-500">
                      <CountUp end="2000" />+
                    </h3>
                    <p className="mt-1 text-md sm:text-base text-gray-600 dark:text-neutral-400 transition duration-500">
                      Sessions Conducted
                    </p>
                  </div>
                </div>

                <div className="relative text-center">
                  <MdOutlineWork className="flex-shrink-0 size-6 sm:size-8 text-primary-600 mx-auto" />
                  <div className="mt-3 sm:mt-5">
                    <h3 className="text-4xl font-bold text-gray-700 dark:text-white transition duration-500">
                      <CountUp end="500" />+
                    </h3>
                    <p className="mt-1 text-md sm:text-base text-gray-600 dark:text-neutral-400 transition duration-500">
                      Projects Completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
