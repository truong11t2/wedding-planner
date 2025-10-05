import React, { useState } from 'react';

interface ItemOptionsProps {
  item: TimelineItem;
  onSave: (itemId: string, optionId: string) => Promise<void>;
  onClose: () => void;
}

export default function ItemOptions({ item, onSave, onClose }) {
  const [selectedOption, setSelectedOption] = useState(item.selectedOption);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedOption) return;
    setIsSaving(true);
    try {
      await onSave(item.id, selectedOption);
      onClose();
    } catch (error) {
      console.error('Failed to save option:', error);
      // Add error handling here
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
      
      <div className="space-y-3">
        {item.options?.map((option) => (
          <label 
            key={option.id}
            className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors
              ${selectedOption === option.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}"
          >
            <input
              type="radio"
              name="option"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="mt-1 text-pink-600 focus:ring-pink-500"
            />
            <div className="ml-3">
              <p className="font-medium text-gray-900">{option.label}</p>
              {option.description && (
                <p className="text-sm text-gray-500">{option.description}</p>
              )}
              {option.price && (
                <p className="text-sm font-semibold text-pink-600 mt-1">{option.price}</p>
              )}
            </div>
          </label>
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
          disabled={!selectedOption || isSaving}
          className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg
            hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}