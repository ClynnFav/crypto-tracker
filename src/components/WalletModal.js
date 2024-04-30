import {
  Box,
  Typography,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCryptoData } from "../api/getCryptoApi";
import PieChartComponent from "./Pie";
import { style } from "./BuyModal";
import { app } from "../api/fireBase";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PieChartIcon from "@mui/icons-material/PieChart";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";

export const estimatedValue = (amount, cryptoName, cryptoData) => {
  const exchangeRate = cryptoData.find(
    (currency) => currency.symbol === cryptoName
  );
  return (amount * exchangeRate.current_price).toFixed(3);
};

export default function WalletModal({ isOpen, handleClose }) {
  const [cash, setCash] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [withNoData, setWithNoData] = useState(true);
  const cryptoData = useCryptoData();

  const percentageChange = (currentPrice, previousPrice) => {
    return (((currentPrice - previousPrice) / previousPrice) * 100).toFixed(2);
  };

  const totalAmounts = purchases.reduce((accumulator, purchase) => {
    const { cryptoName, amount } = purchase;
    accumulator[cryptoName] =
      (accumulator[cryptoName] || 0) +
      parseFloat(estimatedValue(amount, cryptoName, cryptoData));
    return accumulator;
  }, {});

  const totalUsdAmount = purchases.reduce(
    (sum, purchase) => sum + purchase.usdAmount,
    0
  );

  const sum = Object.keys(totalAmounts).reduce((acc, cryptoName) => {
    return acc + totalAmounts[cryptoName];
  }, 0);

  const getReturnPercentage = () => {
    if(sum) {
      return (((sum - totalUsdAmount) / totalUsdAmount) * 100).toFixed(3);
    } else {
      return 0;
    }
  };


  useEffect(() => {
    const retrieveData = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "purchases"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      if (data.length > 0) {
        setWithNoData(false);
      }
      setPurchases(data);
    };

    const db = getFirestore(app);
    const cashDoc = doc(db, "currentCash", "AqGKjIpt16MNOiQ6HWcA");

    const unsubscribe = onSnapshot(cashDoc, (doc) => {
      if (doc.exists()) {
        setCash(doc.data().cash);
      } else {
        console.log("No such document!");
      }
    });

    if (isOpen) {
      retrieveData();
      return () => unsubscribe();
    }
  }, [isOpen]);

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Typography sx={{ fontWeight: "900", mb: "10px" }}>Account</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <div
            className="cash"
            style={{ display: "flex", alignItems: "center", gap: '10px' }}
          >
            <MonetizationOnIcon />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ opacity: "0.5" }}>Cash</Typography>
              <Typography>${cash}</Typography>
            </div>
          </div>
          <div
            className="equity"
            style={{ display: "flex", alignItems: "center" ,gap: '10px'}}
          >
            <PieChartIcon />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ opacity: "0.5" }}>Equity</Typography>
              <Typography>${sum.toFixed(3)}</Typography>
            </div>
          </div>
          <div
            className="returns"
            style={{ display: "flex", alignItems: "center" ,gap: '10px'}}
          >
            <AutoGraphIcon />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ opacity: "0.5" }}>Total Return</Typography>
              <Typography sx={{color:getReturnPercentage() < 0 ? 'red' : 'green' }}>{getReturnPercentage()}%</Typography>
            </div>
          </div>
        </Box>
        <Typography sx={{ fontWeight: "900", mb: "10px", mt: "10px" }}>
          Positions
        </Typography>
        {withNoData && <Typography>You have no positions.</Typography>}
        {!withNoData && (
          <Box sx={{ display: "flex" }}>
            <Table sx={{ width: "50%", alignSelf: "flex-start" }}>
              <TableBody>
                {purchases.map((purchase, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ p: "0" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={purchase.cryptoImage}
                          alt="crypto logo"
                          width="25px"
                          height="25px"
                          style={{ marginRight: "5px" }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                          }}
                        >
                          <span style={{ textTransform: "uppercase" }}>
                            {purchase.cryptoName}
                          </span>
                          <span style={{ opacity: "0.5" }}>
                            {parseFloat(purchase.amount).toFixed(6)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                        }}
                      >
                        <span>
                          $
                          {estimatedValue(
                            purchase.amount,
                            purchase.cryptoName,
                            cryptoData
                          )}
                        </span>
                        <span
                          style={{
                            fontStyle: "italic",
                            color:
                              percentageChange(
                                estimatedValue(
                                  purchase.amount,
                                  purchase.cryptoName,
                                  cryptoData
                                ),
                                purchase.usdAmount
                              ) < 0
                                ? "red"
                                : "green",
                          }}
                        >
                          {percentageChange(
                            estimatedValue(
                              purchase.amount,
                              purchase.cryptoName,
                              cryptoData
                            ),
                            purchase.usdAmount
                          )}
                          %
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {isOpen && (
              <PieChartComponent
                purchases={purchases}
                totalAmounts={totalAmounts}
              />
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
