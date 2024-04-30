import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Typography from "@mui/material/Typography";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SparklineChart from "./SparkLine";
import { Button } from "@mui/material";
import { useCryptoData } from "../api/getCryptoApi";
import BuyModal from "./BuyModal";
import WalletIcon from "@mui/icons-material/Wallet";
import WalletModal from "./WalletModal";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default function CryptoTable() {
  const cryptoData = useCryptoData();
  const [totalCell, setTotalCell] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  const handleOpenWallet = () => {
    setIsWalletOpen(true);
  }

  const handleCloseWallet = () => {
    setIsWalletOpen(false);
  }

  const handleOpenModal = (data) => {
    setSelectedCrypto(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toComma = (x) => {
    if (Number.isInteger(x)) {
      if (x.toString()[0] === "0") {
        return x.toString();
      }
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      let parts = x.toString().split(".");
      if (parts[0][0] === "0") {
        return x.toString();
      }
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
  };

  const handleViewMore = () => {
    setTotalCell((prevTotalCell) => prevTotalCell + 10);
  };

  const handleViewLess = () => {
    setTotalCell((prevTotalCell) => prevTotalCell - 10);
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <Typography variant="h5" sx={{ m: "10px" }}>
          Cryptocurrency Prices by Market Cap
        </Typography>
        <Button
        onClick={handleOpenWallet}
        variant="contained"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "10px",
            padding: "8px",
          }}
        >
          <WalletIcon sx={{ fontSize: 40 }} />
          <Typography variant="h8">My Wallet</Typography>
        </Button>
      </div>
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{ marginBottom: "30px", borderRadius: "20px" }}
      >
        <Table aria-label="simple table" className="table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EmojiEventsIcon color="primary" />
                  <span>Rank</span>
                </div>
              </TableCell>
              <TableCell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <MonetizationOnIcon color="secondary" />
                  <span>Coin</span>
                </div>
              </TableCell>
              <TableCell align="right">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CurrencyExchangeIcon
                    sx={{ backgroundColor: "gold", borderRadius: "50%" }}
                  />
                  <span>Price</span>
                </div>
              </TableCell>
              <TableCell align="right">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccountBalanceWalletIcon color="disabled" />
                  <span>Market Cap</span>
                </div>
              </TableCell>
              <TableCell align="right">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUpIcon color="success" />
                  <span>High 24h</span>
                </div>
              </TableCell>
              <TableCell align="right">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingDownIcon color="error" />
                  <span>Low 24h</span>
                </div>
              </TableCell>
              <TableCell align="right">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DateRangeIcon color="info" />
                  <span>Last 7 Days</span>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="table-body">
            {cryptoData.slice(0, totalCell).map((data) => (
              <TableRow
                key={data.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <TableCell align="center">{data.market_cap_rank}</TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <img
                      src={data.image}
                      alt={data.name}
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "8px",
                        border: "2px solid #000",
                        borderRadius: "50%",
                      }}
                    />
                    {data.name}
                    <span
                      style={{
                        marginLeft: "5px",
                        textTransform: "uppercase",
                        opacity: "0.5",
                      }}
                    >
                      {data.symbol}
                    </span>
                    <button
                      onClick={() => handleOpenModal(data)}
                      className="buy-button"
                    >
                      BUY
                    </button>
                    <button className="sell-button">SELL</button>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <Typography fontFamily="Monospace" variant="body1">
                    ${toComma(data.current_price)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography fontFamily="Monospace" variant="body1">
                    ${toComma(data.market_cap)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography fontFamily="Monospace" variant="body1">
                    ${toComma(data.high_24h)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography fontFamily="Monospace" variant="body1">
                    ${toComma(data.low_24h)}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ p: "5px" }}>
                  <SparklineChart data={data} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div className="view-button">
            {totalCell < cryptoData.length - 1 && (
              <Button
                onClick={handleViewMore}
                variant="contained"
                color="primary"
                sx={{ margin: "20px", borderRadius: "20px" }}
              >
                View More
              </Button>
            )}
            {totalCell > 10 && (
              <Button
                onClick={handleViewLess}
                variant="contained"
                color="primary"
                sx={{ margin: "20px", borderRadius: "20px" }}
              >
                View Less
              </Button>
            )}
          </div>
          <Typography
            sx={{
              alignSelf: "center",
              paddingRight: "10px",
              fontStyle: "italic",
            }}
          >
            Showing {totalCell} of {cryptoData.length} results
          </Typography>
        </div>
        {isModalOpen ? (
          <BuyModal
            isOpen={isModalOpen}
            handleClose={handleCloseModal}
            cryptoData={selectedCrypto}
          />
        ) : null}
        {isWalletOpen ? (
          <WalletModal
            isOpen={isWalletOpen}
            handleClose={handleCloseWallet}
          />
        ) : null}
      </TableContainer>
    </ThemeProvider>
  );
}
