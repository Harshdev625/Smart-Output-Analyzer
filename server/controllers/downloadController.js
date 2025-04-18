const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const path = require("path");

const downloadFileController = async (req, res) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(400).json({ error: "Filename is required" });
  }

  try {
    const fileExtension = path.extname(filename).toLowerCase();
    const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/v1/${filename}`;

    const fileResponse = await axios.get(cloudinaryUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    let contentType = "application/octet-stream";

    switch (fileExtension) {
      case ".txt":
        contentType = "text/plain";
        break;
      case ".csv":
        contentType = "text/csv";
        break;
      case ".doc":
      case ".docx":
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case ".xlsx":
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
      case ".pdf":
        contentType = "application/pdf";
        break;
    }

    res.setHeader("Content-Type", contentType);

    fileResponse.data.pipe(res);
  } catch (error) {
    console.error("Download error:", error.message);
    res
      .status(500)
      .json({
        error: "Failed to fetch file from Cloudinary",
        details: error.message,
      });
  }
};

module.exports = { downloadFileController };
