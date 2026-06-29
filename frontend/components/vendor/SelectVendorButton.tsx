"use client";

import React, { useState } from 'react';
import { API_BASE_URL, ENDPOINTS } from '@/api/config';
import { Heart } from 'lucide-react';
import Toast from '@/components/common/Toast';

interface Props {
  vendorId: string;
  timelineId: string;
}

export default function SelectVendorButton({ vendorId, timelineId }: Props) {
  const [loading, setLoading] = useState(false);
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
      return;
    }

    if (!vendorId) {
      showToast('Vendor ID là bắt buộc', 'error');
      return;
    }

    try {
      setLoading(true);

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
      } else {
        showToast(data.message || 'Đã chọn nhà cung cấp', 'success');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        aria-label={loading ? 'Đang lưu...' : 'Chọn nhà cung cấp này'}
        onClick={handleSelect}
        disabled={loading}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-md"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span className="hidden sm:inline">Đang lưu...</span>
          </span>
        ) : (
          <>
            <Heart className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">Chọn nhà cung cấp này!</span>
          </>
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
