import "./CountsCard.scss";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const CountsCard = ({ title, count }) => (
  <Card
    className="card-container"
    elevation={0}
    raised={false}
    sx={{
      "minWidth": 200,
      "maxWidth": 250,
      "marginRight": 2,
      "minHeight": 150,
      "boxShadow": "none",
      "border": 0,
      "&.MuiCard-root": {
        boxShadow: "none",
        border: 0
      }
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100%",
        backgroundColor: "#e6f4ff",
        boxShadow: "none"
      }}
    >
      <div className="card-title">{title}</div>
      <div className="stats-number">{count}</div>
    </CardContent>
  </Card>
);

export default CountsCard;
