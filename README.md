# Rwanda  community Health worker (RCHW) System

A comprehensive digital platform designed to strengthen the capacity of health workers in Rwanda by improving the accessibility, accuracy, and utilization of health information systems.

## 🎯 Project Overview

The RCHW system provides a modern, user-friendly interface for Community Health Workers (CHWs) and administrators to manage health information, track patient visits, and generate reports that support better healthcare decision-making.

## ✨ Key Features

### For Community Health Workers (CHWs)
- **Personal Dashboard** with performance metrics
- **Health Report Creation** and management
- **Patient Visit Recording** with follow-up tracking
- **Patient Intake Forms** for comprehensive data collection
- **Help & Resources** section for training materials

### For Administrators
- **System-wide Analytics** and reporting
- **User Management** with automated account creation
- **Health Report Review** and status management
- **Geographic Data Visualization**
- **Email Notification System**

## 🛠️ Technology Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js Server Actions, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** Custom session-based auth
- **Email:** Resend API
- **UI Components:** shadcn/ui

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL database
- Resend account for email functionality

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/rwanda-health/RCHW-system.git
   cd RCHW-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Configure the following variables:
   \`\`\`env
   DATABASE_URL=postgresql://username:password@localhost:5432/RCHW_db
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   RESEND_API_KEY=your_resend_api_key
   RESEND_VERIFIED_DOMAIN=yourdomain.com
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

5. **Create an admin user**
   \`\`\`bash
   node scripts/create-admin-user.js
   \`\`\`

6. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

Visit `http://localhost:3000` to access the application.

## 📊 System Architecture

### Database Schema
- **Users:** CHWs and administrators with role-based access
- **Health Reports:** Digital health information with status tracking
- **Patient Visits:** Comprehensive patient interaction records

### Authentication Flow
- Session-based authentication with HTTP-only cookies
- Role-based access control (ADMIN/CHW)
- Secure password hashing with bcryptjs

### Email System
- Automated welcome emails for new users
- Password delivery via secure email templates
- Notification system for important events

## 🔧 Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
\`\`\`

## 📁 Project Structure

\`\`\`
rwanda-health-system/
├── app/
│   ├── actions/           # Server Actions
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   └── globals.css       # Global styles
├── components/
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   ├── emails/           # Email templates
│   └── ui/               # UI components
├── lib/                  # Utility functions
├── prisma/              # Database schema
└── scripts/             # Utility scripts
\`\`\`

## 🔒 Security Features

- **Password Security:** bcryptjs hashing with salt rounds
- **Session Management:** Secure HTTP-only cookies
- **Input Validation:** Zod schema validation
- **SQL Injection Prevention:** Prisma ORM protection
- **Role-based Access Control:** Middleware protection

## 📈 Performance & Scalability

- **Optimized Database Queries:** Prisma ORM with efficient queries
- **Server-side Rendering:** Next.js App Router for fast page loads
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Caching Strategy:** Built-in Next.js caching mechanisms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For technical support or questions:
- **Documentation:** Check the `/docs` folder
- **Issues:** Create an issue on GitHub
- **Email:** Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Rwanda Ministry of Health for project guidance
- Community Health Workers for valuable feedback
- Open source community for excellent tools and libraries

---

**Developed with ❤️ for Rwanda's healthcare system**
