import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { motion } from "framer-motion";
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
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

        setNews(newsData);
        setAnnouncements(announcementsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching content:", error);
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

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
        {/* Announcements Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Important Announcements
          </h2>
          <div className="grid gap-6">
            {announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                className={`p-6 rounded-lg shadow-md ${
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
                <h3 className="text-xl font-semibold mb-2">
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
        </section>

        {/* News Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.content}</p>
                  <div className="text-sm text-gray-500">
                    {new Date(
                      item.publishDate.seconds * 1000
                    ).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
