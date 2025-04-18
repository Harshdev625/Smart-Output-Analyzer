const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { toTxt, toCsv, toDoc, toExcel, toPdf } = require("../utils/exporters");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formatDataForExport = (data) => {
  const formattedData = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (typeof data[key] === "object") {
        formattedData[key] = data[key]; // Keep it as object for better formatting
      } else {
        try {
          formattedData[key] = JSON.parse(data[key]); // Parse stringified objects
        } catch {
          formattedData[key] = data[key];
        }
      }
    }
  }
  return formattedData;
};

const exportDataController = async (req, res) => {
  const { data, format, filename = "SmartExport" } = req.body;

  if (!data || !format) {
    return res
      .status(400)
      .json({ error: "Missing required fields: data or format" });
  }

  try {
    const formattedData = formatDataForExport(data);
    let fileBuffer;

    switch (format) {
      case "txt":
        fileBuffer = await toTxt(formattedData, filename);
        break;
      case "csv":
        fileBuffer = await toCsv(formattedData, filename);
        break;
      case "doc":
        fileBuffer = await toDoc(formattedData, filename);
        break;
      case "excel":
        fileBuffer = await toExcel(formattedData, filename);
        break;
      case "pdf":
        fileBuffer = await toPdf(formattedData, filename);
        break;
      default:
        return res.status(400).json({ error: "Unsupported export format" });
    }

    if (!fileBuffer) {
      return res.status(500).json({ error: "Failed to generate file buffer" });
    }

    const timestamp = new Date().toISOString().replace(/[^\w\s]/gi, "-");
    const fileNameWithDate = `${filename}_${timestamp}.${format}`;

    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", public_id: fileNameWithDate, format },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });

    // Force file download in frontend by returning the blob and setting headers there
    return res.status(200).json({
      fileUrl: uploadResponse.secure_url,
      filename: fileNameWithDate,
      contentType: getMimeType(format),
    });
  } catch (err) {
    console.error("Export error:", err.message);
    return res
      .status(500)
      .json({ error: "Export failed", details: err.message });
  }
};

const getMimeType = (format) => {
  switch (format) {
    case "txt":
      return "text/plain";
    case "csv":
      return "text/csv";
    case "doc":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "excel":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
};

module.exports = { exportDataController };
