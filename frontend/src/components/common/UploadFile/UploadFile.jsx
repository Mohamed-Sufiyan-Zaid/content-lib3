import Button from "@mui/material/Button";
import { useState, useRef } from "react";

import FileUpload from "../../../assets/images/file-primary.svg?react";
import uploadSvg from "../../../assets/images/upload.svg";
import { uploadBoxText } from "../../../i18n/Components";
import { FILE_TYPE } from "../../../models/components/constants";
import "./UploadFile.scss";

const UploadFile = ({
  acceptedFileTypes = FILE_TYPE,
  setFiles,
  allowMultipleUpload = true,
  isUploadDisabled = false,
  instructions,
  subInstructions
}) => {
  const [showBrowseFiles, setShowBrowseFiles] = useState(true);
  // const [hightlight, setHightlight] = useState(false);
  const inputRef = useRef(null);

  const onFileChange = (e) => {
    if (!e.target.files) {
      return;
    }
    setShowBrowseFiles(false);
    setFiles(e.target.files);
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  // const handleFileRemove = (e) => {
  //   const newFilesArray = [...uploadedFiles];
  //   const deleteIndex = e.target.id;
  //   newFilesArray.splice(deleteIndex, 1);
  //   setUploadedFiles(newFilesArray);

  //   setShowBrowseFiles(false);
  //   if (newFilesArray.length === 0) {
  //     setShowBrowseFiles(true);
  //   }
  //   setFiles(newFilesArray);
  // };

  const fileAccepted = (files) => {
    const acceptedFiles = [...acceptedFileTypes];
    const rejectedFiles = [];
    Array.from(files).forEach((file) => {
      if (!acceptedFiles.includes(file.type)) {
        rejectedFiles.push(file.name);
      }
    });
    const isAcceptable = !rejectedFiles.length;
    return isAcceptable;
  };

  const onDragOver = (evt) => {
    evt.preventDefault();

    // if (isUploadDisabled) return;
    // setHightlight(true);
  };

  // const onDragLeave = () => {
  //   setHightlight(false);
  // };

  const onDrop = (event) => {
    event.preventDefault();
    // setHightlight(false);

    if (isUploadDisabled) return;
    if (allowMultipleUpload && event.target.files?.length > 1) return;

    const { files } = event.dataTransfer;
    const isAcceptable = fileAccepted(files);
    if (!isAcceptable) return; // invalid file type
    setShowBrowseFiles(false);
    setFiles(files);
  };

  return (
    // <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="dialog-title" className="MuiDialog-root">
    <div className="uploadFile">
      <div>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          // onDragLeave={onDragLeave}
          role="presentation"
        >
          {/* <p className="card-title">{title}</p> */}
          <div className="dotted-div">
            {showBrowseFiles && (
              <>
                <img src={uploadSvg} alt={uploadBoxText.uploadAlt} className="upload-img" />
                <p className="upload-text">{uploadBoxText.selectFilesFromDevice}</p>
                <p className="sub-upload-text">{uploadBoxText.maxFilesLimit}</p>
                <p className="sub-upload-text2">{uploadBoxText.supportedFiles}</p>
                <Button variant="outlined" className="mt-4" endIcon={<FileUpload />} onClick={handleUploadClick} disabled={isUploadDisabled}>
                  {uploadBoxText.browseFiles}
                </Button>
              </>
            )}
          </div>
          {instructions && (
            <div className="d-flexflex-column">
              <p className="instructions">{instructions}</p>
              {!showBrowseFiles && subInstructions && <p className="sub-instructions instructions">{uploadBoxText.fileInstructions}</p>}
            </div>
          )}
          <input
            type="file"
            ref={inputRef}
            multiple={allowMultipleUpload}
            onChange={onFileChange}
            className="hidden"
            disabled={isUploadDisabled}
            accept={acceptedFileTypes.join(",")}
            data-testid="UploadFile"
          />
        </div>
      </div>
    </div>
    // </Dialog>
  );
};

export default UploadFile;
