import { Button } from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import LinearWithValueLabel from "./Progress";

const AnalyzeModal = ({
  isOpen,
  onClose,
  crypto,
  analyzed,
  currentEpoch,
  children,
  numberEpoch,
}) => {
  const calculatePercentageChange = (oldValue, newValue) => {
    const percentageChange = ((newValue - oldValue) / oldValue) * 100;
    return percentageChange.toFixed(2);
  };
  const percentageChange = calculatePercentageChange(
    crypto.current_price,
    analyzed
  );

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;
  return (
    <div className={`modal ${isOpen || isClosing ? "open" : ""}`}>
      <div className="modal-content">
        <div className="header">
          <h2>{crypto.name} Estimated Return</h2>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            sx={{ margin: "10px", borderRadius: "20px" }}
          >
            Close
          </Button>
        </div>
        <div
          className="ellipsis"
          style={
            currentEpoch < numberEpoch ? { display: "block" } : { display: "none" }
          }
        >
          <p className="thinking-ellipsis">
            Analyzing<span> .</span>
            <span> .</span>
            <span> .</span>
          </p>
          <LinearWithValueLabel numberEpoch={numberEpoch} currentEpoch={currentEpoch}/>
        </div>
        <div
          className="body"
          style={currentEpoch > numberEpoch - 1 ? { display: "block" } : { display: "none" }}
        >
          <img src={crypto.image} alt={crypto.name} className="crypto--img" />
          <p className="result">$ {analyzed}</p>
          <span style={{fontSize: '15px'}} className={percentageChange > 0 ? "positive" : "negative"}>{`${
            percentageChange > 0 ? `+${percentageChange}` : percentageChange
          } %`}</span>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeModal;
