const FormatDropdown = ({ format, onChange }) => (
  <div className="w-full">
    <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-black mb-2">
      📂 Choose Export Format
    </label>
    <select
      id="format"
      value={format}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 rounded-xl border border-gray-300 dark:border-black/20 bg-white dark:bg-black/10 text-gray-800 dark:text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    >
      <option value="csv">CSV (Comma-separated)</option>
      <option value="txt">TXT (Plain text)</option>
      <option value="pdf">PDF (Document)</option>
      <option value="doc">DOC (Word file)</option>
      {/* <option value="accessdb">AccessDB (Microsoft Access)</option> */}
    </select>
  </div>
);

export default FormatDropdown;
