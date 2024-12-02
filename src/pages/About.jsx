import Header from "../components/Layouts/Header.jsx";
import Footer from "../components/Layouts/Footer.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaFacebook, FaGoogleScholar } from "react-icons/fa6";
import { FaResearchgate } from "react-icons/fa";
import { IoMailOpen } from "react-icons/io5";

const About = () => {
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${urlPrefix}/api/about`);

        if (response.data.status === true) {
          setMembers(response.data.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMembers();
  }, [urlPrefix]);

  return (
    <>
      <section className="flex flex-col min-h-screen">
        <Header />
        <section className="flex-grow">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-12 mx-auto">
            <div>
              <h1 className="text-3xl mb-8 text-center font-bold text-gray-800 sm:text-4xl dark:text-white transition duration-500">
                About Us
              </h1>
              <p className="my-4 text-gray-600 dark:text-gray-400 text-md leading-8 transition duration-500">
                Wildlife circle is a club functioning under the Department of
                Zoology, the Faculty of Applied Sciences, University of Sri
                Jayewardenepura. The club was initiated in the year 2016. Though
                it is new to the university environment, it conducted various
                projects during these few years.
              </p>
              <p className="my-4 text-gray-600 dark:text-gray-400 text-md leading-8 transition duration-500">
                The fauna inhabiting the planet earth is experiencing drastic
                declines in abundance, occurrence and distribution. While many
                species facing the risk of extinction, many species have already
                gone extinct. Therefore, with the purpose of conserving nature
                for the future generations, the Wildlife Circle of USJP acts
                actively with the objectives of,
              </p>
              <ul className="my-4 ml-3 text-gray-600 dark:text-gray-400 text-md leading-8 transition duration-500">
                <li>
                  1. Taking meaningful actions regarding conservation of fauna.
                </li>
                <li>2. knowledge of members on areas of Wildlife</li>
                <li>
                  3. Helping students/employers to cope with stress of
                  studying/working by indulging in activities of the club.
                </li>
                <li>
                  4. Helping to develop harmony among student members of the
                  local Universities and external members, by being the forum
                  for members from different occupations, faculties, schools,
                  cultures and academic programmes to act together as a team.
                </li>
                <li>
                  5. Promotion of Wildlife photographic ability among members.
                </li>
              </ul>
              <p className="my-4 text-gray-600 dark:text-gray-400 text-md leading-8 transition duration-500">
                Under the Department of Zoology students are able to do their
                duty to mother nature and planet earth by providing their
                maximum contribution to the conservation of animal species
                through joining hands with us.
              </p>
            </div>
          </div>

          {isLoading ? (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 animate-pulse">
                  <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto transition duration-500"></div>
                  {/* Skeleton for Heading with dark mode style */}
                </div>
                <div className="flex justify-center flex-wrap gap-8 mx-auto">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="block w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-4 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse transition duration-500"
                    >
                      <div className="relative mb-6">
                        <div className="w-40 h-40 rounded-full mx-auto bg-gray-300 dark:bg-gray-700 transition duration-500"></div>
                        {/* Skeleton for Image with dark mode style */}
                      </div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4 mx-auto transition duration-500"></div>
                      {/* Skeleton for Name with dark mode style */}
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto mb-3 transition duration-500"></div>
                      {/* Skeleton for Position with dark mode style */}
                      <div className="flex justify-center my-3 gap-3">
                        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded transition duration-500"></div>
                        {/* Skeleton for Social Icon with dark mode style */}
                        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded transition duration-500"></div>
                        {/* Skeleton for Social Icon with dark mode style */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {members?.team && members?.team?.length > 0 && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px:8">
                  <div className="mb-12">
                    <h2 className="font-manrope text-4xl text-center font-bold text-gray-800 dark:text-gray-300 transition duration-500">
                      Executive Committee
                    </h2>
                  </div>
                  <div className="flex justify-center flex-wrap gap-8 mx-auto">
                    {members?.team &&
                      members?.team?.map((person, idx) => (
                        <div
                          key={idx}
                          className="block group w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-4 rounded-lg transition-all duration-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-lg"
                        >
                          <div className="relative mb-6">
                            <img
                              src={urlPrefix + person.image_path}
                              alt={person.name}
                              className="w-40 h-40 rounded-full mx-auto border-4 border-transparent group-hover:border-primary-600 transition-all duration-500 object-cover"
                            />
                          </div>
                          <h4 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-300 mb-2 capitalize transition-all duration-500 group-hover:text-primary-600">
                            {`${person.honorary_title}. ${person.name}`}
                          </h4>
                          <span className="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-400">
                            {person.position}
                          </span>
                          <div className="flex justify-center my-3 gap-3">
                            {person.social_facebook && (
                              <a
                                href={`https://facebook.com/${person.social_facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <FaFacebook className="w-5 h-5" />
                              </a>
                            )}
                            {person.social_researchgate && (
                              <a
                                href={`https://researchgate.net/profile/${person.social_researchgate}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <FaResearchgate className="w-5 h-5" />
                              </a>
                            )}
                            {person.social_scholar && (
                              <a
                                href={`https://scholar.google.com/citations?user=${person.social_scholar}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <FaGoogleScholar className="w-5 h-5" />
                              </a>
                            )}
                            {person.email && (
                              <a
                                href={`mailto:${person.email}`}
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <IoMailOpen className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {members?.advisors && members?.advisors?.length > 0 && (
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px:8">
                  <div className="mb-12">
                    <h2 className="font-manrope text-4xl text-center font-bold text-gray-800 dark:text-gray-300 transition duration-500">
                      Advisory Panel
                    </h2>
                  </div>
                  <div className="flex justify-center flex-wrap gap-8 mx-auto">
                    {members?.advisors &&
                      members?.advisors?.map((person, idx) => (
                        <div
                          key={idx}
                          className="block group w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-4 rounded-lg transition-all duration-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-lg"
                        >
                          <div className="relative mb-6">
                            <img
                              src={urlPrefix + person.image_path}
                              alt={`${person.first_name} ${person.last_name}`}
                              className="w-40 h-40 rounded-full mx-auto border-4 border-transparent group-hover:border-primary-600 transition-all duration-500 object-cover"
                            />
                          </div>
                          <h4 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-300 mb-2 capitalize transition-all duration-500 group-hover:text-primary-600">
                            {`${person.honorary_title}. ${person.name}`}
                          </h4>
                          <span className="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-400">
                            {person.position}
                          </span>
                          <div className="flex justify-center my-3 gap-3">
                            {person.social_facebook && (
                              <a
                                href={`https://facebook.com/${person.social_facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <FaFacebook className="w-5 h-5" />
                              </a>
                            )}
                            {person.social_researchgate && (
                              <a
                                href={`https://researchgate.net/profile/${person.social_researchgate}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <FaResearchgate className="w-5 h-5" />
                              </a>
                            )}
                            {person.social_scholar && (
                              <a
                                href={`https://scholar.google.com/citations?user=${person.social_scholar}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <FaGoogleScholar className="w-5 h-5" />
                              </a>
                            )}
                            {person.email && (
                              <a
                                href={`mailto:${person.email}`}
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <IoMailOpen className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {members?.presidents && members?.presidents?.length > 0 && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px:8">
                  <div className="mb-12">
                    <h2 className="font-manrope text-4xl text-center font-bold text-gray-800 dark:text-gray-300 transition duration-500">
                      Past Presidents
                    </h2>
                  </div>
                  <div className="flex justify-center flex-wrap gap-8 mx-auto">
                    {members?.presidents &&
                      members?.presidents?.map((person, idx) => (
                        <div
                          key={idx}
                          className="block group w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-4 rounded-lg transition-all duration-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-lg"
                        >
                          <div className="relative mb-6">
                            <img
                              src={urlPrefix + person.image_path}
                              alt={`${person.first_name} ${person.last_name}`}
                              className="w-40 h-40 rounded-full mx-auto border-4 border-transparent group-hover:border-primary-600 transition-all duration-500 object-cover"
                            />
                          </div>
                          <h4 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-300 mb-2 capitalize transition-all duration-500 group-hover:text-primary-600">
                            {`${person.honorary_title}. ${person.name}`}
                          </h4>
                          <span className="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-400">
                            {person.position}
                          </span>
                          <div className="flex justify-center my-3 gap-3">
                            {person.social_facebook && (
                              <a
                                href={`https://facebook.com/${person.social_facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <FaFacebook className="w-5 h-5" />
                              </a>
                            )}
                            {person.social_researchgate && (
                              <a
                                href={`https://researchgate.net/profile/${person.social_researchgate}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <FaResearchgate className="w-5 h-5" />
                              </a>
                            )}
                            {person.social_scholar && (
                              <a
                                href={`https://scholar.google.com/citations?user=${person.social_scholar}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <FaGoogleScholar className="w-5 h-5" />
                              </a>
                            )}
                            {person.email && (
                              <a
                                href={`mailto:${person.email}`}
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-800 transition duration-300"
                              >
                                <IoMailOpen className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
        <Footer />
      </section>
    </>
  );
};

export default About;
