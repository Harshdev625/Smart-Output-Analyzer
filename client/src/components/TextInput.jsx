const TextInput = ({ value, onChange, placeholder, id, label, className = "" }) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label htmlFor={id} className={`text-sm font-medium ${className}`}>
        {label}
      </label>
    )}
    <textarea
      id={id}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-4 rounded-xl bg-white/80 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 transition"
      rows={6}
    />
  </div>
);

export default TextInput;
