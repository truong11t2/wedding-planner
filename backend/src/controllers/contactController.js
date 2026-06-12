const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SMTP_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });
};

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!email || !message) {
      return res.status(400).json({ 
        message: 'Email và tin nhắn là bắt buộc' 
      });
    }

    // Save to database
    const contact = await Contact.create({
      name: name || null,
      email,
      message,
      status: 'pending'
    });

    // Send email notification to admin
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        to: process.env.SMTP_USER,
        subject: 'Tin nhắn mới từ khách hàng - Wedding Planner',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #EC4899; border-bottom: 2px solid #EC4899; padding-bottom: 10px;">
              💌 Tin nhắn liên hệ mới
            </h2>
            
            <div style="margin: 20px 0; padding: 20px; background-color: #FDF2F8; border-left: 4px solid #EC4899;">
              <h3 style="margin-top: 0; color: #374151;">Thông tin người gửi:</h3>
              
              ${name ? `<p style="margin: 10px 0;">
                <strong>Họ tên:</strong> ${name}
              </p>` : ''}
              
              <p style="margin: 10px 0;">
                <strong>Email:</strong> ${email}
              </p>
              
              <p style="margin: 10px 0;">
                <strong>Nội dung tin nhắn:</strong>
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
                💡 <strong>Lưu ý:</strong> Vui lòng phản hồi khách hàng trong vòng 24 giờ để đảm bảo chất lượng dịch vụ.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
              <p>Email này được gửi tự động từ hệ thống Wedding Planner.</p>
              <p>Để liên hệ với khách hàng, vui lòng trả lời trực tiếp vào email: <strong>${email}</strong></p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue even if email fails - the contact is saved in database
    }

    res.status(201).json({
      message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.',
      contact: {
        id: contact.id,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại sau.' 
    });
  }
};

// Get all contacts (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const where = {};
    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Contact.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      contacts: rows,
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi tải danh sách liên hệ' 
    });
  }
};

// Update contact status (admin only)
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ 
        message: 'Không tìm thấy thông tin liên hệ' 
      });
    }

    await contact.update({
      status: status || contact.status,
      notes: notes !== undefined ? notes : contact.notes
    });

    res.json({
      message: 'Cập nhật thành công',
      contact
    });

  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi cập nhật' 
    });
  }
};

// Delete contact (admin only)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ 
        message: 'Không tìm thấy thông tin liên hệ' 
      });
    }

    await contact.destroy();

    res.json({
      message: 'Xóa thành công'
    });

  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi xóa' 
    });
  }
};
