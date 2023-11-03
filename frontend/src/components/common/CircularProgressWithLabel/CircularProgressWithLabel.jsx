/* eslint-disable react/destructuring-assignment */
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import "./CircularProgressWithLabel.scss";

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} color="progressBar" />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        className={props.boxClassName}
      >
        <p className="circular-progress-bar-text m-0">{props.value}</p>
      </Box>
    </Box>
  );
}
export default CircularProgressWithLabel;
