# CRM System - Client (Frontend)

A modern, feature-rich Customer Relationship Management (CRM) web application built with React, Vite, and Redux. This project provides a comprehensive dashboard for managing leads, contacts, activities, appointments, and users.

## 🎯 Project Overview

This is the frontend client for a MERN stack CRM system. It delivers a responsive, user-friendly interface for managing customer relationships, tracking sales activities, and organizing business operations.

### Key Features

- **Dashboard**: Real-time analytics and metrics visualization
- **Lead Management**: Track and manage sales leads with filtering and export capabilities
- **Contact Management**: Organize and manage customer contacts
- **Activity Tracking**: Monitor business activities and interactions
- **Appointment Scheduling**: Schedule and manage appointments
- **User Management**: Create, edit, and manage team members
- **Notifications**: Real-time notification system
- **Authentication**: Secure login with protected routes
- **Data Export**: Export leads data to CSV format
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📋 Tech Stack

### Frontend Framework
- **React** (19.2.5) - UI library
- **React Router DOM** (7.14.2) - Client-side routing
- **Vite** (8.0.9) - Build tool and dev server
- **React DOM** (19.2.5) - React rendering engine

### State Management
- **Redux** (5.0.1) - State management
- **React-Redux** (9.2.0) - React bindings for Redux

### Styling
- **Tailwind CSS** (4.2.4) - Utility-first CSS framework
- **@tailwindcss/vite** (4.2.4) - Vite plugin for Tailwind

### Components & Icons
- **Huge Icons** (@hugeicons/react, @hugeicons/core-free-icons) - Icon library
- **Recharts** (3.8.1) - Chart and graph components

### Forms & API
- **Formik** (2.4.9) - Form validation and management
- **Axios** (1.18.0) - HTTP client for API requests

### Development Tools
- **ESLint** (9.39.4) - Code linting
- **Vite React Plugin** (@vitejs/plugin-react) - React support for Vite

