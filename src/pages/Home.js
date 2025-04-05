import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { motion } from "framer-motion";

const Home = () => {
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Welcome to Our Classroom</h1>

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
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
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
      </motion.div>
    </div>
  );
};

export default Home;
