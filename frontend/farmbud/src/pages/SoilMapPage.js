import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { usePrediction } from '../PredictionContext';
import { motion } from 'framer-motion';
import { LocateFixed, Info, CheckCircle2 } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce'; 

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

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
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { setSoilDataToApply } = usePrediction();
  const navigate = useNavigate();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = useDebouncedCallback(async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${GEOAPIFY_API_KEY}`);
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  }, 300);

  const fetchLocationData = async (lat, lon) => {
    setError('');
    setSuccessMessage('');
    setLocationData(null);
    setMarkerPosition([lat, lon]);
    setMapCenter([lat, lon]);
    try {
      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
      if (!weatherResponse.ok) throw new Error('Could not fetch weather data for this location.');
      const weatherData = await weatherResponse.json();
      const dataToSet = {
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        rainfall: weatherData.rain?.['1h'] || 0,
      };
      setLocationData(dataToSet);
      setSuccessMessage(`Successfully fetched weather data for ${weatherData.name}!`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;
    fetchLocationData(lat, lng);
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchLocationData(position.coords.latitude, position.coords.longitude);
        setIsLocating(false);
      },
      (err) => {
        setError('Could not get location. Please enable location services.');
        setIsLocating(false);
      }
    );
  };

  const handleApplyToPrediction = () => {
    if (locationData) {
      setSoilDataToApply(locationData);
      navigate('/predict');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-8">
      <Card className="backdrop-blur-xl bg-card/60 border-border/20">
        <CardHeader>
          <CardTitle className="text-3xl">Get Location Data</CardTitle>
          <CardDescription>Search for a location, or zoom in and click directly on the map.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={isPopoverOpen} className="w-full justify-between h-12 text-base">
                  {searchQuery || "Start typing an address..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search for a city or address..."
                    onValueChange={(value) => {
                      setSearchQuery(value);
                      fetchSuggestions(value);
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {suggestions.map((feature) => (
                      <CommandItem
                        key={feature.properties.place_id}
                        onSelect={() => {
                          const { lat, lon } = feature.properties;
                          setSearchQuery(feature.properties.formatted);
                          fetchLocationData(lat, lon);
                          setIsPopoverOpen(false);
                        }}
                      >
                        {feature.properties.formatted}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button variant="outline" onClick={handleGetCurrentLocation} disabled={isLocating}>
              <LocateFixed className="mr-2 h-4 w-4" />
              {isLocating ? 'Finding...' : 'Use My Current Location'}
            </Button>
            
            {error && (
              <div className="mt-2 p-3 bg-destructive/20 text-destructive-foreground border border-destructive/50 rounded-lg flex items-start">
                <Info className="h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="mt-2 p-3 bg-primary/20 text-primary-foreground border border-primary/50 rounded-lg flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-sm">{successMessage}</p>
              </div>
            )}
            
            {locationData && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-secondary/80 rounded-lg">
                <h3 className="font-bold text-lg">Fetched Weather Data:</h3>
                <ul className="mt-2 space-y-1">
                  <li>Temperature: {locationData.temperature.toFixed(2)} °C</li>
                  <li>Humidity: {locationData.humidity.toFixed(2)} %</li>
                  <li>Rainfall (last hour): {locationData.rainfall.toFixed(2)} mm</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-4">Soil data (N, P, K, pH) must be entered manually on the next page.</p>
                <Button className="w-full mt-2" onClick={handleApplyToPrediction}>Use These Values for Prediction</Button>
              </motion.div>
            )}
          </div>
          <div className="rounded-lg overflow-hidden h-96 cursor-crosshair">
            <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
              {markerPosition && <Marker position={markerPosition}><Popup>Selected Location</Popup></Marker>}
              {markerPosition && <ChangeMapView center={markerPosition} />}
              {/* --- FIXED: Added the MapClickHandler component --- */}
              <MapClickHandler onMapClick={handleMapClick} />
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}