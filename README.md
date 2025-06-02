# HEROin Frontend - React Application

![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple?style=for-the-badge&logo=vite)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.6-purple?style=for-the-badge&logo=bootstrap)

Frontend aplikasi sistem pakar **HEROin** untuk identifikasi kecanduan game online menggunakan React dengan metodologi Backward Chaining dan Certainty Factor.

## 🎯 Fitur Frontend

### 🖥️ User Interface
- **Responsive Design** - Bootstrap 5 dengan custom CSS
- **Modern UI/UX** - Clean interface dengan purple theme (#9630FB)
- **Interactive Components** - Real-time feedback dan validasi
- **Mobile-First** - Optimized untuk semua ukuran layar

### 📱 Halaman Utama
- **Home** (`/`) - Landing page dengan informasi sistem
- **User Info** (`/user-info`) - Form identitas pengguna
- **Hypothesis** (`/hypothesis`) - Pemilihan hipotesis kecanduan
- **Questionnaire** (`/questionnaire`) - Kuesioner adaptif
- **Result** (`/result`) - Hasil analisis dan rekomendasi
- **Dashboard** (`/dashboard`) - Analytics dan manajemen data

### 📊 Data Visualization
- **Chart.js Integration** - Pie charts dan bar charts
- **Real-time Statistics** - Update otomatis dari API
- **Interactive Tables** - Sortable dan filterable data
- **Progress Indicators** - CF visualization dengan progress bars

## 🚀 Tech Stack

### Core Technologies
- **React 18.3.1** - UI framework dengan hooks dan functional components
- **React Router DOM 6.30.0** - Client-side routing dan navigation
- **Vite 5.4.19** - Fast build tool dan development server
- **JavaScript ES6+** - Modern JavaScript features

### UI & Styling
- **Bootstrap 5.3.6** - CSS framework untuk responsive design
- **Bootstrap Icons** - Icon library untuk UI elements
- **Custom CSS** - Additional styling untuk branding
- **Tailwind CSS 3.4.17** - Utility-first CSS framework

### Data & Charts
- **Chart.js 4.x** - Charting library untuk visualisasi
- **React-ChartJS-2 5.3.0** - React wrapper untuk Chart.js
- **Axios 1.9.0** - HTTP client untuk API communication

### Development Tools
- **ESLint** - Code linting dan quality checks
- **React Refresh** - Hot reload untuk development
- **PostCSS & Autoprefixer** - CSS processing

## 🛠️ Setup dan Development

### Prerequisites
```bash
Node.js v16+ 
npm atau yarn
Git
```

### Installation
```bash
# Clone repository
git clone <repository-url>
cd heroin-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Scripts
```bash
# Development server (http://localhost:5173)
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Struktur Project

```
src/
├── components/           # Reusable components
│   ├── Navbar.jsx       # Navigation component
│   └── Footer.jsx       # Footer component
├── pages/               # Page components
│   ├── Home.jsx         # Landing page
│   ├── UserInfo.jsx     # User information form
│   ├── Hypothesis.jsx   # Hypothesis selection
│   ├── Questionnaire.jsx # Adaptive questionnaire
│   ├── Result.jsx       # Analysis results
│   └── Dashboard.jsx    # Admin dashboard
├── assets/              # Static assets
│   ├── logo.png         # HEROin logo
│   └── dontol.png       # Hero image
├── App.jsx              # Main app component
├── main.jsx             # Entry point
├── App.css              # Global styles
└── index.css            # Tailwind and base styles
```

## 🎨 Design System

### Color Palette
```css
:root {
  --primary-color: #9630fb;     /* Purple primary */
  --primary-light: #b673ff;     /* Light purple */
  --primary-dark: #7219d7;      /* Dark purple */
  --secondary-color: #343a40;   /* Dark gray */
  --light-gray: #f8f9fa;        /* Background */
  --success-color: #28a745;     /* Success green */
  --warning-color: #ffc107;     /* Warning yellow */
  --danger-color: #dc3545;      /* Danger red */
}
```

### Typography
- **Primary Font**: Poppins, Segoe UI, Roboto
- **Headings**: Bold weights dengan purple accent
- **Body Text**: Regular weight dengan good contrast

## 🔄 State Management

### Session Storage
```javascript
// User flow data management
sessionStorage.setItem("userInfo", JSON.stringify(formData));
sessionStorage.setItem("selectedHypothesis", hypothesisId);
sessionStorage.setItem("resultId", resultId);
```

### React Hooks
- **useState** - Local component state
- **useEffect** - Side effects dan API calls
- **useNavigate** - Programmatic navigation
- **useLocation** - URL parameters handling

## 🌐 API Integration

### Base Configuration
```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

### API Endpoints
```javascript
// User Management
POST /api/user-info              // Save user information
GET  /api/hypotheses             // Get available hypotheses
POST /api/selected-hypothesis    // Save selected hypothesis

// Questionnaire Flow
GET  /api/questions/:hypothesisId // Get adaptive questions
POST /api/submit-questionnaire    // Submit answers

// Results & Analytics
GET  /api/result/:resultId        // Get analysis result
GET  /api/statistics              // Dashboard statistics
DELETE /api/result/:resultId      // Delete result

// Reports
GET  /api/download-report/:id     // Individual report
GET  /api/download-all-reports    // Bulk export
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Mobile: 0-576px */
/* Tablet: 577-768px */
/* Desktop: 769-992px */
/* Large Desktop: 993px+ */

@media (max-width: 768px) {
  .display-4 { font-size: 2rem; }
  .btn-lg { padding: 0.5rem 1rem; }
}
```

## 🎯 Key Features Implementation

### 1. Adaptive Questionnaire
```javascript
// Pertanyaan berubah berdasarkan hipotesis (Backward Chaining)
useEffect(() => {
  const fetchQuestions = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/questions/${selectedHypothesis}`
    );
    setQuestions(response.data);
  };
}, [selectedHypothesis]);
```

### 2. Real-time CF Calculation
```javascript
// CF Scale sesuai penelitian
const cfValues = [
  { value: 1.0, text: "Sangat yakin" },
  { value: 0.8, text: "Yakin" },
  { value: 0.6, text: "Cukup yakin" },
  { value: 0.4, text: "Kadang-kadang" },
  { value: 0.2, text: "Jarang" },
  { value: 0.0, text: "Tidak pernah" }
];
```

### 3. Interactive Dashboard
```javascript
// Chart.js configuration untuk statistik
const addictionLevelData = {
  labels: ["Sangat Rendah", "Rendah", "Sedang", "Tinggi", "Sangat Tinggi"],
  datasets: [{
    data: [veryLow, low, medium, high, veryHigh],
    backgroundColor: ["#28a745", "#28a745", "#17a2b8", "#ffc107", "#dc3545"]
  }]
};
```

## 🔧 Configuration Files

### Vite Config (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  }
});
```

### Tailwind Config (`tailwind.config.js`)
```javascript
module.exports = {
  content: ["*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#9630FB" }
      }
    }
  }
};
```

## 🚀 Deployment

### Build untuk Production
```bash
# Generate production build
npm run build

