'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Loader2, CheckCircle2, MapPin, Phone, Clock } from 'lucide-react';
import { submitContact } from '@/api/other';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await submitContact({ name, email, message });
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      setSubmitError(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-10 md:py-14 overflow-hidden">
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-3xl font-bold text-black">
                Liên Hệ Với Chúng Tôi
              </h1>
              <p className="pt-4 text-gray-600 mx-auto">
                Chúng tôi luôn lắng nghe và hỗ trợ bạn. Để lại thông tin, chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </p>
            </div>

            {/* <div className="grid md:grid-cols-2 gap-12 lg:gap-16"> */}
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và Tên
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nguyenvana@gmail.com"
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Tin Nhắn
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hãy cho chúng tôi biết bạn cần hỗ trợ gì..."
                        rows={6}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all resize-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {submitError}
                    </div>
                  )}
                  
                  {submitSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.</span>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Gửi Tin Nhắn</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              {/* <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                  <h2 className="font-serif text-3xl text-gray-900 mb-8">
                    Thông Tin Liên Hệ
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                        <p className="text-gray-600">contact@vemotnha.com</p>
                        <p className="text-gray-600">support@vemotnha.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Điện Thoại</h3>
                        <p className="text-gray-600">+84 123 456 789</p>
                        <p className="text-gray-600">+84 987 654 321</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Địa Chỉ</h3>
                        <p className="text-gray-600">123 Đường ABC</p>
                        <p className="text-gray-600">Quận 1, TP. Hồ Chí Minh</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Giờ Làm Việc</h3>
                        <p className="text-gray-600">Thứ 2 - Thứ 6: 9:00 - 18:00</p>
                        <p className="text-gray-600">Thứ 7: 9:00 - 12:00</p>
                        <p className="text-gray-600">Chủ Nhật: Nghỉ</p>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Quick Info Card */}
                {/* <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                  <h3 className="font-serif text-2xl mb-4">
                    Cần Hỗ Trợ Khẩn Cấp?
                  </h3>
                  <p className="mb-6 opacity-90">
                    Chúng tôi cam kết phản hồi mọi yêu cầu trong vòng 24 giờ. Đối với các vấn đề cần xử lý gấp, vui lòng gọi trực tiếp hotline của chúng tôi.
                  </p>
                  <a
                    href="tel:+84123456789"
                    className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Gọi Ngay</span>
                  </a>
                </div>
              </div> */}
            {/* </div> */}
          </div>
        </section>
      </main>
    </>
  );
}
