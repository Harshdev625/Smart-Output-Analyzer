const { Document, Packer, Paragraph, TextRun } = require("docx");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const { parse } = require("json2csv");

const flattenForExport = (dataObj) => {
  const rows = [];
  for (const category in dataObj) {
    const inner = dataObj[category];
    if (typeof inner === "object") {
      for (const key in inner) {
        rows.push({ Category: category, Key: key, Value: inner[key] });
      }
    } else {
      rows.push({ Category: category, Key: "-", Value: inner });
    }
  }
  return rows;
};

const toTxt = async (data) => {
  let text = "";
  for (const [key, value] of Object.entries(data)) {
    text += `${key}:\n`;
    if (typeof value === "object") {
      for (const [k, v] of Object.entries(value)) {
        text += `  ${k}: ${v}\n`;
      }
    } else {
      text += `  ${value}\n`;
    }
    text += "\n";
  }
  return Buffer.from(text);
};

const toCsv = async (data) => {
  const flattenedData = flattenForExport(data);
  const csv = parse(flattenedData);
  return Buffer.from(csv);
};

const toDoc = async (data) => {
  const children = [];

  children.push(new Paragraph({ text: "Exported Data", heading: "Heading1" }));
  for (const [key, value] of Object.entries(data)) {
    children.push(new Paragraph({ text: `${key}:`, spacing: { after: 100 } }));
    if (typeof value === "object") {
      for (const [k, v] of Object.entries(value)) {
        children.push(new Paragraph({ text: `  ${k}: ${v}` }));
      }
    } else {
      children.push(new Paragraph({ text: `  ${value}` }));
    }
  }

  const doc = new Document({ sections: [{ properties: {}, children }] });
  const buffer = await Packer.toBuffer(doc);
  return buffer;
};

const toExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const flattenedData = flattenForExport(data);
  if (flattenedData.length > 0) {
    const headers = Object.keys(flattenedData[0]);
    worksheet.addRow(headers);
    flattenedData.forEach((item) => worksheet.addRow(Object.values(item)));
  } else {
    worksheet.addRow(["No data"]);
  }

  return await workbook.xlsx.writeBuffer();
};

const toPdf = async (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    doc.fontSize(16).text("Exported Data", { underline: true }).moveDown();

    for (const [key, value] of Object.entries(data)) {
      doc.fontSize(12).text(`${key}:`, { bold: true });
      if (typeof value === "object") {
        for (const [k, v] of Object.entries(value)) {
          doc.text(`  ${k}: ${v}`);
        }
      } else {
        doc.text(`  ${value}`);
      }
      doc.moveDown();
    }

    doc.end();
  });
};

module.exports = { toTxt, toCsv, toDoc, toExcel, toPdf };
