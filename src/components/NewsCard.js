import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Chip, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useIsMobileView } from "../utils/resize";

export const ActionAreaCard = ({ item }) => {
  const isMobileView = useIsMobileView();
  const imageHeight = isMobileView ? 150 : 200;

  // Format the date
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <Card sx={{ maxWidth: 345 }} className="card">
      <CardActionArea
        className="card__action"
        component="a" 
        href={item.url}
        target='_blank' 
        rel='noreferrer'
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          height: "100%",
          justifyContent: "flex-start",
        }}
      >
        <CardMedia
          className="card__media"
          component="img"
          height={imageHeight}
          image={item.thumb_1x}
          alt={item.title}
          sx= {{
            flex: "1 0 auto",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "stretch",
            height: "100%",
          }}
        >
          <CardContent
            className="card__content"
            sx={{
              flex: "1 0 auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              className="card__content--title"
              sx={{ flex: "1 0 auto" }}
            >
              {item.title}
            </Typography>
            <div
              className="card__content--info"
              style={{ display: "flex", alignItems: "center" }}
            >
              <AccessTimeIcon
                style={{ marginRight: "8px", color: "#757575" }}
              />
              <Chip
                label={formatDate(item.updated_at)}
                variant="outlined"
                size="small"
                style={{ color: "#757575", borderColor: "#757575" }}
              />
            </div>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default ActionAreaCard;
