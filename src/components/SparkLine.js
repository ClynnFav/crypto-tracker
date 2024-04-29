import { Button } from "@mui/material";
import React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import * as tf from '@tensorflow/tfjs';
import AnalyzeModal from "./AnalyzeModal";
import { useState, useEffect } from "react";

const SparklineChart = ({ data }) => {
  const sparkLine = data.sparkline_in_7d.price;
  const color = sparkLine[sparkLine.length - 1] > sparkLine[0] ? "green" : "red";
  const [isOpen, setIsOpen] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [analyzedRequested, setAnalyzedRequested] = useState(false);
  const [analyzed, setAnalyzed] = useState(null);

  const openModal = () => {
    setIsOpen(true);
    setAnalyzedRequested(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const predictNextWeek = async () => {
      if (!analyzedRequested) return;
      // Enable GPU acceleration
  await tf.setBackend('webgl');

  // Normalize the input data
  const normalizedSparkline = normalize(sparkLine);

  const xs = normalizedSparkline.slice(0, -1).map((_, i) => normalizedSparkline.slice(i, i + 1));
  const ys = normalizedSparkline.slice(1);

  const xsTensor = tf.tensor2d(xs);
  const ysTensor = tf.tensor1d(ys);

  // Define and train the model
  const trainModel = async (xs, ys) => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, inputShape: [1] }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
  const callbacks = {
    onEpochEnd: (epoch, logs) => {
      setCurrentEpoch(epoch + 1); // Epochs start from 0, so add 1
    }
  };
  
  await model.fit(xs, ys, { epochs: 2000, callbacks });
  return model;
  };

  const model = await trainModel(xsTensor, ysTensor);

  // Make prediction for the next week
  const lastDataPoint = normalizedSparkline.slice(-1);
  const nextDataPoint = await model.predict(tf.tensor2d([lastDataPoint])).data();

  // Denormalize prediction
  const analyzed = denormalize(nextDataPoint, sparkLine);
  const updateDecimal = fixDecimals(analyzed);

  setAnalyzed(updateDecimal);
    };

    predictNextWeek();
  }, [analyzedRequested]);

  return (
    <div>
      <Sparklines data={sparkLine} height={100}>
        <SparklinesLine color={color} />
      </Sparklines>
      <Button onClick={openModal}
        variant="outlined"
        color="primary"
        sx={{
          borderRadius: "20px",
          padding: "4px 8px",
          fontSize: "0.6rem",
          "&:hover": {
            backgroundColor: "rgb(25, 118, 210)",
            color: "white",
          },
        }}
      >
        Analyze
      </Button>
      <AnalyzeModal isOpen={isOpen} onClose={closeModal} crypto={data} analyzed={analyzed} currentEpoch={currentEpoch} />
    </div>
  );
};

// Function to normalize data to range [0, 1]
const normalize = (data) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  return data.map(value => (value - min) / (max - min));
};

// Function to denormalize normalized data
const denormalize = (normalizedValue, originalData) => {
  const max = Math.max(...originalData);
  const min = Math.min(...originalData);
  return normalizedValue * (max - min) + min;
};

const fixDecimals = number => number < 1 ? number.toFixed(6) : number.toFixed(2);

export default SparklineChart;
