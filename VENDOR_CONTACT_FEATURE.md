# Vendor Contact Feature

This feature allows vendors to submit their contact information and business details through the landing page.

## Features

### Frontend
- Two-column CTA section on the landing page
- **Couples Column**: Button to scroll to hero and create timeline
- **Vendors Column**: Contact form with email and message fields
- Form validation and loading states
- Success/error feedback messages

### Backend
- API endpoint to receive vendor contact submissions
- Database storage of vendor information
- Automatic email notification to admin
- Admin endpoints to view and manage vendor contacts

## Database Schema

### VendorContact Table
```sql
CREATE TABLE vendor_contacts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending', 'contacted', 'rejected') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Public Endpoints

#### Submit Vendor Contact
```
POST /api/vendor/contact
```

**Request Body:**
```json
{
  "email": "vendor@example.com",
  "message": "I provide wedding photography services..."
}
```

**Response:**
```json
{
  "message": "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.",
  "vendorContact": {
    "id": 1,
    "email": "vendor@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Admin Endpoints (Requires Authentication)

#### Get All Vendor Contacts
```
GET /api/vendor/contacts?status=pending&page=1&limit=20
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, contacted, rejected)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "vendorContacts": [...],
  "totalCount": 50,
  "currentPage": 1,
  "totalPages": 3
}
```

#### Update Vendor Contact Status
```
PUT /api/vendor/contacts/:id
```

**Request Body:**
```json
{
  "status": "contacted",
  "notes": "Called and scheduled meeting"
}
```

## Email Configuration

The system sends email notifications to the admin when a new vendor contact is submitted.

### Email Template

The email includes:
- Vendor email address
- Message content
- Submission timestamp
- Request ID for reference
- Reply-to field set to vendor's email for easy response

## Usage

### For Developers

1. **Database Migration**: Run the migration to create the vendor_contacts table
   ```bash
   # The table will be created automatically when the server starts
   # due to Sequelize sync
   ```

2. **Configure Email**: Update `.env` file with email credentials
   - For Gmail, use an App Password (not your regular password)
   - Enable "Less secure app access" or use OAuth2

3. **Test the Feature**:
   - Visit the landing page
   - Scroll to the CTA section
   - Fill in the vendor form
   - Check database and admin email for the submission

### For Admins

1. **View Submissions**: Use the admin endpoints to view all vendor contacts
2. **Update Status**: Mark contacts as 'contacted' or 'rejected'
3. **Add Notes**: Keep track of communication history
4. **Respond**: Reply directly to vendor emails from the notification

## Security Considerations

- Email and message fields are validated
- SQL injection prevented by Sequelize ORM
- Admin endpoints require authentication
- Rate limiting should be added for production
- Consider adding CAPTCHA to prevent spam

## Future Enhancements

- [ ] Add CAPTCHA to vendor form
- [ ] Implement rate limiting
- [ ] Add vendor categories/types
- [ ] Create admin dashboard for vendor management
- [ ] Add email templates customization
- [ ] Implement automated follow-up emails
- [ ] Add phone number field
- [ ] Add business name and website fields
