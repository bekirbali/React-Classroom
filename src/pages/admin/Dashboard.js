import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { linkifyComprehensive } from "../../utils/linkify";

const Dashboard = () => {
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [adminAnnouncements, setAdminAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("news");
  const [isPasswordVerified, setIsPasswordVerified] = useState(() => {
    return sessionStorage.getItem("isAdminVerified") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [targetDateInput, setTargetDateInput] = useState("");
  const [isActiveCountdown, setIsActiveCountdown] = useState(true);

  // Admin panel şifresi - gerçek uygulamalarda environment variable kullanılmalı
  const ADMIN_PASSWORD = "--";

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsPasswordVerified(true);
      sessionStorage.setItem("isAdminVerified", "true");
      setPasswordError("");
    } else {
      setPasswordError("Yanlış şifre! Ana sayfaya yönlendiriliyorsunuz...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  useEffect(() => {
    if (isPasswordVerified) {
      fetchContent();
      fetchCountdown();
    }
  }, [isPasswordVerified]);

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

  const fetchCountdown = async () => {
    try {
      const docRef = doc(db, "settings", "countdown");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTargetDateInput(data.targetDate || "");
        setIsActiveCountdown(data.isActive !== false);
      }
    } catch (error) {
      console.error("Error fetching countdown settings:", error);
    }
  };

  const handleSaveCountdown = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "settings", "countdown");
      await setDoc(docRef, {
        targetDate: targetDateInput,
        isActive: isActiveCountdown,
        updatedAt: new Date(),
      });
      alert("Geri sayım süresi başarıyla güncellendi!");
      setIsTimeModalOpen(false);
    } catch (error) {
      console.error("Error saving countdown:", error);
      alert("Geri sayım süresi güncellenirken bir hata oluştu.");
    }
  };

  const handleClearCountdown = async () => {
    if (window.confirm("Geri sayımı temizlemek istediğinize emin misiniz?")) {
      try {
        const docRef = doc(db, "settings", "countdown");
        await setDoc(docRef, {
          targetDate: "",
          isActive: false,
          updatedAt: new Date(),
        });
        setTargetDateInput("");
        setIsActiveCountdown(false);
        alert("Geri sayım başarıyla temizlendi!");
        setIsTimeModalOpen(false);
      } catch (error) {
        console.error("Error clearing countdown:", error);
      }
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

  // Şifre doğrulanmadıysa şifre giriş formunu göster
  if (!isPasswordVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Admin Panel Erişimi
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Devam etmek için admin şifresini giriniz
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
              <div>
                <label htmlFor="password" className="sr-only">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  autoFocus
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Admin şifresi"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>
              {passwordError && (
                <div className="text-red-600 text-sm text-center">
                  {passwordError}
                </div>
              )}
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Giriş Yap
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

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
            <button
              onClick={() => setIsTimeModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"
            >
              Add Time
            </button>
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
                      {linkifyComprehensive(item.content)}
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

      <AnimatePresence>
        {isTimeModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl relative"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Geri Sayım Süresi Ayarla
              </h2>
              <form onSubmit={handleSaveCountdown} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hedef Tarih ve Saat
                  </label>
                  <input
                    type="datetime-local"
                    value={targetDateInput}
                    onChange={(e) => setTargetDateInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="is-active"
                    type="checkbox"
                    checked={isActiveCountdown}
                    onChange={(e) => setIsActiveCountdown(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is-active" className="ml-2 block text-sm text-gray-900 select-none">
                    Geri Sayım Aktif
                  </label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  {targetDateInput && (
                    <button
                      type="button"
                      onClick={handleClearCountdown}
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                      Temizle
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsTimeModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
