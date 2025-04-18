const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Then, access your environment variables like so
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

const processOutputController = async (req, res) => {
  const { command_output, user_prompt } = req.body;

  if (!command_output || !user_prompt) {
    return res.status(400).json({ error: "Both command_output and user_prompt are required." });
  }

  try {
    const response = await axios.post(EXTERNAL_API_URL, {
      command_output,
      user_prompt,
    });

    return res.json({ response: response.data.data });
  } catch (err) {
    console.error("API error:", err.message);
    return res.status(500).json({ error: "Failed to process command output.", details: err.message });
  }
};

module.exports = { processOutputController };
