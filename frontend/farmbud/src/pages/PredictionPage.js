import { useState, useEffect } from 'react';
import { usePrediction } from '../PredictionContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Thermometer, Droplets, Wind, Clover, Lightbulb, X } from 'lucide-react';
import TextToSpeech from '../components/TextToSpeech';

const cropEmojis = {
  rice: '🌾', maize: '🌽', jute: '🌿', cotton: '☁️', coconut: '🥥', papaya: '🥭',
  orange: '🍊', apple: '🍎', muskmelon: '🍈', watermelon: '🍉', grapes: '🍇',
  mango: '🥭', banana: '🍌', pomegranate: '🍎', lentil: '🫘', blackgram: '🫘',
  mungbean: '🫘', mothbeans: '🫘', pigeonpeas: '🫘', kidneybeans: '🫘',
  chickpea: '🫘', coffee: '☕',
};

const InputWithIcon = ({ icon, ...props }) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>
    <Input className="pl-10" {...props} />
  </div>
);

const ParameterInfo = ({ icon, title, children }) => (
    <div className="flex items-start gap-3">
        <div className="bg-primary/20 p-2 rounded-md">{icon}</div>
        <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{children}</p>
        </div>
    </div>
);

export default function PredictionPage() {
  const [formData, setFormData] = useState({
    Nitrogen: '', Phosphorus: '', Potassium: '',
    temperature: '', humidity: '', ph: '', rainfall: ''
  });
  const { soilDataToApply, setSoilDataToApply } = usePrediction();
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSoilInfo, setShowSoilInfo] = useState(false);

  useEffect(() => {
    if (soilDataToApply) {
      const defaultSoilData = { Nitrogen: '90', Phosphorus: '42', Potassium: '43', ph: '6.5' };
      setFormData(prev => ({ ...prev, ...defaultSoilData, ...soilDataToApply }));
      setShowSoilInfo(true);
      setSoilDataToApply(null);
    }
  }, [soilDataToApply, setSoilDataToApply]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult('');
    setIsLoading(true);
    if (Object.values(formData).some(v => v === '')) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
        ))
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResult(data.crop);
    } catch (err) {
      setError('Failed to get a prediction from the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-grow py-8 px-4 w-full">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
        <Card className="backdrop-blur-xl bg-card/60 border-border/20">
          <CardHeader>
            <TextToSpeech><CardTitle className="text-3xl font-bold">Crop Recommendation</CardTitle></TextToSpeech>
            <TextToSpeech><CardDescription>Enter the environmental data to get a recommendation.</CardDescription></TextToSpeech>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <AnimatePresence>
                {showSoilInfo && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, padding: 0, margin: 0 }} transition={{ duration: 0.3 }} className="mb-6 p-4 bg-blue-900/40 text-blue-100 border border-blue-500/50 rounded-lg flex items-start relative">
                    <Lightbulb className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                    <TextToSpeech>
                      <div>
                        <h4 className="font-bold">Soil Data Estimated</h4>
                        <p className="text-sm">The Nitrogen, Phosphorus, Potassium, and pH values have been pre-filled with common averages. For the most accurate results, please replace them with data from your own soil test kit.</p>
                      </div>
                    </TextToSpeech>
                    <Button variant="ghost" size="icon" className="h-6 w-6 absolute top-2 right-2" onClick={() => setShowSoilInfo(false)}><X className="h-4 w-4" /></Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputWithIcon icon={<Clover className="h-4 w-4 text-muted-foreground" />} name="Nitrogen" value={formData.Nitrogen} onChange={handleChange} placeholder="Nitrogen (e.g., 90)" type="number" />
                <InputWithIcon icon={<Clover className="h-4 w-4 text-muted-foreground" />} name="Phosphorus" value={formData.Phosphorus} onChange={handleChange} placeholder="Phosphorus (e.g., 42)" type="number" />
                <InputWithIcon icon={<Clover className="h-4 w-4 text-muted-foreground" />} name="Potassium" value={formData.Potassium} onChange={handleChange} placeholder="Potassium (e.g., 43)" type="number" />
                <InputWithIcon icon={<Thermometer className="h-4 w-4 text-muted-foreground" />} name="temperature" value={formData.temperature} onChange={handleChange} placeholder="Temperature °C" type="number" />
                <InputWithIcon icon={<Droplets className="h-4 w-4 text-muted-foreground" />} name="humidity" value={formData.humidity} onChange={handleChange} placeholder="Humidity %" type="number" />
                <InputWithIcon icon={<Wind className="h-4 w-4 text-muted-foreground" />} name="ph" value={formData.ph} onChange={handleChange} placeholder="pH Value (e.g., 6.5)" type="number" />
                <InputWithIcon icon={<Droplets className="h-4 w-4 text-muted-foreground" />} name="rainfall" value={formData.rainfall} onChange={handleChange} placeholder="Rainfall mm" type="number" />
                <Button type="submit" className="w-full mt-2 h-12 text-lg" disabled={isLoading}>
                  {isLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Analyzing Data...</>) : ('Get Recommendation')}
                </Button>
              </form>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <TextToSpeech><h3 className="text-xl font-semibold">About the Parameters</h3></TextToSpeech>
              <TextToSpeech>
                  <ParameterInfo icon={<Clover className="h-5 w-5 text-primary"/>} title="NPK Values">
                      Nitrogen (N), Phosphorus (P), and Potassium (K) are the three primary macronutrients essential for healthy plant growth.
                  </ParameterInfo>
              </TextToSpeech>
              <TextToSpeech>
                  <ParameterInfo icon={<Thermometer className="h-5 w-5 text-primary"/>} title="Temperature">
                      Each crop has an optimal temperature range for germination and growth. Extreme temperatures can stunt growth or kill the plant.
                  </ParameterInfo>
              </TextToSpeech>
              <TextToSpeech>
                  <ParameterInfo icon={<Droplets className="h-5 w-5 text-primary"/>} title="Humidity & Rainfall">
                      These determine the water availability for the crop. High humidity can sometimes increase the risk of fungal diseases.
                  </ParameterInfo>
              </TextToSpeech>
              <TextToSpeech>
                  <ParameterInfo icon={<Wind className="h-5 w-5 text-primary"/>} title="pH Value">
                      Soil pH affects nutrient availability. Most crops prefer a neutral pH range (6.0 to 7.5) to absorb nutrients effectively.
                  </ParameterInfo>
              </TextToSpeech>
              <AnimatePresence>
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-center text-red-500">{error}</motion.p>}
                {result && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="mt-4 p-6 bg-secondary/80 rounded-lg text-center">
                    <TextToSpeech><h3 className="text-lg font-medium text-muted-foreground">Our Recommendation</h3></TextToSpeech>
                    <TextToSpeech>
                      <p className="text-6xl font-extrabold text-primary capitalize mt-2 flex items-center justify-center">
                        <span className="mr-4 text-5xl">{cropEmojis[result.toLowerCase()] || '🌱'}</span>
                        {result}
                      </p>
                    </TextToSpeech>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}