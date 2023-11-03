import folderIcon from "../../assets/images/folder-icon.svg";
import "./FolderData.scss";
import CircularProgressWithLabel from "../common/CircularProgressWithLabel/CircularProgressWithLabel";

const FolderData = ({ title, value, type = "folder" }) => (
  <div className="d-flex flex-row">
    {type === "folder" && (
      <>
        <img src={folderIcon} alt="foler" />
        <div className="ms-2">
          <p className="title-typography mb-1">{title}</p>
          <p className="value-typography">{value}</p>
        </div>
      </>
    )}
    {type === "circular" && <CircularProgressWithLabel value={value} />}
  </div>
);

export default FolderData;
