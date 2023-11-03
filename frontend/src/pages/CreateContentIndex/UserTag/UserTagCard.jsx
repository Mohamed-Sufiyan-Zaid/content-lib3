import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import "./UserTagCard.scss";

export default function UserTagCard({ user, onClose }) {
  return (
    <Paper elevation={3} className="user-tag-card">
      <div className="user-tag-card-container">
        <div className="user-info">
          <AccountBoxTwoToneIcon className="user-icon" />
          <Typography variant="body1" className="user-name">
            {user.name}
          </Typography>
        </div>
        <IconButton edge="end" aria-label="close" onClick={() => onClose(user.id)}>
          <CloseIcon />
        </IconButton>
      </div>
    </Paper>
  );
}
