import { PredictionProvider } from './PredictionContext';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'; // Using NavLink
import { ThemeProvider } from './components/theme-provider';
import { ModeToggle } from './components/mode-toggle';
import HomePage from './pages/HomePage';
import SoilMapPage from './pages/SoilMapPage';
import PredictionPage from './pages/PredictionPage';
import DiseasePage from './pages/DiseasePage';
import FarmBudIcon from './assets/FarmBudIcon.png'; 
import 'leaflet/dist/leaflet.css';

function App() {
  // --- MODIFIED: This function now uses the high-contrast text color for inactive links ---
  const getNavLinkClass = ({ isActive }) => {
    return `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? 'text-primary' : 'text-foreground' // Changed from text-muted-foreground
    }`;
  };

  return (
    <PredictionProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <div className="min-h-screen flex flex-col font-sans">
            <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/60">
              <div className="container h-16 flex items-center justify-between">
                <NavLink to="/" className="flex items-center gap-3"> 
                  <img src={FarmBudIcon} alt="FarmBud Icon" className="h-8 w-8" /> 
                  <span className="text-xl font-bold">FarmBud</span>
                </NavLink>
                <nav className="flex items-center gap-6">
                  {/* Each NavLink now uses the corrected style function */}
                  <NavLink to="/" className={getNavLinkClass}>
                    Home
                  </NavLink>
                  <NavLink to="/soil-map" className={getNavLinkClass}>
                    Soil Map
                  </NavLink>
                  <NavLink to="/predict" className={getNavLinkClass}>
                    Predict Crop
                  </NavLink>
                  <NavLink to="/disease-detect" className={getNavLinkClass}>
                    Crop Disease Detect 
                  </NavLink>
                  <ModeToggle />
                </nav>
              </div>
            </header>

            <main className="flex-grow container flex">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/soil-map" element={<SoilMapPage />} />
                <Route path="/predict" element={<PredictionPage />} />
                <Route path="/disease-detect" element={<DiseasePage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </PredictionProvider>
  );
}

export default App;