import AttachmentIcon from "@mui/icons-material/Attachment";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LanguageIcon from "@mui/icons-material/Language";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import GdmsDocumentsUpload from "./GdmsDocumentsUpload";

import "./GdmsDocuments.scss";
import { GdmsDocHomeText } from "../../../i18n/GdmsDocHomeText";

const GdmsDocumentsHome = () => {
  const [url, setUrl] = useState("");
  const [showDocumentListComponent, setShowDocumentListComponent] = useState(false);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleArrowClick = () => {
    setShowDocumentListComponent(true);
  };

  return (
    <div className="gdms-documents-home">
      {showDocumentListComponent ? (
        <GdmsDocumentsUpload />
      ) : (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <AttachmentIcon style={{ color: "gray" }} />
          <Typography variant="subtitle1" style={{ fontSize: "16px", fontWeight: "bold" }}>
            {GdmsDocHomeText.enterUrlHeading}
          </Typography>
          <p style={{ fontSize: "10px", color: "gray" }}>{GdmsDocHomeText.supportedFileSubHeading}</p>

          <TextField
            style={{ width: "60%", marginTop: "10px" }}
            placeholder={GdmsDocHomeText.enterUrlPlaceholder}
            value={url}
            onChange={handleUrlChange}
            InputProps={{
              startAdornment: <LanguageIcon color="disabled" />,
              endAdornment: <KeyboardArrowRightIcon style={{ color: "blue", cursor: "pointer" }} onClick={handleArrowClick} />,
              underline: "none"
            }}
          />
        </div>
      )}
    </div>
  );
};

export default GdmsDocumentsHome;
