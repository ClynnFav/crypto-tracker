import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { app } from "../api/fireBase";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: "20px",
  borderRadius: "10px",
};

export default function BuyModal({ isOpen, handleClose, cryptoData }) {
  const [cash, setCash] = useState(0);
  const [number, setNumber] = useState("");
  const cryptoID = cryptoData.symbol;
  const estimatedValue = (number / cryptoData.current_price).toFixed(6);
  const [helpertext, setHelpertext] = useState(
    "Input the amount of coins you want to buy in USD"
  );
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const handleBuyButton = async () => {
    const db = getFirestore(app);
    const newCashAmount = cash - parseFloat(number);
    const purchaseData = {
      cryptoName: cryptoID,
      price: cryptoData.current_price,
      usdAmount: number,
      amount: estimatedValue,
      cryptoImage: cryptoData.image,
      timestamp: new Date(),
    };

    const newCashData = {
      cash: newCashAmount,
    };

    try {
      await addDoc(collection(db, "purchases"), purchaseData);
      await setDoc(
        doc(db, "currentCash", "AqGKjIpt16MNOiQ6HWcA"),
        newCashData,
        { merge: true }
      );
      setCash(newCashAmount);
      setNumber("");
      setPurchaseSuccess(true); // Set success message to true after successful purchase
      // Reset success message after 2 seconds
      setTimeout(() => setPurchaseSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding purchase document:", error);
      console.error("Error updating current cash document:", error);
    }
  };

  const handleNumberChange = (event) => {
    const value = event.target.value === "" ? "" : Number(event.target.value);
    if (value > cash) {
      setNumber(cash + 1);
    } else {
      setNumber(value);
    }
    if (value >= 1) {
      if (value <= cash) {
        setHelpertext(
          `Estimated Value: ${cryptoID.toUpperCase()} ${estimatedValue}`
        );
      } else {
        setHelpertext("You don't have enough cash to make this purchase");
      }
    } else {
      setHelpertext("Input the amount of coins you want to buy in USD");
    }
  };

  useEffect(() => {
    const db = getFirestore(app);
    const cashDoc = doc(db, "currentCash", "AqGKjIpt16MNOiQ6HWcA");

    const unsubscribe = onSnapshot(cashDoc, (doc) => {
      if (doc.exists()) {
        setCash(doc.data().cash);
      } else {
        console.log("No such document!");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #ccc",
              alignItems: "center",
              paddingBottom: "10px",
            }}
          >
            <img
              src={cryptoData.image}
              style={{ height: "40px", width: "40px", marginRight: "10px" }}
              alt={cryptoData.name}
            />
            <Typography
              id="modal-modal-title"
              variant="h6"
              sx={{ fontWeight: "600" }}
              component="h2"
            >
              Buy {cryptoData.name} at ${cryptoData.current_price}
            </Typography>
            <Button variant="text" sx={{ color: "#ccc" }} onClick={handleClose}>
              X
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
              Your available cash: ${cash}
            </Typography>
            <TextField
              id="input-with-icon-textfield"
              type="number"
              value={number}
              sx={{ width: "280px" }}
              onChange={handleNumberChange}
              helperText={helpertext}
              inputProps={{
                min: 1,
                max: cash,
                style: { textAlign: "center" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span>$</span>
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
            <Button
              onClick={handleBuyButton}
              variant="outlined"
              color="success"
              disabled={number < 1 || number > cash}
              sx={{
                mt: "10px",
              }}
            >
              Buy
            </Button>
            {purchaseSuccess && (
              <Typography
                variant="body2"
                sx={{
                  color: "green",
                  marginTop: "10px",
                  position: "absolute",
                  bottom: "100px",
                  fontStyle: "italic",
                  animation: "successAnimation 1s ease forwards",
                }}
              >
                Success! Your purchase was successful.
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
