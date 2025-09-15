import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { usePrediction } from '../PredictionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LocateFixed, Info, Upload, Loader2, ChevronsRight, Leaf } from 'lucide-react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { useDebouncedCallback } from 'use-debounce';
import IndiaSoilMap from '../assets/soil_map_india.png';
import TextToSpeech from '../components/TextToSpeech';

const GEOAPIFY_API_KEY = '0d2b144b9d9c48759462f3c4db30f9c7';
const OPENWEATHERMAP_API_KEY = '4934af38a51a1a72ec257163a615209a';

function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick(e.latlng); } });
  return null;
}

export default function SoilMapPage() {
  const [step, setStep] = useState(1);
  const [soilImage, setSoilImage] = useState(null);
  const [soilImagePreview, setSoilImagePreview] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { setSoilDataToApply } = usePrediction();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const handleSoilImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSoilImage(file);
      const reader = new FileReader();
      reader.onloadend = () => { setSoilImagePreview(reader.result); };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleAnalyzeSoil = async () => {
    if (!soilImage) return;
    setIsProcessing(true);
    setError('');
    const formData = new FormData();
    formData.append('file', soilImage);
    try {
      // --- THIS IS THE CORRECTED LINE ---
      const response = await fetch('http://127.0.0.1:5000/predict_soil', { method: 'POST', body: formData });
      
      // --- NEW: Better error handling ---
      if (!response.ok) {
        throw new Error(`Server error (status ${response.status}). Make sure the backend is running correctly.`);
      }
      const data = await response.json();
      setSoilData(data);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyToPrediction = () => {
    if (soilData && weatherData) {
      const finalData = { ...soilData.nutrients, ...weatherData };
      setSoilDataToApply(finalData);
      navigate('/predict');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-8">
      <Card className="w-full backdrop-blur-xl bg-card/60 border-border/20">
        <CardHeader>
          <TextToSpeech><CardTitle className="text-3xl">Get Data for Prediction</CardTitle></TextToSpeech>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <span className={`flex items-center ${step === 1 ? 'text-primary font-semibold' : ''}`}><Leaf className="mr-2 h-4 w-4"/> Step 1: Analyze Soil</span>
            <ChevronsRight className="mx-2 h-5 w-5"/>
            <span className={`flex items-center ${step === 2 ? 'text-primary font-semibold' : ''}`}><LocateFixed className="mr-2 h-4 w-4"/> Step 2: Get Weather</span>
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-destructive/20 text-destructive-foreground border border-destructive/50 rounded-lg flex items-start"><Info className="h-5 w-5 mr-3 flex-shrink-0" /><p className="text-sm">{error}</p></div>}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" exit={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -50 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-full h-80 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center text-center p-4 relative cursor-pointer" onClick={() => fileInputRef.current.click()}>
                      {soilImagePreview ? <img src={soilImagePreview} alt="Soil Preview" className="max-h-full max-w-full object-contain rounded-md" /> : <div className="text-muted-foreground"><Upload className="mx-auto h-12 w-12" /><p>Click to upload a soil image</p></div>}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleSoilImageChange} className="hidden" accept="image/png, image/jpeg" />
                    <Button onClick={handleAnalyzeSoil} disabled={!soilImage || isProcessing} className="w-full text-lg h-12">
                      {isProcessing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Analyzing Soil...</> : 'Analyze Soil Type'}
                    </Button>
                  </div>
                  <div className="flex flex-col justify-center">
                    <TextToSpeech><h3 className="text-xl font-semibold text-foreground mb-4">Major Soil Types of India</h3></TextToSpeech>
                    <div className="bg-secondary/30 rounded-lg p-2 h-full">
                        <img src={IndiaSoilMap} alt="Map of soil types in India" className="w-full h-full object-contain rounded-md"/>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                <LocationStep soilData={soilData} onWeatherDataFetched={setWeatherData} />
                <div className="mt-6 flex justify-between items-center">
                    <Button variant="outline" onClick={() => setStep(1)}>Back to Soil Analysis</Button>
                    <Button onClick={handleApplyToPrediction} disabled={!weatherData}>Use All Data for Prediction</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- THIS SUB-COMPONENT IS NOW COMPLETE ---
function LocationStep({ soilData, onWeatherDataFetched }) {
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = useDebouncedCallback(async (query) => {
    if (query.length < 3) return setSuggestions([]);
    try {
      const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${GEOAPIFY_API_KEY}`);
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (err) { console.error("Error fetching suggestions:", err); }
  }, 300);

  const fetchLocationData = async (lat, lon) => {
    setError('');
    setSuccessMessage('');
    setMarkerPosition([lat, lon]);
    setMapCenter([lat, lon]);
    try {
      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
      if (!weatherResponse.ok) throw new Error('Could not fetch weather data.');
      const weatherData = await weatherResponse.json();
      const dataToSet = {
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        rainfall: weatherData.rain?.['1h'] || 0,
      };
      onWeatherDataFetched(dataToSet);
      setSuccessMessage(`Fetched weather for ${weatherData.name}!`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMapClick = (latlng) => {
    fetchLocationData(latlng.lat, latlng.lng);
  };
  
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchLocationData(position.coords.latitude, position.coords.longitude);
        setIsLocating(false);
      },
      (err) => {
        setError('Could not get location. Please enable services.');
        setIsLocating(false);
      }
    );
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <div className="p-4 bg-secondary/80 rounded-lg mb-4">
                <TextToSpeech><h3 className="font-bold text-lg">Soil Analysis Complete</h3></TextToSpeech>
                <TextToSpeech><p>Type: <span className="font-semibold">{soilData.soil_type}</span> ({soilData.confidence})</p></TextToSpeech>
                <ul className="text-sm">
                    <TextToSpeech><li>Nitrogen: {soilData.nutrients.Nitrogen}</li></TextToSpeech>
                    <TextToSpeech><li>Phosphorus: {soilData.nutrients.Phosphorus}</li></TextToSpeech>
                    <TextToSpeech><li>Potassium: {soilData.nutrients.Potassium}</li></TextToSpeech>
                    <TextToSpeech><li>pH: {soilData.nutrients.ph}</li></TextToSpeech>
                </ul>
            </div>
            <div className="flex flex-col gap-4">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild><Button variant="outline" role="combobox" className="w-full justify-between h-12 text-base">{searchQuery || "Start typing an address..."}</Button></PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                            <CommandInput placeholder="Search..." onValueChange={(value) => { setSearchQuery(value); fetchSuggestions(value); }}/>
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                {suggestions.map((feature) => (
                                    <CommandItem key={feature.properties.place_id} onSelect={() => {
                                        const { lat, lon } = feature.properties;
                                        setSearchQuery(feature.properties.formatted);
                                        fetchLocationData(lat, lon);
                                        setIsPopoverOpen(false);
                                    }}>{feature.properties.formatted}</CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Button variant="outline" onClick={handleGetCurrentLocation} disabled={isLocating}><LocateFixed className="mr-2 h-4 w-4" />{isLocating ? 'Finding...' : 'Use My Current Location'}</Button>
            </div>
            {error && <div className="mt-2 p-3 bg-destructive/20 text-destructive-foreground rounded-lg"><p className="text-sm">{error}</p></div>}
            {successMessage && <div className="mt-2 p-3 bg-primary/20 text-primary-foreground rounded-lg"><p className="text-sm">{successMessage}</p></div>}
        </div>
        <div className="rounded-lg overflow-hidden h-96 cursor-crosshair">
            <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                {markerPosition && <Marker position={markerPosition}><Popup>Selected Location</Popup></Marker>}
                {markerPosition && <ChangeMapView center={markerPosition} />}
                <MapClickHandler onMapClick={handleMapClick} />
            </MapContainer>
        </div>
    </div>
  )
}