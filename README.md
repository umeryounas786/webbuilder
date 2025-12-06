# Website Builder

A modern drag-and-drop website builder application that allows users to create websites visually without coding.

## Features

- 🔐 **User Authentication** - Register and login system
- 📦 **Project Management** - Create, save, and manage multiple projects
- 🎨 **Drag & Drop Interface** - Intuitive drag-and-drop component placement
- 🧩 **Component Library** - Pre-built components (Headers, Text, Buttons, Images, Sections, Containers)
- ⚙️ **Properties Panel** - Edit component properties and styles
- 💾 **Auto-save** - Save projects to your account
- 🎯 **Component Selection** - Click to select and edit components

## Tech Stack

### Frontend
- React 18
- React Router DOM
- React DnD (Drag and Drop)
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- JWT Authentication
- JSON file storage (can be upgraded to database)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install root dependencies:
```bash
npm run install-all
```

Or manually install:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

2. Start the development server:
```bash
npm run dev
```

This will start both the frontend (port 3000) and backend (port 5000) concurrently.

Or run them separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. **Register/Login**: Create an account or login
2. **Create Project**: Click "New Project" on the dashboard
3. **Build Website**: 
   - Drag components from the left panel to the canvas
   - Click on components to select them
   - Edit properties in the right panel
   - Rearrange components by dragging them
4. **Save**: Click the "Save" button to save your work

## Project Structure

```
website-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/      # Login/Register components
│   │   │   ├── Dashboard/ # Project dashboard
│   │   │   └── Builder/   # Main builder interface
│   │   ├── context/       # Auth context
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   ├── data/              # JSON storage (created at runtime)
│   ├── index.js           # Server entry point
│   └── package.json
└── package.json           # Root package.json
```

## Available Components

- **Header** - Heading elements (H1-H6)
- **Text** - Paragraph text
- **Button** - Clickable buttons with links
- **Image** - Image elements with URL
- **Section** - Content sections
- **Container** - Container for grouping components

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Projects
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## Future Enhancements

- [ ] Export to HTML/CSS
- [ ] Preview mode
- [ ] More component types
- [ ] Responsive design controls
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Undo/Redo functionality
- [ ] Component templates
- [ ] Collaboration features

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
