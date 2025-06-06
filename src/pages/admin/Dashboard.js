import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [adminAnnouncements, setAdminAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("news");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch news
      const newsQuery = query(
        collection(db, "news"),
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
        orderBy("publishDate", "desc")
      );
      const announcementsSnapshot = await getDocs(announcementsQuery);
      const announcementsData = announcementsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch admin announcements
      const adminAnnouncementsQuery = query(
        collection(db, "adminAnnouncements"),
        orderBy("publishDate", "desc")
      );
      const adminAnnouncementsSnapshot = await getDocs(adminAnnouncementsQuery);
      const adminAnnouncementsData = adminAnnouncementsSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      setNews(newsData);
      setAnnouncements(announcementsData);
      setAdminAnnouncements(adminAnnouncementsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching content:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        let collectionName = type;
        if (type === "adminAnnouncements") {
          collectionName = "adminAnnouncements";
        } else if (type === "announcements") {
          collectionName = "announcements";
        } else {
          collectionName = "news";
        }
        await deleteDoc(doc(db, collectionName, id));
        fetchContent();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="space-x-4">
            <Link
              to="/admin/news/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add News
            </Link>
            <Link
              to="/admin/announcements/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Add Public Announcement
            </Link>
            <Link
              to="/admin/adminannouncements/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
            >
              Add Admin Announcement
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                className={`${
                  activeTab === "news"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } w-1/3 py-4 px-1 text-center border-b-2 font-medium`}
                onClick={() => setActiveTab("news")}
              >
                News
              </button>
              <button
                className={`${
                  activeTab === "announcements"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } w-1/3 py-4 px-1 text-center border-b-2 font-medium`}
                onClick={() => setActiveTab("announcements")}
              >
                Public Announcements
              </button>
              <button
                className={`${
                  activeTab === "adminAnnouncements"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } w-1/3 py-4 px-1 text-center border-b-2 font-medium`}
                onClick={() => setActiveTab("adminAnnouncements")}
              >
                Admin Announcements
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {(activeTab === "news"
              ? news
              : activeTab === "announcements"
              ? announcements
              : adminAnnouncements
            ).map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-4 sm:px-6 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(
                        item.publishDate.seconds * 1000
                      ).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <Link
                      to={`/admin/${
                        activeTab === "announcements"
                          ? "announcements"
                          : activeTab === "adminAnnouncements"
                          ? "adminannouncements"
                          : activeTab
                      }/edit/${item.id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, activeTab)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
