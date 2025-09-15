import { useState, useRef } from 'react';
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, X, Microscope, Stethoscope, CheckCircle2, Cpu } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

// --- NEW: A helper component for the "How it Works" guide ---
const HowItWorksStep = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="bg-primary/20 text-primary p-3 rounded-full">
            {icon}
        </div>
        <div>
            <h4 className="text-lg font-semibold text-foreground">{title}</h4>
            <p className="text-muted-foreground">{children}</p>
        </div>
    </div>
);

export default function DiseasePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => { setPreview(reader.result); };
      reader.readAsDataURL(file);
      setResult(null);
      setError('');
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError('');
    setResult(null);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch('http://127.0.0.1:5000/predict_disease', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed to get a prediction from the server.');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-8 flex justify-center items-center">
      <Card className="w-full max-w-4xl backdrop-blur-xl bg-card/60 border-border/20 grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Left Side - Image Upload & Preview */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-full h-80 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center text-center p-4 relative cursor-pointer" onClick={() => fileInputRef.current.click()}>
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={(e) => { e.stopPropagation(); clearSelection(); }}><X className="h-4 w-4" /></Button>
              </>
            ) : (
              <div className="text-muted-foreground">
                <Upload className="mx-auto h-12 w-12" />
                <p>Click to upload an image</p>
                <p className="text-xs">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg" />
          <Button onClick={handlePredict} disabled={!selectedFile || isLoading} className="w-full text-lg h-12">
            {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Analyzing...</> : <><Microscope className="mr-2 h-5 w-5" />Diagnose Plant</>}
          </Button>
        </div>

        {/* Right Side - Results or "How it Works" guide */}
        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="text-3xl font-bold">Diagnosis Result</h2>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center mb-2"><Stethoscope className="mr-2 h-4 w-4"/> CONDITION</h3>
                  <div className={`flex items-center gap-3 p-3 rounded-md ${result.disease.includes('healthy') ? 'bg-green-500/20 text-green-300' : 'bg-destructive/20 text-destructive-foreground'}`}>
                    {result.disease.includes('healthy') ? <CheckCircle2 className="h-8 w-8 text-green-400"/> : <Stethoscope className="h-8 w-8 text-red-400"/>}
                    <div className="flex-grow">
                      <p className="text-xl font-bold capitalize">{result.disease}</p>
                      <p className="text-xs font-mono">Confidence: {result.confidence}</p>
                    </div>
                  </div>
                </div>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-semibold">View Recommendation</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Recommended Treatment(s):</h4>
                        <p>{result.recommendation.fertilizers}</p>
                      </div>
                      {result.recommendation.notes && (<div><h4 className="font-semibold text-foreground mb-1">Notes:</h4><p>{result.recommendation.notes}</p></div>)}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ) : (
              // --- NEW: "How it Works" guide for the initial state ---
              <motion.div key="guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <h2 className="text-3xl font-bold">How It Works</h2>
                 <div className="space-y-6">
                    <HowItWorksStep icon={<Upload className="h-6 w-6"/>} title="1. Upload Your Image">
                        Select a clear photo of the plant leaf you are concerned about.
                    </HowItWorksStep>
                    <HowItWorksStep icon={<Cpu className="h-6 w-6"/>} title="2. AI-Powered Analysis">
                        Our trained model scans the image for patterns and signs of common diseases.
                    </HowItWorksStep>
                    <HowItWorksStep icon={<Stethoscope className="h-6 w-6"/>} title="3. Instant Diagnosis">
                        Receive a confident diagnosis and actionable recommendations in seconds.
                    </HowItWorksStep>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}