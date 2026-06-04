# CRM System

A React-based CRM application for managing leads, contacts, deals, activities, and appointments through a unified and reusable module architecture.

## Features

* Dashboard with business metrics and analytics
* Lead management with search, sorting, and bulk actions
* Contact management
* Deal tracking and revenue monitoring
* Activity logging
* Appointment and reminder management
* Dynamic table rendering
* Reusable module-based architecture
* Centralized state management with Redux

## Tech Stack

| Category         | Technology   |
| ---------------- | ------------ |
| Frontend         | React.js     |
| State Management | Redux        |
| Routing          | React Router |
| Styling          | Tailwind CSS |
| Charts           | Recharts     |
| Build Tool       | Vite         |

## Architecture

The application follows a reusable module approach where multiple CRM entities share common UI components.

```text
Dashboard
Leads
Contacts
Deals
Activities
Appointments
```

Each module is rendered using configurable components rather than dedicated implementations, reducing duplication and improving maintainability.

## Project Structure

```text
src/
├── assets/
├── components/
├── json/
│   ├── dashboardData.json
│   ├── leadsData.json
│   ├── contactData.json
│   ├── dealsData.json
│   ├── activityData.json
│   └── appointmentsData.json
├── redux/
│   ├── actions/
│   ├── reducers/
│   └── store/
├── screens/
└── App.jsx
```

## Getting Started

### Prerequisites

* Node.js 18+
* npm

### Installation

```bash
git clone <repository-url>
cd crm-system
npm install
```

### Run Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## Key Implementations

### Dynamic Module Rendering

A shared module page is used to render different CRM entities by passing configuration and data sources.

### Redux State Management

Application data is managed through a centralized Redux store to maintain predictable state updates across modules.

### Reusable Components

Common functionality such as tables, modals, search, sorting, and forms are designed as reusable components.

## Future Enhancements

* Backend integration with Node.js and MongoDB
* Authentication and authorization
* Role-based access control
* API-driven data management
* Real-time notifications
* Advanced reporting

## License

This project is available for learning and portfolio purposes.