# Files akan tersedia di folder 'dist'
# Upload ke web server atau hosting service
```

### Environment Variables
```bash
# .env.production
VITE_API_BASE_URL=https://your-backend-api.com/api
```

## 📋 Development Guidelines

### Code Style
- **ESLint Configuration** - Mengikuti React best practices
- **Component Naming** - PascalCase untuk components
- **File Organization** - Logical grouping berdasarkan feature
- **Import Order** - External libraries → Internal components → Styles

### Best Practices
- **Functional Components** - Menggunakan hooks instead of classes
- **Error Boundaries** - Proper error handling untuk user experience
- **Loading States** - Feedback visual untuk operasi async
- **Form Validation** - Client-side validation sebelum submit

## 🐛 Troubleshooting

### Common Issues
```bash
# Port conflict
Error: Port 5173 is already in use
Solution: npm run dev -- --port 3000

# Node modules issues
rm -rf node_modules package-lock.json
npm install

# Build errors
npm run lint --fix
```

## 📝 Future Enhancements

- [ ] **Progressive Web App (PWA)** - Offline capability
- [ ] **Dark Mode Toggle** - Theme switching
- [ ] **Multi-language Support** - i18n implementation
- [ ] **Real-time Notifications** - WebSocket integration
- [ ] **Advanced Analytics** - More detailed visualizations

---

**Developed with ❤️ for educational purposes and gaming addiction awareness**
