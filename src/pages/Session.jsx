import Header from "../components/Layouts/Header.jsx";
import Footer from "../components/Layouts/Footer.jsx";
import {useEffect, useState} from "react";
import SidebarDrawer from "../components/Drawers/SidebarDrawer.jsx";
import EventCalendar from "../components/Calendar/EventCalendar.jsx";
import {format} from "date-fns";
import {Link} from "react-router-dom";
import useAxios from "../hooks/useAxios.jsx";

const Session = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const axiosInstance = useAxios();

  const fetchSessions = async () => {
    try {
      const response = await axiosInstance.get(`/api/sessions`);
      if (response.data.status === true) {
        setEvents(response.data.data);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  useEffect(() => {
    fetchSessions().then((r) => r);
  }, []);

  const handleEventClick = (details) => {
    setEventDetails(details);
    setShowInfoModal(true);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <section className="flex-grow">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-12 mx-auto">
            <h1 className="text-3xl mb-8 text-center font-bold text-gray-800 sm:text-4xl dark:text-white transition duration-500">
              Sessions
            </h1>
            <EventCalendar data={events} onEventClick={handleEventClick} />
          </div>
        </section>
        <Footer />
      </div>

      <SidebarDrawer
        open={showInfoModal}
        setOpen={setShowInfoModal}
        title={"Event Details"}
      >
        {eventDetails && (
          <div>
            <p>
              <span className="font-bold">Title:</span>&nbsp;
              {eventDetails.title}
            </p>
            <p>
              <span className="font-bold">Description:</span>&nbsp;
              {eventDetails.extendedProps.description}
            </p>
            <p>
              <span className="font-bold">Host:</span>&nbsp;
              {eventDetails.extendedProps.host}
            </p>
            <p>
              <span className="font-bold">Start:</span>&nbsp;
              {format(new Date(eventDetails.start), "PPpp")}
            </p>
            <p>
              <span className="font-bold">End:</span>&nbsp;
              {format(new Date(eventDetails.end), "PPpp")}
            </p>
            <p>
              <span className="font-bold">Link:</span>&nbsp;
              <Link
                to={eventDetails.extendedProps.link}
                target="_blank"
                className="text-gray-800 dark:text-gray-200 hover:underline"
              >
                {eventDetails.extendedProps.link}
              </Link>
            </p>
          </div>
        )}
      </SidebarDrawer>
    </>
  );
};

export default Session;
