import CircularProgress from "@mui/material/CircularProgress";

export default function Loader({ isLoading }) {
  return isLoading && <CircularProgress className="start-50 top-50 d-flex position-fixed" />;
}
