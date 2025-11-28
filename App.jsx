import { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const API_URL = "https://common-czt5.onrender.com/process";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(API_URL, formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        Documents AI
      </h1>

      <div
        {...getRootProps()}
        className="w-full max-w-md p-8 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center cursor-pointer hover:border-pink-500 transition"
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-white font-semibold">{file.name}</p>
        ) : (
          <p className="text-gray-400">Drag & drop a file here, or click to select</p>
        )}
      </div>

      <button
        onClick={handleUpload}
        className="mt-6 px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl font-bold text-lg transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>

      {result && (
        <div className="mt-8 w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-purple-400">Extracted Text</h2>
          <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto">{result.extractedText}</pre>

          <h2 className="text-2xl font-semibold text-purple-400">Automation Ideas</h2>
          <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto">{result.automation}</pre>

          <a
            href={result.fileURL}
            target="_blank"
            className="inline-block mt-4 text-pink-400 hover:text-pink-600 font-semibold"
          >
            Open Uploaded File
          </a>
        </div>
      )}
    </div>
  );
}
