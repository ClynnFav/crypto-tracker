import React from "react";
import Carousel from "react-material-ui-carousel";
import { useGetNews } from "../api/newsApi";
import NewsCard from "./NewsCard";
import { useIsMobileView } from "../utils/resize";
import Typography from "@mui/material/Typography";

export const RelatedNews = () => {
  const news = useGetNews();
  const isMobileView = useIsMobileView();
  const numberOfRows = isMobileView ? 1 : 3;

  // Group the news items into arrays based on the number of rows
  const groupedNews = chunkArray(news, numberOfRows);

  return (
    <div className="related-news" style={styles.container}>
      <Typography variant="h4" style={styles.title}>
        Related News
      </Typography>
      <Carousel
        className="carousel"
        animation="slide"
        indicators={isMobileView ? false : true}
        timeout={500}
        swipe={true}
        autoPlay={true}
      >
        {groupedNews.map((group, index) => (
          <div
            key={index}
            style={{
              display: isMobileView ? "block" : "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {group.map((newsItem, idx) => (
              <NewsCard
                key={idx}
                item={newsItem}
                style={{
                  height: "100%",
                  flex: "0 0 calc(33.33% - 16px)",
                  marginBottom: "16px",
                }}
              />
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

const chunkArray = (arr, size) => {
  const chunkedArr = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArr.push(arr.slice(i, i + size));
  }
  return chunkedArr;
};

const styles = {
  container: {
    background: "linear-gradient(to bottom, #f0f0f0, #ffffff)",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginBottom: "16px",
    color: "#333",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
  },
};
