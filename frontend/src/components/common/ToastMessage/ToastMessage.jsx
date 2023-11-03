import "./ToastMessage.scss";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import successIcon from "../../../assets/images/success-icon.svg";
import { TOAST_TYPE } from "../../../models/components/enums";

const getAlertIcon = (severity) => {
  if (severity === TOAST_TYPE.SUCCESS) {
    return <img src={successIcon} alt="alert" />;
  }
  return <ErrorOutlineOutlinedIcon />;
};

const ToastMessage = ({ severity, isVisible, hideToast, message }) => (
  <Snackbar
    open={isVisible}
    autoHideDuration={2000}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    data-testid="toast"
    onClose={() => {
      hideToast(false);
    }}
  >
    <Alert severity={severity} icon={getAlertIcon(severity)} className="toast-alert px-4 d-flex align-items-center">
      {message}
    </Alert>
  </Snackbar>
);

export default ToastMessage;

ToastMessage.defaultProps = {
  severity: TOAST_TYPE.SUCCESS
};
