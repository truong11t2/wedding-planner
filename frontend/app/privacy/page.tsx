import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Chính Sách Bảo Mật</h1>
        
        <div className="prose prose-pink max-w-none">
          <p className="text-gray-600 mb-6">
            Cập nhật lần cuối: {new Date("2026-01-12").toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Giới Thiệu</h2>
            <p className="text-gray-700 mb-4">
              Về Một Nhà ("chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng dịch vụ lập kế hoạch đám cưới của chúng tôi.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Thông Tin Chúng Tôi Thu Thập</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">2.1. Thông Tin Bạn Cung Cấp</h3>
            <p className="text-gray-700 mb-4">
              Khi bạn đăng ký và sử dụng dịch vụ của chúng tôi, chúng tôi có thể thu thập:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Thông tin tài khoản: Họ tên, địa chỉ email, mật khẩu (dạng mã hóa)</li>
              <li>Thông tin đám cưới: Ngày cưới, địa điểm, ngân sách dự kiến</li>
              <li>Thông tin khách mời: Tên, địa chỉ email, số điện thoại (nếu bạn chọn quản lý danh sách khách mời)</li>
              {/* <li>Thông tin thanh toán: Thông tin thẻ tín dụng, địa chỉ thanh toán (nếu có)</li> */}
              <li>Nội dung bạn tạo: Ghi chú, ảnh, danh sách công việc</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">2.2. Thông Tin Tự Động Thu Thập</h3>
            <p className="text-gray-700 mb-4">
              Khi bạn sử dụng dịch vụ, chúng tôi tự động thu thập:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Thông tin thiết bị: Loại thiết bị, hệ điều hành, trình duyệt</li>
              <li>Thông tin sử dụng: Trang bạn truy cập, thời gian sử dụng, tính năng được sử dụng</li>
              <li>Địa chỉ IP và dữ liệu vị trí</li>
              <li>Cookie và công nghệ theo dõi tương tự</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">2.3. Thông Tin Từ Bên Thứ Ba</h3>
            <p className="text-gray-700 mb-4">
              Nếu bạn đăng nhập qua mạng xã hội (Google, Facebook), chúng tôi có thể nhận thông tin từ họ như tên, email và ảnh đại diện theo cài đặt quyền riêng tư của bạn.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
            <p className="text-gray-700 mb-4">
              Chúng tôi sử dụng thông tin của bạn để:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Cung cấp và duy trì dịch vụ của chúng tôi</li>
              <li>Tạo và quản lý tài khoản của bạn</li>
              <li>Cá nhân hóa trải nghiệm của bạn</li>
              {/* <li>Gửi thông báo về lịch trình, deadline và cập nhật quan trọng</li>
              <li>Xử lý giao dịch thanh toán</li> */}
              <li>Cải thiện và phát triển dịch vụ mới</li>
              <li>Phân tích xu hướng và hành vi người dùng</li>
              <li>Gửi email marketing (chỉ khi bạn đồng ý)</li>
              <li>Phát hiện và ngăn chặn gian lận, lạm dụng</li>
              <li>Tuân thủ nghĩa vụ pháp lý</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Chia Sẻ Thông Tin</h2>
            <p className="text-gray-700 mb-4">
              Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.1. Nhà Cung Cấp Dịch Vụ</h3>
            <p className="text-gray-700 mb-4">
              Chúng tôi chia sẻ thông tin với các nhà cung cấp dịch vụ giúp chúng tôi vận hành, như:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Dịch vụ lưu trữ đám mây</li>
              <li>Nhà cung cấp dịch vụ email</li>
              <li>Bộ xử lý thanh toán</li>
              <li>Công cụ phân tích</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.2. Yêu Cầu Pháp Lý</h3>
            <p className="text-gray-700 mb-4">
              Chúng tôi có thể tiết lộ thông tin nếu được yêu cầu bởi pháp luật hoặc để bảo vệ quyền lợi hợp pháp của chúng tôi.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.3. Với Sự Đồng Ý Của Bạn</h3>
            <p className="text-gray-700 mb-4">
              Chúng tôi có thể chia sẻ thông tin cho các mục đích khác với sự đồng ý rõ ràng của bạn.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Bảo Mật Dữ Liệu</h2>
            <p className="text-gray-700 mb-4">
              Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin của bạn:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Mã hóa dữ liệu khi truyền tải (SSL/TLS)</li>
              <li>Mã hóa mật khẩu (bcrypt)</li>
              <li>Kiểm soát truy cập hạn chế</li>
              <li>Giám sát bảo mật thường xuyên</li>
              <li>Sao lưu dữ liệu định kỳ</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Tuy nhiên, không có phương thức truyền tải hoặc lưu trữ điện tử nào an toàn 100%. Chúng tôi không thể đảm bảo tuyệt đối về bảo mật.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookie và Công Nghệ Theo Dõi</h2>
            <p className="text-gray-700 mb-4">
              Chúng tôi sử dụng cookie và công nghệ tương tự để:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Ghi nhớ đăng nhập và cài đặt của bạn</li>
              <li>Phân tích hiệu suất và sử dụng</li>
              <li>Cá nhân hóa nội dung và quảng cáo</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt của mình.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Quyền Của Bạn</h2>
            <p className="text-gray-700 mb-4">
              Bạn có các quyền sau đối với thông tin cá nhân của mình:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Quyền truy cập:</strong> Yêu cầu bản sao dữ liệu cá nhân của bạn</li>
              <li><strong>Quyền sửa đổi:</strong> Cập nhật hoặc sửa thông tin không chính xác</li>
              <li><strong>Quyền xóa:</strong> Yêu cầu xóa dữ liệu của bạn</li>
              <li><strong>Quyền hạn chế:</strong> Yêu cầu hạn chế xử lý dữ liệu</li>
              <li><strong>Quyền di chuyển:</strong> Nhận dữ liệu ở định dạng có thể đọc được bằng máy</li>
              <li><strong>Quyền phản đối:</strong> Từ chối nhận email marketing</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email: privacy@vemotnha.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Lưu Trữ Dữ Liệu</h2>
            <p className="text-gray-700 mb-4">
              Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Cung cấp dịch vụ cho bạn</li>
              <li>Tuân thủ nghĩa vụ pháp lý</li>
              <li>Giải quyết tranh chấp</li>
              <li>Thực thi thỏa thuận của chúng tôi</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Sau khi bạn xóa tài khoản, chúng tôi sẽ xóa hoặc ẩn danh hóa thông tin của bạn trong vòng 30 ngày, trừ khi pháp luật yêu cầu lưu trữ lâu hơn.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Quyền Riêng Tư Của Trẻ Em</h2>
            <p className="text-gray-700 mb-4">
              Dịch vụ của chúng tôi không dành cho người dưới 16 tuổi. Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em. Nếu bạn phát hiện chúng tôi đã thu thập thông tin từ trẻ em, vui lòng liên hệ ngay với chúng tôi.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Chuyển Giao Dữ Liệu Quốc Tế</h2>
            <p className="text-gray-700 mb-4">
              Thông tin của bạn có thể được chuyển giao và xử lý ở các quốc gia khác ngoài Việt Nam. Chúng tôi đảm bảo rằng các biện pháp bảo vệ phù hợp được áp dụng cho các chuyển giao này.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Thay Đổi Chính Sách</h2>
            <p className="text-gray-700 mb-4">
              Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng nào bằng cách đăng chính sách mới trên trang này và cập nhật "Ngày cập nhật lần cuối".
            </p>
            <p className="text-gray-700 mb-4">
              Chúng tôi khuyến khích bạn xem lại chính sách này định kỳ để biết thông tin về cách chúng tôi bảo vệ dữ liệu của bạn.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Liên Hệ Với Chúng Tôi</h2>
            <p className="text-gray-700 mb-4">
              Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này hoặc các hoạt động bảo mật của chúng tôi, vui lòng liên hệ:
            </p>
            <ul className="list-none text-gray-700 mb-4 ml-4">
              <li><strong>Email:</strong> privacy@vemotnha.com</li>
              {/* <li><strong>Điện thoại:</strong> (028) 1234-5678</li>
              <li><strong>Địa chỉ:</strong> 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh, Việt Nam</li> */}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Đồng Ý</h2>
            <p className="text-gray-700 mb-4">
              Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý với việc thu thập và sử dụng thông tin theo Chính sách Bảo mật này.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
