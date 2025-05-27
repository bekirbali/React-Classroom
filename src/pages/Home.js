import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom styles for slider
const sliderStyles = `
  .slider-container {
    position: relative;
    padding-bottom: 30px;
  }
  .slider-container .slick-dots {
    bottom: 0;
  }
  .news-slider {
    position: relative;
    padding: 0 50px 30px;
  }
  .news-slider .slick-prev, 
  .news-slider .slick-next {
    z-index: 10;
    width: 40px;
    height: 40px;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }
  .news-slider .slick-prev {
    left: -20px;
  }
  .news-slider .slick-next {
    right: -20px;
  }
  .news-slider .slick-prev:before,
  .news-slider .slick-next:before {
    font-size: 30px;
    opacity: 0.8;
    color: #3B82F6;
  }
  .news-slider .slick-track {
    display: flex;
    padding: 10px 0;
  }
  .news-slider .slick-track .slick-slide {
    height: inherit;
    display: flex;
  }
  .news-slider .slick-track .slick-slide > div {
    width: 100%;
    height: 100%;
    display: flex;
  }
  .news-slider .slick-dots {
    bottom: -10px;
  }
`;

// Add placeholder image URL
const DEFAULT_NEWS_IMAGE =
  "https://placehold.co/600x400/e2e8f0/1e293b?text=News+Image";

// Slider images
const SLIDER_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Welcome to Our Modern Learning Environment",
  },
  {
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Discover Your Potential",
  },
  {
    url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Excellence in Education",
  },
];

