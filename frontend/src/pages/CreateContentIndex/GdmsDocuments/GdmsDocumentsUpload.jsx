import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LanguageIcon from "@mui/icons-material/Language";
import SyncIcon from "@mui/icons-material/Sync";
import { TextField, Button, IconButton } from "@mui/material";
import { useState, useEffect } from "react";

import Table from "../../../components/common/Table/Table";
import { commonText } from "../../../i18n/Common";
import { GdmsDocUploadText } from "../../../i18n/GdmsDocUploadText";
import { GdmsDocumentsData } from "../../../jsonData/contentLibData";
import "./GdmsDocuments.scss";
import AdvancedSettings from "../../AdvancedSettings/AdvancedSettings";
import TotalAndAdvancedSettings from "../TotalAndAdvancedSettings";

function GdmsDocumentsUpload() {
  const [url, setUrl] = useState("");
  const [openAnchor, setOpenAnchor] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const ProjectTableHeaders = ["Document Name", "Actions"];
  const [flag, setFlag] = useState(0);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleArrowClick = () => {};

  const handleDeleteDocument = () => {};

  const generateTableContent = () => {
    const newTableData = [];
    if (GdmsDocumentsData && GdmsDocumentsData.length > 0) {
      GdmsDocumentsData?.forEach((document, index) => {
        if (document.document_name?.length > 0) {
          setFlag(document.document_name?.length);
          const deleteIcon = (
            <IconButton onClick={() => handleDeleteDocument(document.id)} style={{ color: "blue" }}>
              <DeleteIcon />
            </IconButton>
          );
          newTableData[index + 1] = [document.document_name, deleteIcon];
        }
      });
    } else {
      newTableData[0] = ["Yet to save links"];
    }
    setTableRows(newTableData);
  };

  useEffect(() => {
    generateTableContent();
  }, [tableRows]);
  const settingsBtnListener = () => {
    setOpenAnchor(true);
  };

  const closeListener = (openDrawer) => {
    setOpenAnchor(openDrawer);
  };
  return (
    <div style={{ margin: "10px" }} className="gdms-documents-upload">
      <AdvancedSettings anchor="right" open={openAnchor} closeListener={closeListener} />
      <div className="card">
        <div className="card-body">
          <div className="grid-container">
            <div className="section">
              <label>{GdmsDocUploadText.linkedDocsLabel}</label>
              <p>{GdmsDocUploadText.numberOfLinkedDocs}</p>
            </div>

            <div className="section">
              <label>{GdmsDocUploadText.enterGdmsUrlLabel}</label>
              <TextField
                style={{ width: "100%" }}
                placeholder="Enter a URL"
                value={url}
                onChange={handleUrlChange}
                InputProps={{
                  startAdornment: <LanguageIcon color="disabled" />,
                  endAdornment: flag ? (
                    <KeyboardArrowRightIcon style={{ color: "blue", cursor: "pointer" }} onClick={handleArrowClick} />
                  ) : (
                    <SyncIcon style={{ color: "green", cursor: "pointer" }} onClick={handleArrowClick} />
                  ),
                  underline: "none",
                  style: { background: "transparent" }
                }}
              />
            </div>

            <div className="section">
              <Button className="save-btn" variant="outlined">
                {commonText.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="card">
        <div className="card-body">
          <Table
            rows={tableRows}
            headers={ProjectTableHeaders}
            // isPaginated
            // pageNo={tablePageNo}
            // handlePageChange={(_, newPage) => setTablePageNo(newPage)}
          />
        </div>
      </div>
      <div className="card">
        <TotalAndAdvancedSettings settingsBtnListener={settingsBtnListener} />
      </div>
    </div>
  );
}

export default GdmsDocumentsUpload;
