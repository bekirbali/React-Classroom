import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

const FileUpload = ({
  onFileUpload,
  folder = "uploads",
  fileTypes = "*",
  maxSizeMB = 50,
}) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check file size (convert maxSizeMB to bytes)
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create a unique filename with timestamp
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      // Upload the file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          setError(`Upload failed: ${error.message}`);
          setUploading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setSuccess(true);
          setUploading(false);

          // Call the callback with file info
          if (onFileUpload) {
            onFileUpload({
              url: downloadURL,
              name: file.name,
              originalName: file.name,
              type: file.type,
              size: file.size,
              uploadedAt: new Date().toISOString(),
              path: `${folder}/${fileName}`,
            });
          }

          // Reset the file input
          setFile(null);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      setError(`Error: ${error.message}`);
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select File to Upload
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept={fileTypes}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          disabled={uploading}
        />
        <p className="mt-1 text-xs text-gray-500">
          Maximum file size: {maxSizeMB}MB
        </p>
      </div>

      {file && (
        <div className="mb-4">
          <p className="text-sm">
            <span className="font-medium">Selected file:</span> {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {(file.size / (1024 * 1024)).toFixed(2)}MB
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          File uploaded successfully!
        </div>
      )}

      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm mt-1">{uploadProgress}%</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
          !file || uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
};

export default FileUpload;