## 📂 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── ModulePage.jsx   # Module page template
│   ├── Navbar.jsx       # Top navigation bar
│   ├── Sidebar.jsx      # Sidebar navigation
│   ├── StatCard.jsx     # Dashboard statistics card
│   ├── Tabel.jsx        # Reusable table component
│   ├── ToastNotification.jsx  # Toast notification component
│   ├── UserCreate.jsx   # User creation form
│   ├── UserEdit.jsx     # User edit form
│   └── modals/          # Modal dialogs
│       ├── AddModal.jsx        # Add new record modal
│       ├── DeleteModal.jsx     # Delete confirmation modal
│       ├── EditModal.jsx       # Edit record modal
│       ├── FilterModal.jsx     # Data filtering modal
│       ├── UploadModal.jsx     # File upload modal
│       └── ViewModal.jsx       # View details modal
├── pages/               # Page components
│   ├── Dashboard.jsx    # Dashboard with analytics
│   ├── Lead.jsx         # Lead management
│   ├── Contacts.jsx     # Contact management
│   ├── Activity.jsx     # Activity tracking
│   ├── Appointment.jsx  # Appointment scheduling
│   ├── Users.jsx        # User management
│   ├── Notification.jsx # Notifications center
│   ├── Login.jsx        # Login page
│   └── Registeration.jsx # Registration page
├── redux/               # Redux state management
│   ├── store.jsx        # Redux store configuration
│   ├── actions/
│   │   └── modulesAction.jsx  # Action creators
│   └── reducers/
│       ├── index.jsx    # Root reducer
│       └── modulesReducer.jsx # Modules reducer
├── routes/
│   └── ProtectedRoutes.jsx  # Route protection component
├── utils/               # Utility functions
│   ├── useDebounce.jsx  # Debounce custom hook
│   └── useNotification.jsx  # Notification custom hook
├── data/                # Mock data JSON files
│   ├── dashboardData.json
│   ├── leadsData.json
│   ├── contactData.json
│   ├── activityData.json
│   ├── appointmentsData.json
│   ├── userData.json
│   └── notificationsData.json
├── assets/              # Static assets
│   ├── icons/
│   └── images/
├── App.jsx              # Root application component
├── main.jsx             # Application entry point
└── index.css            # Global styles
```
├── App.jsx              # Root application component
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crm_system/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (Vite default)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot module replacement |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

## 🔐 Authentication

The application features:
- **Login Page** - User authentication
- **Registration Page** - New user registration
- **Protected Routes** - Routes accessible only to authenticated users
- **Local Storage** - Session management with localStorage

To login:
1. Navigate to `/login` (redirected if not authenticated)
2. Enter credentials
3. Redirected to dashboard upon successful authentication

## 📊 Data Management

### Redux Store Structure

```javascript
// State shape
{
  modules: {
    dashboardData: {},
    leadsData: [],
    contactData: [],
    activityData: [],
    appointmentData: [],
    userData: [],
    notificationData: []
  }
}
```

### Data Flow

1. Mock data is loaded from JSON files in `src/data/`
2. Data is dispatched to Redux store on app initialization
3. Components access data using `useSelector` hook
4. Ready for backend API integration by replacing dispatch actions

## 🎨 UI Components

### Core Components

- **Navbar** - Top navigation with user profile and notifications
- **Sidebar** - Main navigation menu with module links
- **StatCard** - Dashboard statistics display
- **Table** - Reusable data table component
- **Modal Components** - Standardized modals for common operations

### Features

- **Toast Notifications** - Non-intrusive user feedback
- **Date Filtering** - Filter data by date range
- **Data Export** - Export filtered data to CSV
- **Responsive Layout** - Mobile-friendly design with Tailwind CSS

## 🔄 Custom Hooks

### useDebounce
Debounces input changes for efficient search operations.

```javascript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);
```

### useNotification
Manages toast notifications throughout the application.

## 🔗 API Integration Ready

The project uses Axios for API calls. Currently using mock JSON data, ready to integrate with backend endpoints:

```javascript
// Example - Replace mock data with API calls
// import axios from 'axios';
// axios.get('/api/leads').then(response => dispatch(leadModuleData(response.data)))
```

## 📱 Pages Details

### Dashboard
- Key metrics and statistics
- Sales performance charts
- Recent activities overview
- Lead generation trends
- Date-based filtering and export functionality

### Lead Management
- View all leads
- Add new leads
- Edit lead information
- Delete leads
- Filter by criteria
- Export leads to CSV

### Contacts
- Manage customer contacts
- Add/edit/delete contacts
- View contact details
- Search and filter contacts

### Activities
- Track business activities
- Log interactions
- Activity history
- Timeline view

### Appointments
- Schedule appointments
- Calendar view
- Appointment reminders
- Edit/cancel appointments

### Users
- Manage team members
- Create new users
- Edit user profiles
- Assign roles/permissions

### Notifications
- View all notifications
- Mark as read/unread
- Filter notifications
- Delete notifications

## 🛠️ Development Tips

1. **Component Reusability** - Modals and cards are designed to be reusable
2. **Redux DevTools** - Use Redux DevTools for debugging state changes
3. **Tailwind Classes** - Utilize Tailwind's utility classes for consistent styling
4. **Form Validation** - Formik handles form validation and submission
5. **Lazy Loading** - Pages use React.lazy() for code splitting

## 📈 Performance Optimizations

- **Code Splitting** - Pages are lazy-loaded with React.lazy and Suspense
- **Memoization** - useMemo used for expensive computations
- **Vite** - Fast development server and optimized production builds
- **Tailwind CSS** - Minimal CSS payload with utility-first approach

## 🐛 Debugging

### Redux State
Use React Developer Tools Redux extension to inspect and debug Redux state changes.

### Console Logging
Enable debug logs in localStorage:
```javascript
localStorage.setItem('debug', 'crm:*');
```

## 📦 Dependencies Management

Keep dependencies updated:
```bash
npm outdated          # Check for outdated packages
npm update           # Update packages
npm audit            # Check for vulnerabilities
npm audit fix        # Fix vulnerabilities
```

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy 'dist' folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy 'dist' folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📝 Environment Variables

Create `.env` file for environment-specific configuration:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=CRM System
```

Access in components:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Commit with clear messages
5. Submit pull request

## 📞 Support

For issues or questions:
1. Check existing issues
2. Create detailed bug reports
3. Include steps to reproduce
4. Attach screenshots/error logs

## 📄 License

This project is part of the MERN Stack CRM System.

## 🔮 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Advanced analytics and reporting
- [ ] Mobile app with React Native
- [ ] Email integration
- [ ] Calendar sync (Google Calendar, Outlook)
- [ ] Automated workflows
- [ ] AI-powered lead scoring
- [ ] Customer portal
- [ ] Multi-language support
- [ ] Dark mode

## 📚 Related Documentation

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Redux Documentation](https://redux.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org)

---

**Version**: 0.0.0  
**Last Updated**: 2026-06-23  
**Status**: In Development
