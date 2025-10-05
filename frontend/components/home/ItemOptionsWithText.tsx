import React, { useState } from 'react';

interface ItemOptionsWithTextProps {
  item: TimelineItem;
  onSave: (itemId: string, values: { [key: string]: string }) => Promise<void>;
  onClose: () => void;
}

export default function ItemOptionsWithText({ item, onSave, onClose }) {
  const [textValues, setTextValues] = useState<{ [key: string]: string }>(
    item.selectedOptions || {}
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(item.id, textValues);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        {item.options?.map((option) => (
          <div key={option.id} className="space-y-2">
            <label className="block font-medium text-gray-700">
              {option.label}
            </label>
            <p className="text-sm text-gray-500">{option.description}</p>
            <textarea
              value={textValues[option.id] || ''}
              onChange={(e) => setTextValues({
                ...textValues,
                [option.id]: e.target.value
              })}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Enter names, one per line"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg
            hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}