import Button from "@mui/material/Button";
import { useRef } from "react";

import "./UploadButton.scss";
import { uploadBoxText } from "../../../i18n/Components";
import { FILE_TYPE } from "../../../models/components/constants";

const UploadButton = ({ acceptedFileTypes = FILE_TYPE, setFiles, allowMultipleUpload = true, isUploadDisabled = false }) => {
  // const [showBrowseFiles, setShowBrowseFiles] = useState(true);
  const inputRef = useRef(null);

  const onFileChange = (e) => {
    if (!e.target.files) {
      return;
    }
    //  setShowBrowseFiles(false);
    setFiles(e.target.files);
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="UploadButton">
      <div className="dotted-div">
        <Button variant="contained" onClick={handleUploadClick} disabled={isUploadDisabled}>
          {uploadBoxText.browseFiles}
        </Button>
      </div>
      <input
        type="file"
        ref={inputRef}
        multiple={allowMultipleUpload}
        onChange={onFileChange}
        className="hidden"
        disabled={isUploadDisabled}
        accept={acceptedFileTypes.join(",")}
        data-testid="UploadButton"
      />
    </div>
  );
};

export default UploadButton;
