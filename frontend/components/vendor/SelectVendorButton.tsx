"use client";

import React, { useState } from 'react';
import { API_BASE_URL, ENDPOINTS } from '@/api/config';
import { Check, Database, X } from 'lucide-react';
import Toast from '@/components/common/Toast';

interface Props {
  vendorId: string;
  timelineId: string;
}

export default function SelectVendorButton({ vendorId, timelineId }: Props) {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleSelect = async () => {
    if (!timelineId) {
      showToast('Vui lòng cung cấp timelineId', 'error');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
      return;
    }

    if (!vendorId) {
      showToast('Vendor ID là bắt buộc', 'error');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus('saving');

      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.TIMELINE.SELECT_VENDOR}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ vendorId, timelineId }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data?.message || 'Thêm nhà cung cấp thất bại', 'error');
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 5000);
      } else {
        showToast(data.message || 'Đã chọn nhà cung cấp', 'success');
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch {
      showToast('Network error', 'error');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        aria-label={loading ? 'Đang lưu...' : 'Chọn nhà cung cấp này'}
        onClick={handleSelect}
        disabled={loading || saveStatus === 'saving'}
        className={`fixed bottom-6 right-6 z-50 text-white px-3 py-3 rounded-lg font-semibold transition-all shadow-md ${
          loading || saveStatus === 'saving'
            ? 'bg-gray-400 cursor-not-allowed'
            : saveStatus === 'success'
            ? 'bg-green-500 hover:bg-green-600'
            : saveStatus === 'error'
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
        }`}
      >
        {loading || saveStatus === 'saving' ? (
          <span className="flex items-center gap-2">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span className="hidden sm:inline">Đang lưu...</span>
          </span>
        ) : saveStatus === 'success' ? (
          <span className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            <span className="hidden sm:inline">Đã lưu!</span>
          </span>
        ) : saveStatus === 'error' ? (
          <span className="flex items-center gap-2">
            <X className="h-5 w-5" />
            <span className="hidden sm:inline">Lưu thất bại</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <span className="hidden sm:inline">Chọn nhà cung cấp này!</span>
          </span>
        )}
      </button>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
}
