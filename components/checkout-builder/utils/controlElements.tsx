// SliderInput: A slider with a number input and unit label
export const SliderInput: React.FC<{
    label?: string;
    value: string;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    onChange: (val: string) => void;
  }> = ({ label, value, min = 0, max = 100, step = 1, unit = 'px', onChange }) => {
    // Safely parse the value, fallback to 0 if not a number
    let numericValue = parseInt((value || '').replace(unit, ''));
    if (isNaN(numericValue)) numericValue = 0;
    return (
      <div className="mb-3">
        {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={numericValue}
            onChange={e => onChange(`${e.target.value}${unit}`)}
            className="flex-1 slider"
          />
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={numericValue}
            onChange={e => onChange(`${e.target.value}${unit}`)}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
    );
  };
  
  // SelectInput: A dropdown select
  export const SelectInput: React.FC<{
    label?: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (val: string) => void;
  }> = ({ label, value, options, onChange }) => (
    <div className="mb-3">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
  
  // ColorInput: A color picker with text input
  export const ColorInput: React.FC<{
    label?: string;
    value: string;
    onChange: (val: string) => void;
  }> = ({ label, value, onChange }) => (
    <div className="mb-3">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#e5e7eb"
        />
      </div>
    </div>
  );

// SwitchInput: A toggle switch for boolean values
export const SwitchInput: React.FC<{
  label?: string;
  value: boolean;
  onChange: (val: boolean) => void;
  description?: string;
}> = ({ label, value, onChange, description }) => (
  <div className="mb-3">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          value ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  </div>
);

// TextInput: A simple text input field
export const TextInput: React.FC<{
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
  description?: string;
}> = ({ label, value, placeholder, onChange, description }) => (
  <div className="mb-3">
    {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
  </div>
);