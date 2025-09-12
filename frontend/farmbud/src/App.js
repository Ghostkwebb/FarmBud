import { PredictionProvider } from './PredictionContext';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { ModeToggle } from './components/mode-toggle';
import HomePage from './pages/HomePage';
import SoilMapPage from './pages/SoilMapPage';
import PredictionPage from './pages/PredictionPage';
import FarmBudIcon from './assets/FarmBudIcon.png'; 
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <PredictionProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <div className="min-h-screen flex flex-col font-sans">
            <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/60">
              <div className="container h-16 flex items-center justify-between">
                {/* --- MODIFIED: Use the icon and add text next to it --- */}
                <Link to="/" className="flex items-center gap-3"> {/* Increased gap slightly */}
                  <img src={FarmBudIcon} alt="FarmBud Icon" className="h-8 w-8" /> {/* Sized for clarity */}
                  <span className="text-xl font-bold">FarmBud</span>
                </Link>
                <nav className="flex items-center gap-6">
                  <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Home
                  </Link>
                  <Link to="/soil-map" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Soil Map
                  </Link>
                  <Link to="/predict" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Predict
                  </Link>
                  <ModeToggle />
                </nav>
              </div>
            </header>

            <main className="flex-grow container flex">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/soil-map" element={<SoilMapPage />} />
                <Route path="/predict" element={<PredictionPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </PredictionProvider>
  );
}

export default App;