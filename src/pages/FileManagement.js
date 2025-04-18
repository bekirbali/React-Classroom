import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../config/firebase";
import FileUpload from "../components/FileUpload";

const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "files"), orderBy("uploadedAt", "desc"));
      const snapshot = await getDocs(q);
      const filesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFiles(filesData);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (fileData) => {
    try {
      // Add file metadata to Firestore
      await addDoc(collection(db, "files"), {
        ...fileData,
        uploadedAt: new Date().toISOString(),
      });

      // Refresh the files list
      fetchFiles();
    } catch (error) {
      console.error("Error saving file metadata:", error);
    }
  };

  const handleDeleteFile = async (fileId, filePath) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        setDeleting(true);

        // Delete from Storage
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);

        // Delete from Firestore
        await deleteDoc(doc(db, "files", fileId));

        // Update state
        setFiles(files.filter((file) => file.id !== fileId));
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Failed to delete file. Please try again.");
      } finally {
        setDeleting(false);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  const getFileIcon = (type) => {
    if (type.includes("image")) return "📷";
    if (type.includes("video")) return "🎬";
    if (type.includes("audio")) return "🎵";
    if (type.includes("pdf")) return "📄";
    if (type.includes("zip") || type.includes("rar") || type.includes("tar"))
      return "🗜️";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("excel") || type.includes("sheet")) return "📊";
    if (type.includes("presentation") || type.includes("powerpoint"))
      return "📽️";
    return "📁";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">File Management</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload New Files</h2>
        <FileUpload
          onFileUpload={handleFileUpload}
          folder="classroom-files"
          maxSizeMB={100}
        />
        <p className="mt-4 text-sm text-gray-500">
          Supported files: Images, documents, videos, audio files, zip archives,
          and more.
          <br />
          Maximum file size: 100MB
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Files</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No files uploaded yet. Upload your first file above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {getFileIcon(file.type)}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900 truncate max-w-xs">
                            {file.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {file.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDeleteFile(file.id, file.path)}
                        disabled={deleting}
                        className="text-red-600 hover:text-red-900"
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManagement;