const Home = () => {
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [privateAnnouncements, setPrivateAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { user } = useAuth();
  // console.log("[Home.js] User from useAuth:", user); // Keeping this one, but commented for now to reduce noise unless specifically needed

  // Countdown Effect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date("2025-06-15T09:30:00+03:00").getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  useEffect(() => {
    const fetchContent = async () => {
      // console.log("[Home.js] fetchContent triggered. User:", user); // Keep, but commented for now
      try {
        // Fetch news
        const newsQuery = query(
          collection(db, "news"),
          where("isPublished", "==", true),
          orderBy("publishDate", "desc")
        );
        const newsSnapshot = await getDocs(newsQuery);
        const newsData = newsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch announcements
        const announcementsQuery = query(
          collection(db, "announcements"),
          where("isPublished", "==", true),
          orderBy("publishDate", "desc")
        );
        const announcementsSnapshot = await getDocs(announcementsQuery);
        const announcementsData = announcementsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch private announcements if a user is logged in
        if (user) {
          // console.log("[Home.js] User is logged in. Fetching private announcements."); // Keep, but commented for now
          const privateAnnouncementsQuery = query(
            collection(db, "adminAnnouncements"),
            orderBy("publishDate", "desc")
          );
          const privateAnnouncementsSnapshot = await getDocs(
            privateAnnouncementsQuery
          );
          const privateAnnouncementsData =
            privateAnnouncementsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          setPrivateAnnouncements(privateAnnouncementsData);
          // console.log("[Home.js] Private announcements for logged-in user fetched:", privateAnnouncementsData); // Keep, but commented for now
        } else {
          // console.log("[Home.js] User is NOT logged in or user object is not as expected.", user); // Keep, but commented for now
          setPrivateAnnouncements([]);
        }

        setNews(newsData);
        setAnnouncements(announcementsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching content:", error);
        setLoading(false);
      }
    };

    fetchContent();
  }, [user]);

  // New useEffect for logging display-critical states less frequently
  useEffect(() => {
    if (!loading) {
      // Only log after initial loading is done
      console.log("---------------------------------------------------------");
      console.log("[Home.js] Display State Check (after loading/data change):");
      console.log("  User Object:", user);
      console.log("  Is Admin?:", user && user.isAdmin === true);
      console.log(
        "  Private Announcements Count:",
        privateAnnouncements.length
      );
      console.log("  Private Announcements Data:", privateAnnouncements);
      console.log("  Public Announcements Count:", announcements.length);
      console.log("---------------------------------------------------------");
    }
  }, [loading, user, privateAnnouncements, announcements]); // Re-run if these change

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <style>{sliderStyles}</style>
      {/* Hero Slider Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative mb-8"
      >
        <div className="slider-container">
          <Slider {...sliderSettings}>
            {SLIDER_IMAGES.map((image, index) => (
              <div key={index} className="relative h-[600px]">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h2 className="text-white text-4xl md:text-6xl font-bold text-center px-4">
                    {image.title}
                  </h2>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </motion.div>

      {/* Countdown Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="py-12 px-4 bg-gradient-to-r from-blue-500 to-purple-600"
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            LGS' ye Kalan Süre
          </h2>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-4xl font-bold" key={countdown.days}>
                {String(countdown.days).padStart(2, "0")}
              </div>
              <div className="text-sm mt-1">Gün</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-4xl font-bold" key={countdown.hours}>
                {String(countdown.hours).padStart(2, "0")}
              </div>
              <div className="text-sm mt-1">Saat</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-4xl font-bold" key={countdown.minutes}>
                {String(countdown.minutes).padStart(2, "0")}
              </div>
              <div className="text-sm mt-1">Dakika</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-4xl font-bold" key={countdown.seconds}>
                {String(countdown.seconds).padStart(2, "0")}
              </div>
              <div className="text-sm mt-1">Saniye</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Hero Info Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Welcome to Our Learning Community
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We are dedicated to providing a dynamic and inclusive learning
            environment that fosters academic excellence, critical thinking, and
            personal growth. Our mission is to empower students with the
            knowledge and skills they need to succeed in an ever-changing world.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                Expert Faculty
              </h3>
              <p className="text-gray-600">
                Learn from experienced educators passionate about teaching
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-800">
                Modern Facilities
              </h3>
              <p className="text-gray-600">
                Access to state-of-the-art learning resources and technology
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-purple-800">
                Student Success
              </h3>
              <p className="text-gray-600">
                Comprehensive support for your educational journey
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="px-4 py-8">
        {/* Important Announcements Section (Public - visible to all) - MOVED TO TOP */}
        {announcements.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 py-8 px-4"
          >
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Important Announcements
              </h2>
              <div className="grid gap-6">
                {announcements.map((announcement) => (
                  <motion.div
                    key={announcement.id}
                    className={`p-6 rounded-lg shadow-md text-left ${
                      announcement.importance === "High"
                        ? "bg-red-50 border-l-4 border-red-500"
                        : announcement.importance === "Medium"
                        ? "bg-yellow-50 border-l-4 border-yellow-500"
                        : "bg-blue-50 border-l-4 border-blue-500"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600">{announcement.content}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      Published:{" "}
                      {new Date(
                        announcement.publishDate.seconds * 1000
                      ).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* News Section - Should appear second */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
          <div className="relative px-8">
            <Slider
              {...{
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 6000,
                arrows: true,
                className: "news-slider",
                responsive: [
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                    },
                  },
                  {
                    breakpoint: 640,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                    },
                  },
                ],
              }}
            >
              {news.map((item) => (
                <div key={item.id} className="px-3">
                  <motion.div
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative h-48">
                      <img
                        src={item.imageUrl || DEFAULT_NEWS_IMAGE}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = DEFAULT_NEWS_IMAGE;
                        }}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold mb-2 break-words">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 break-words flex-grow">
                        {item.content}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <div className="text-sm text-gray-500">
                          {new Date(
                            item.publishDate.seconds * 1000
                          ).toLocaleDateString()}
                        </div>
                        <button
                          onClick={() => setSelectedNews(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* Member Announcements Section (Visible only to logged-in users) - MOVED TO BOTTOM */}
        {user && privateAnnouncements.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }} // Adjusted delay
            className="mb-12 py-8 px-4" // Removed bg-sky-50
          >
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Member Announcements
              </h2>
              <div className="grid gap-6">
                {privateAnnouncements.map((announcement) => (
                  <motion.div
                    key={announcement.id}
                    className={`p-6 rounded-lg shadow-md text-left ${
                      announcement.importance === "High"
                        ? "bg-red-50 border-l-4 border-red-500"
                        : announcement.importance === "Medium"
                        ? "bg-yellow-50 border-l-4 border-yellow-500"
                        : "bg-blue-50 border-l-4 border-blue-500"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-700">{announcement.content}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      Published:{" "}
                      {new Date(
                        announcement.publishDate.seconds * 1000
                      ).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {/* News Modal */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedNews.imageUrl || DEFAULT_NEWS_IMAGE}
                  alt={selectedNews.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 break-words">
                  {selectedNews.title}
                </h2>
                <p className="text-gray-600 whitespace-normal break-words">
                  {selectedNews.content}
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  Published:{" "}
                  {new Date(
                    selectedNews.publishDate.seconds * 1000
                  ).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
