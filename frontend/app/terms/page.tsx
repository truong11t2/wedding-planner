import React from 'react';

export default function TermsOfUsePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Điều Khoản Sử Dụng</h1>
        
        <div className="prose prose-pink max-w-none">
          <p className="text-gray-600 mb-6">
            Cập nhật lần cuối: {new Date("2026-01-12").toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Chấp Nhận Điều Khoản</h2>
            <p className="text-gray-700 mb-4">
              Bằng cách truy cập và sử dụng dịch vụ Về Một Nhà ("Dịch vụ"), bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Mô Tả Dịch Vụ</h2>
            <p className="text-gray-700 mb-4">
              Về Một Nhà cung cấp nền tảng lập kế hoạch đám cưới trực tuyến, bao gồm:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Công cụ tạo lịch trình đám cưới tự động</li>
              <li>Quản lý ngân sách và chi phí</li>
              <li>Danh sách công việc cần làm</li>
              <li>Quản lý danh sách khách mời</li>
              <li>Thư viện nhà cung cấp dịch vụ đám cưới</li>
              <li>Bài viết và hướng dẫn về lập kế hoạch đám cưới</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Tài Khoản Người Dùng</h2>
            <p className="text-gray-700 mb-4">
              Để sử dụng đầy đủ các tính năng của Dịch vụ, bạn có thể cần tạo một tài khoản. Bạn cam kết:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
              <li>Bảo mật mật khẩu và thông tin tài khoản của bạn</li>
              <li>Chịu trách nhiệm cho tất cả các hoạt động diễn ra dưới tài khoản của bạn</li>
              <li>Thông báo ngay lập tức cho chúng tôi về bất kỳ việc sử dụng trái phép nào</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Quyền Sở Hữu Trí Tuệ</h2>
            <p className="text-gray-700 mb-4">
              Tất cả nội dung, tính năng và chức năng của Dịch vụ, bao gồm nhưng không giới hạn ở văn bản, đồ họa, logo, biểu tượng, hình ảnh và phần mềm, thuộc sở hữu của Về Một Nhà hoặc các nhà cung cấp nội dung và được bảo vệ bởi luật bản quyền quốc tế.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Nội Dung Người Dùng</h2>
            <p className="text-gray-700 mb-4">
              Bạn giữ quyền sở hữu đối với bất kỳ nội dung nào bạn đăng tải lên Dịch vụ. Tuy nhiên, bằng cách đăng tải nội dung, bạn cấp cho chúng tôi quyền sử dụng, sao chép, sửa đổi và hiển thị nội dung đó để cung cấp và cải thiện Dịch vụ.
            </p>
            <p className="text-gray-700 mb-4">
              Bạn cam kết rằng nội dung của bạn:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Không vi phạm quyền của bên thứ ba</li>
              <li>Không chứa nội dung bất hợp pháp, khiêu dâm hoặc xúc phạm</li>
              <li>Không chứa vi-rút hoặc mã độc hại</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Hành Vi Bị Cấm</h2>
            <p className="text-gray-700 mb-4">
              Khi sử dụng Dịch vụ, bạn không được:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Vi phạm bất kỳ luật hoặc quy định hiện hành nào</li>
              <li>Mạo danh bất kỳ cá nhân hoặc tổ chức nào</li>
              <li>Gửi spam hoặc nội dung quảng cáo không mong muốn</li>
              <li>Can thiệp hoặc làm gián đoạn Dịch vụ</li>
              <li>Thu thập thông tin người dùng khác mà không có sự cho phép</li>
              <li>Sử dụng Dịch vụ cho mục đích thương mại mà không có sự cho phép</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Dịch Vụ Bên Thứ Ba</h2>
            <p className="text-gray-700 mb-4">
              Dịch vụ có thể chứa liên kết đến các trang web hoặc dịch vụ của bên thứ ba. Chúng tôi không chịu trách nhiệm về nội dung, chính sách bảo mật hoặc thực tiễn của bất kỳ trang web hoặc dịch vụ bên thứ ba nào.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Từ Chối Bảo Đảm</h2>
            <p className="text-gray-700 mb-4">
              Dịch vụ được cung cấp "nguyên trạng" và "sẵn có". Chúng tôi không đảm bảo rằng Dịch vụ sẽ không bị gián đoạn, an toàn hoặc không có lỗi. Bạn sử dụng Dịch vụ với rủi ro của riêng mình.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Giới Hạn Trách Nhiệm</h2>
            <p className="text-gray-700 mb-4">
              Về Một Nhà sẽ không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng Dịch vụ.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Chấm Dứt</h2>
            <p className="text-gray-700 mb-4">
              Chúng tôi có quyền chấm dứt hoặc tạm ngưng quyền truy cập của bạn vào Dịch vụ ngay lập tức, không cần thông báo trước, vì bất kỳ lý do nào, bao gồm nhưng không giới hạn ở việc vi phạm các Điều khoản này.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Thay Đổi Điều Khoản</h2>
            <p className="text-gray-700 mb-4">
              Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào. Việc tiếp tục sử dụng Dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Luật Áp Dụng</h2>
            <p className="text-gray-700 mb-4">
              Các điều khoản này được điều chỉnh bởi và giải thích theo luật pháp của Việt Nam, không tính đến các nguyên tắc xung đột pháp luật.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Liên Hệ</h2>
            <p className="text-gray-700 mb-4">
              Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản Sử dụng này, vui lòng liên hệ với chúng tôi qua:
            </p>
            <ul className="list-none text-gray-700 mb-4 ml-4">
              <li>Email: support@vemotnha.com</li>
              {/* <li>Điện thoại: (028) 1234-5678</li> */}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
