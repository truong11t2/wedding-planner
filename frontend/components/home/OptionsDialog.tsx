import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface OptionsDialogProps {
  item: any;
  onSave: (itemId: string, values: string | { [key: string]: string }) => Promise<void>;
  onClose: () => void;
}

export default function OptionsDialog({ item, onSave, onClose }: OptionsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<{ [key: string]: string }>(item.selectedOptions || {});
  const [selectedOption, setSelectedOption] = useState(item.selectedOption || '');

  const handleSubmit = async () => {
    if (item.options?.[0]?.isTextInput) {
      await onSave(item.id, values);
    } else {
      await onSave(item.id, selectedOption);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100"
      >
        <span className="font-semibold text-gray-900">{item.title}</span>
        <ChevronDown 
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="p-6 space-y-4">
          {item.options?.[0]?.isTextInput ? (
            // Text input options
            <div className="space-y-4">
              {item.options.map((option) => (
                <div key={option.id} className="space-y-2">
                  <label className="block font-medium text-gray-700">
                    {option.label}
                  </label>
                  <textarea
                    value={values[option.id] || ''}
                    onChange={(e) => setValues({
                      ...values,
                      [option.id]: e.target.value
                    })}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder={option.description}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Radio options
            <div className="space-y-2">
              {item.options?.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-pink-50"
                >
                  <input
                    type="radio"
                    name="option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-3">{option.label}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}