import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import downloadIcon from "../../assets/images/download.svg";
import { useFetcher } from "../../hooks/useReactQuery";
import { commonText } from "../../i18n/Common";
import { DocumentHeaderText } from "../../i18n/Components";
import { returnBreadCrumb } from "../../utils/breadCrumbMapper";
import { ContentLibraryApiEndpoints, ContentQueryKeys } from "../../utils/constants";
import { ApiResponseKeys } from "../../utils/contentApiKeysMap";
import "./DocumentHeader.scss";
import NavHeader from "../common/NavHeader/NavHeader";
import Select from "../common/Select/Select";

const DocumentHeader = ({
  navigationHeader,
  defaultTitle,
  documentNameLabel,
  documentNamePlaceHolder,
  selectedLibrary,
  handleDownload,
  templateLabel,
  numOfSections,
  contentLibraryLabel,
  setSelectedLibrary,
  selectedTemplate,
  handleSave
}) => {
  const [inEditState, setEditState] = useState(false);
  const [input, setInput] = useState(defaultTitle);
  const [contentDropdownData, setContentDropdownData] = useState([]);
  const { projectId } = useParams();
  const { data: contentLibrarySelectData, isSuccess: isContentLibraryDataSuccess } = useFetcher({
    url: ContentLibraryApiEndpoints.contentIndex,
    queryKey: [ContentQueryKeys.content],
    enableQuery: true,
    staleTime: 10000,
    project: "contentLib"
  });

  const handleLibrary = ({ target: { value } }) => {
    setSelectedLibrary({ contentIndexId: value });
  };

  useEffect(() => {
    setInput(defaultTitle);
  }, [defaultTitle]);

  useEffect(() => {
    const data = contentLibrarySelectData?.map((element) => ({
      name: element[ApiResponseKeys.contentIndexName],
      id: element[ApiResponseKeys.contentIndexId]
    }));
    setContentDropdownData(data);
  }, [contentLibrarySelectData, isContentLibraryDataSuccess]);

  return (
    <div className="doc-header d-d-flex flex-column">
      {navigationHeader && <NavHeader breadcrumbData={returnBreadCrumb("manageDocuments", projectId)} />}
      {documentNameLabel && (
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="d-flex flex-row align-items-center">
            <p className="input-label">{documentNameLabel}</p>
            {!inEditState ? (
              <div className="d-flex flex-row align-items-center ms-3 label-value">
                <p>{input}</p>
                <IconButton className="ml-2" size="small" onClick={() => setEditState(true)}>
                  <EditOutlinedIcon />
                </IconButton>
              </div>
            ) : (
              <div className="d-flex flex-row align-items-center ms-3 label-value">
                <TextField
                  value={input}
                  size="small"
                  onChange={(e) => {
                    setInput(e.currentTarget.value);
                  }}
                  variant="outlined"
                  placeholder={documentNamePlaceHolder || ""}
                />
                <IconButton size="small" onClick={() => setEditState(false)}>
                  <DoneOutlinedIcon />
                </IconButton>
              </div>
            )}
          </div>
          <div className="d-flex flex-row align-items-center">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSave}
              disabled={input.length === 0 || inEditState}
              className="edit-doc-btn"
              size="small"
              sx={{ "borderRadius": "2rem", "maxWidth": "10px", "& button": { m: 1 } }}
            >
              {DocumentHeaderText.saveOpt}
            </Button>
            <IconButton size="small" onClick={handleDownload} className="ms-2">
              <img src={downloadIcon} alt={commonText.downloadIconAlt} />
            </IconButton>
          </div>
        </div>
      )}
      {templateLabel && (
        <div className="d-flex flex-row justify-content-between align-items-center mt-2 mb-2">
          <div className="d-flex flex-row align-items-baseline cust-select-width">
            <p className="input-label">{templateLabel}</p>
            <p className="mx-3">{selectedTemplate}</p>
          </div>
          {numOfSections && (
            <div className="d-flex flex-row align-items-center">
              <p className="input-label">{DocumentHeaderText.section}</p>
              <p className="ms-3 label-value">{numOfSections}</p>
            </div>
          )}
        </div>
      )}
      {contentLibraryLabel && (
        <div className="d-flex flex-row justify-content-between align-items-center mt-1">
          <div className="d-flex flex-row align-items-baseline cust-select-width">
            <p className="input-label">{contentLibraryLabel}</p>
            <Select
              value={selectedLibrary.contentIndexId === -1 ? "" : selectedLibrary.contentIndexId}
              placeholder="Select a Library"
              options={contentDropdownData}
              margin={{ xs: "0 0 0.5rem 0.5rem", md: "0 0 1rem 1rem" }}
              onChange={handleLibrary}
              isOptionsArrayOfObjects
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default DocumentHeader;
