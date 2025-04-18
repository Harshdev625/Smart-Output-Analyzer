# ⚙️ Smart Output Analyzer

## 🧠 Overview

**Smart Output Analyzer** is a full-stack MERN application designed to process and analyze raw command-line outputs (e.g., `ping`, `netstat`, `ifconfig`). It extracts meaningful insights, visualizes data, and allows exporting results in multiple formats. This tool is ideal for developers, network administrators, and DevOps engineers.

---

## 🧩 Key Features

- 📝 Paste raw terminal output and provide custom instructions.
- 🧠 Automatically extract key data using regex and AI-based processing.
- 📊 Visualize extracted data with bar, pie, or line charts.
- 📤 Export data in formats like `.csv`, `.pdf`, `.txt`, `.doc`, or `.xlsx`.
- ☁️ Cloud-based file storage using Cloudinary.
- 🔗 Download exported files directly from the backend.

---

## 🏗️ Tech Stack

### Backend:

- **Node.js** with **Express**
- **Cloudinary** for file storage
- **PDFKit**, **ExcelJS**, **docx**, and **json2csv** for exporting
- **dotenv** for environment variable management
- **Multer** and **Streamifier** for file handling

### Frontend:

- **React.js** with **Vite**
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API communication

---

## 🛠️ Project Structure

### Backend `/server`

```
server/
├── controllers/
│   ├── commandController.js
│   ├── downloadController.js
│   └── exportController.js
├── routes/
│   ├── command.routes.js
│   ├── download.routes.js
│   └── export.routes.js
├── utils/
│   └── exporters.js
├── app.js
├── server.js
└── .env
```

### Frontend `/client`

```
client/
├── src/
│   ├── components/
│   │   ├── TextInput.jsx
│   │   ├── FormatDropdown.jsx
│   │   └── ChartDisplay.jsx
│   ├── pages/
│   │   └── Home.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── tailwind.config.js
```

---

## 📬 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/smart-output-analyzer.git
   cd smart-output-analyzer
   ```
2. Set up the backend:

   ```bash
   cd server
   npm install
   ```
3. Set up the frontend:

   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. Start the backend:

   ```bash
   cd server
   npm run dev
   ```
2. Start the frontend:

   ```bash
   cd ../client
   npm run dev
   ```
3. Open your browser and navigate to:

   ```
   http://localhost:5173
   ```

---

## 🔄 Workflow

1. Paste terminal output into the text area.
2. Provide a custom instruction for data extraction.
3. Backend processes the input and extracts key data.
4. Visualize the data using charts or export it in various formats.
5. Download the exported file directly from the backend.

---

## 📦 Export Formats

- `.txt` → Plain text summary
- `.csv` → Tabular format for Excel
- `.doc` → Word document
- `.xlsx` → Excel spreadsheet
- `.pdf` → Printable summary

---

## 🧪 Example Input and Output

### Input:

```
Proto  Local Address          Foreign Address        State
TCP    0.0.0.0:80             0.0.0.0:0              LISTENING
TCP    127.0.0.1:5500         0.0.0.0:0              LISTENING
TCP    192.168.1.105:5500     93.184.216.34:443      ESTABLISHED
```

### Extracted Data:

```json
{
  "chartType": "bar",
  "labels": ["ESTABLISHED", "LISTENING", "TOTAL"],
  "data": [1, 2, 3]
}
```

### Exported CSV:

```
State,Count
ESTABLISHED,1
LISTENING,2
TOTAL,3
```

---

## 🚀 Future Improvements

- Auto-detect command type for better accuracy.
- Batch processing for multiple command outputs.
- Enhanced analytics dashboard with more chart types.
- Integration with MongoDB for persistent storage.

---

## 📜 License

This project is licensed under the MIT License.
