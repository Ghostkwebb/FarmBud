import React, { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Volume2, Pause } from 'lucide-react';

const TextToSpeech = ({ children }) => {
  const textRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // This is the most important part: We must wait for the browser to load its voices.
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    
    // The 'voiceschanged' event is fired when the list of voices is ready.
    window.speechSynthesis.onvoiceschanged = loadVoices;
    // Call it once to catch the case where voices are already loaded.
    loadVoices();

    // Cleanup function
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel(); // Stop any speech on component unmount
    };
  }, []);

  const handleSpeak = (event) => {
    event.stopPropagation();
    const synth = window.speechSynthesis;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    if (textRef.current) {
      synth.cancel(); // Stop any previous speech

      const textToSpeak = textRef.current.textContent;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const lang = document.documentElement.lang || 'en-US';
      utterance.lang = lang;

      // Intelligently find the best voice for the current language
      const bestVoice = voices.find(voice => voice.lang.startsWith(lang)) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      utterance.voice = bestVoice;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("SpeechSynthesis Error:", e);
        setIsSpeaking(false);
      };

      synth.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="flex items-center gap-2 group tts-wrapper">
      <span ref={textRef} className="flex-grow">{children}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSpeak}
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        aria-label="Read text aloud"
      >
        {isSpeaking ? (
          <Pause className="h-4 w-4 text-primary animate-pulse" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default TextToSpeech;