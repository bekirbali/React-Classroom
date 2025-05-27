import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const ContentForm = ({ type, id = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    importance: "Low",
    announcementType: "Public",
    isPublished: true,
    publishDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchContent();
    } else {
      if (type === "adminannouncements") {
        setFormData((prev) => ({ ...prev, announcementType: "Admin" }));
      } else if (type === "announcements") {
        setFormData((prev) => ({ ...prev, announcementType: "Public" }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  const fetchContent = async () => {
    try {
      const collectionName = type;
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          ...data,
          imageUrl: data.imageUrl || "",
          publishDate: new Date(data.publishDate.seconds * 1000)
            .toISOString()
            .split("T")[0],
          expiryDate: data.expiryDate
            ? new Date(data.expiryDate.seconds * 1000)
                .toISOString()
                .split("T")[0]
            : "",
          announcementType: type === "adminannouncements" ? "Admin" : "Public",
        });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Error loading content");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const contentData = {
        ...formData,
        publishDate: new Date(formData.publishDate),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        updatedAt: new Date(),
      };

      let targetCollection;
      if (type === "news") {
        targetCollection = "news";
      } else {
        targetCollection =
          formData.announcementType === "Admin"
            ? "adminAnnouncements"
            : "announcements";
      }

      if (type === "news") {
        delete contentData.announcementType;
        delete contentData.importance;
      }
      if (type === "announcements" || type === "adminannouncements") {
        delete contentData.imageUrl;
      }

      if (id) {
        const originalCollection = type;
        const docRef = doc(db, originalCollection, id);
        await updateDoc(docRef, contentData);
      } else {
        await addDoc(collection(db, targetCollection), {
          ...contentData,
          createdAt: new Date(),
        });
      }

      navigate("/admin");
    } catch (error) {
      console.error("Error saving content:", error);
      setError("Error saving content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">
          {id ? `Edit ${type}` : `Create New ${type}`}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows="4"
              value={formData.content}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          {type === "news" && (
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Image URL (optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

          {(type === "announcements" || type === "adminannouncements") && (
            <div>
              <label
                htmlFor="announcementType"
                className="block text-sm font-medium text-gray-700"
              >
                Announcement Type
              </label>
              <select
                id="announcementType"
                name="announcementType"
                value={formData.announcementType}
                onChange={handleChange}
                disabled={!!id}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Public">Public</option>
                <option value="Admin">Admin (Visible to Admins Only)</option>
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="publishDate"
              className="block text-sm font-medium text-gray-700"
            >
              Publish Date
            </label>
            <input
              type="date"
              id="publishDate"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700"
            >
              Expiry Date (optional)
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublished"
              className="ml-2 block text-sm text-gray-900"
            >
              Publish immediately
            </label>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ContentForm;
