import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";

import UploadBox from "../../components/common/UploadBox/UploadBox";
import "./UploadTemplate.scss";
import { commonText } from "../../i18n/Common";

function UploadTemplate({ open, setOpen }) {
  const [files, setFiles] = useState([]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = () => {
    const formData = new FormData();
    formData.append("file", files[0]);
    // TODO: Call API to upload file as binary using formData where body: formData and 'Content-Type': 'multipart/form-data'
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title" className="uploadTemplateDialog">
      <DialogContent>
        <UploadBox setFiles={setFiles} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          {commonText.cancel}
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {commonText.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadTemplate;
