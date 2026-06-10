const VendorContact = require('../models/VendorContact');
const nodemailer = require('nodemailer');

// // Create email transporter
// const createTransporter = () => {
//   // Configure your email service here
//   return nodemailer.createTransporter({
//     host: process.env.SMTP_HOST || 'smtp.gmail.com',
//     port: process.env.SMTP_PORT || 587,
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS
//     }
//   });
// };

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // Shortcut for Gmail's SMTP settings - see Well-Known Services
    auth: {
      type: "OAuth2",
      user: process.env.SMTP_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });
};

// Submit vendor contact
exports.submitVendorContact = async (req, res) => {
  try {
    const { email, message } = req.body;

    // Validate input
    if (!email || !message) {
      return res.status(400).json({ 
        message: 'Email và tin nhắn là bắt buộc' 
      });
    }

    // Save to database
    const vendorContact = await VendorContact.create({
      email,
      message,
      status: 'pending'
    });

    // Send email notification to admin
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        //from: `"${process.env.SMTP_FROM_NAME || 'Wedding Planner'}" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: 'Yêu cầu hợp tác mới từ nhà cung cấp',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6B46C1; border-bottom: 2px solid #6B46C1; padding-bottom: 10px;">
              📧 Yêu cầu hợp tác mới
            </h2>
            
            <div style="margin: 20px 0; padding: 20px; background-color: #F9FAFB; border-left: 4px solid #6B46C1;">
              <h3 style="margin-top: 0; color: #374151;">Thông tin nhà cung cấp:</h3>
              
              <p style="margin: 10px 0;">
                <strong>Email:</strong> ${email}
              </p>
              
              <p style="margin: 10px 0;">
                <strong>Tin nhắn:</strong>
              </p>
              <div style="background-color: white; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
${message}
              </div>
              
              <p style="margin: 10px 0; color: #6B7280;">
                <strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}
              </p>
              
            </div>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #FEF3C7; border-radius: 5px;">
              <p style="margin: 0; color: #92400E;">
                💡 <strong>Lưu ý:</strong> Vui lòng phản hồi trong vòng 24 giờ để duy trì uy tín với đối tác.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
              <p>Email này được gửi tự động từ hệ thống Wedding Planner.</p>
              <p>Để liên hệ với nhà cung cấp, vui lòng trả lời trực tiếp vào email: <strong>${email}</strong></p>
            </div>
          </div>
        `,
        // replyTo: email
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue even if email fails - the contact is saved in database
    }

    res.status(201).json({
      message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.',
      vendorContact: {
        id: vendorContact.id,
        email: vendorContact.email,
        createdAt: vendorContact.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting vendor contact:', error);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại sau.' 
    });
  }
};

// Get all vendor contacts (admin only)
exports.getAllVendorContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const where = {};
    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await VendorContact.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      vendorContacts: rows,
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });

  } catch (error) {
    console.error('Error fetching vendor contacts:', error);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi tải danh sách liên hệ' 
    });
  }
};

// Update vendor contact status (admin only)
exports.updateVendorContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const vendorContact = await VendorContact.findByPk(id);

    if (!vendorContact) {
      return res.status(404).json({ 
        message: 'Không tìm thấy thông tin liên hệ' 
      });
    }

    await vendorContact.update({
      status: status || vendorContact.status,
      notes: notes !== undefined ? notes : vendorContact.notes
    });

    res.json({
      message: 'Cập nhật thành công',
      vendorContact
    });

  } catch (error) {
    console.error('Error updating vendor contact:', error);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi cập nhật' 
    });
  }
};
