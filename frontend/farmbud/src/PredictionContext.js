import React, { createContext, useState, useContext } from 'react';

const PredictionContext = createContext();

export const usePrediction = () => useContext(PredictionContext);

export const PredictionProvider = ({ children }) => {
  const [soilDataToApply, setSoilDataToApply] = useState(null);

  return (
    <PredictionContext.Provider value={{ soilDataToApply, setSoilDataToApply }}>
      {children}
    </PredictionContext.Provider>
  );
};