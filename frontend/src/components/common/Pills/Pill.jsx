import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";

const Pill = ({ label, onDelete }) => (
  <Chip
    label={label}
    onDelete={onDelete}
    deleteIcon={<CloseIcon />}
    sx={{ marginRight: "8px", marginTop: "10px", color: "#2B50BA", bgcolor: "#2b50ba36" }}
  />
);

export default Pill;
