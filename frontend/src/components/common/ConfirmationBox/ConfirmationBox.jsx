import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import "./ConfirmationBox.scss";

export default function ConfirmationBox({
  isOpen,
  title,
  handleClose,
  handleAccept,
  children,
  agreeText,
  disagreeText,
  isAgreeDisabled = true,
  dialogContentClassName = ""
}) {
  const handleAgree = () => {
    handleAccept();
    handleClose();
  };
  return (
    <Dialog
      PaperProps={{ style: { maxWidth: "100%", borderRadius: "1rem" } }}
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-confirmation-title"
      aria-describedby="alert-confirmation-description"
    >
      {title && <DialogTitle className="confirmation-title">{title}</DialogTitle>}
      <DialogContent classes={{ root: dialogContentClassName }}>{children}</DialogContent>
      <Divider className="confirmation-box-divider mb-3" />
      <DialogActions sx={{ padding: 0 }}>
        {disagreeText && (
          <Button onClick={handleClose} variant="outlined" size="small" className="confirmation-btns">
            {disagreeText}
          </Button>
        )}
        {agreeText && (
          <Button variant="contained" onClick={handleAgree} size="small" disabled={isAgreeDisabled} className="confirmation-btns">
            {agreeText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

ConfirmationBox.defaultProps = {
  isOpen: false
};
