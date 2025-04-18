import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import TextInput from "../components/TextInput";
import FormatDropdown from "../components/FormatDropdown";
import ChartDisplay from "../components/ChartDisplay";
import axios from "axios";
import { MoonLoader } from "react-spinners";

const themes = [
  { gradient: "from-indigo-500 to-pink-500", text: "text-white" },
  { gradient: "from-emerald-400 to-cyan-500", text: "text-black" },
  { gradient: "from-rose-400 to-orange-400", text: "text-black" },
  { gradient: "from-yellow-400 to-red-500", text: "text-yellow-900" },
  { gradient: "from-teal-500 to-lime-500", text: "text-teal-900" },
];

const Home = () => {
  const [commandOutput, setCommandOutput] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [format, setFormat] = useState("csv");
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [charts, setCharts] = useState([]);
  const [themeIndex, setThemeIndex] = useState(() => Math.floor(Math.random() * themes.length));
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState({});
  const [downloadLink, setDownloadLink] = useState("");

  const { gradient, text: currentTextColor } = themes[themeIndex];

  const shuffleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % themes.length);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError(null);
    setResponseData(null);
    setCharts([]);
    setDownloadLink("");
    setIsExporting(false);
    setCopied({});
    setIsLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/command/process", {
        command_output: commandOutput,
        user_prompt: userPrompt,
      });

      const parsed = data.response;
      setResponseData(parsed.data || {});
      setCharts(parsed.charts || []);
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong while analyzing.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!responseData) return;
  
    setIsExporting(true);
    setError(null);
    setDownloadLink("");
  
    try {
      const payload =
        typeof responseData === "object"
          ? JSON.parse(JSON.stringify(responseData))
          : responseData;
  
      const res = await axios.post("http://localhost:5000/api/export/", {
        data: payload,
        format,
        filename: `${Date.now()}`,
      });
  
      const cloudinaryUrl = res.data.fileUrl;  // This is the URL returned from Cloudinary
      if (!cloudinaryUrl) throw new Error("No file URL returned");
  
      setDownloadLink(cloudinaryUrl);  // Set the URL to the download link
    } catch (err) {
      console.error("Export error:", err);
      setError("❌ Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  const triggerBackendDownload = async (filename) => {
    const response = await axios.get(`http://localhost:5000/api/download/${filename}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleCopy = (value, key) => {
    const stringified = typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
    navigator.clipboard.writeText(stringified).then(() => {
      setCopied((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 1500);
    });
  };

  const handleFormatChange = (newFormat) => {
    setFormat(newFormat);
    setDownloadLink("");
    setIsExporting(false);
    setError(null);
  };

  const triggerDownload = async () => {
    if (!downloadLink) return;

    try {
      const urlParts = downloadLink.split("/");
      const filename = urlParts[urlParts.length - 1]; // Extract filename from Cloudinary URL

      await triggerBackendDownload(filename); // Use backend route for file download
    } catch (err) {
      console.error("Download failed:", err);
      setError("❌ File download failed.");
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} px-4 py-10`}>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className={`text-center ${currentTextColor}`}>
          <h1 className="text-5xl sm:text-6xl font-extrabold drop-shadow-xl">⚙️ Smart Output Analyzer</h1>
          <p className="mt-4 text-lg max-w-xl mx-auto">
            Analyze system command outputs and turn them into beautiful data insights.
          </p>
          <button
            onClick={shuffleTheme}
            className="mt-4 px-4 py-2 text-sm bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition"
          >
            🔁 Shuffle Theme
          </button>
        </div>

        <form
          onSubmit={handleAnalyze}
          className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl p-6 sm:p-10 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="commandInput" className={`block mb-1 font-semibold ${currentTextColor}`}>
                🧾 Command Output
              </label>
              <TextInput
                id="commandInput"
                value={commandOutput}
                onChange={setCommandOutput}
                placeholder="Paste your command output here"
              />
            </div>
            <div>
              <label htmlFor="promptInput" className={`block mb-1 font-semibold ${currentTextColor}`}>
                💬 User Instruction
              </label>
              <TextInput
                id="promptInput"
                value={userPrompt}
                onChange={setUserPrompt}
                placeholder="Describe what you want to extract"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition"
            disabled={isLoading}
          >
            {isLoading ? <MoonLoader size={18} color="#000" /> : "🔍 Analyze Output"}
          </button>

          {error && <p className="text-red-600 font-semibold">{error}</p>}
        </form>

        {responseData && (
          <>
            <div className="bg-white/50 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Extracted Output</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(responseData).map(([key, value]) => (
                  <div
                    key={key}
                    className="relative bg-white p-4 rounded-xl shadow-md border border-gray-200 overflow-hidden"
                  >
                    <p className="font-semibold text-sm text-rose-600 uppercase mb-2 tracking-wide">{key}</p>
                    <pre className="text-gray-900 text-sm whitespace-pre-wrap break-words max-h-40 overflow-auto pr-6">
                      {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                    </pre>
                    <button
                      onClick={() => handleCopy(value, key)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                      title="Copy"
                    >
                      {copied[key] ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                ))}
              </div>

              {charts.length > 0 && (
                <div className="mt-10 space-y-10">
                  <h3 className="text-xl font-semibold text-center mb-2 text-gray-700">📊 Visualizations</h3>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                    {charts.map((chart, index) => (
                      <ChartDisplay
                        key={index}
                        data={{
                          title: chart.title,
                          labels: chart.labels || [],
                          values: chart.data,
                          chartType: chart.chartType,
                          chartColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/50 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">📁 Export Options</h2>
              <FormatDropdown format={format} onChange={handleFormatChange} />

              <button
                onClick={handleExport}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-4 mt-4 rounded-xl text-xl font-semibold shadow-lg hover:bg-opacity-90"
                disabled={isExporting}
              >
                {isExporting ? <MoonLoader size={24} color="#ffffff" /> : "💾 Export Data"}
              </button>

              {isExporting && (
                <p className="text-sm text-gray-600 mt-2">Generating <b>.{format}</b> file...</p>
              )}

              {downloadLink && !isExporting && (
                <div className="mt-6 text-center">
                  <button
                    onClick={triggerDownload}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow"
                  >
                    🖱️ Download File
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
