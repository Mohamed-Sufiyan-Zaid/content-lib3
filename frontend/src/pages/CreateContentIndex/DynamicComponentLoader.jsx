import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Button from "@mui/material/Button";

import DataSources from "./DataSources";
import UploadDocumentContentIndexDetails from "./UploadDocuments/UploadDocumentContentIndexDetails";
import UploadDocumentsHome from "./UploadDocuments/UploadDocumentsHome";

export default function DynamicComponentLoader({ childComponents, childComponentsIndexDetails, onDataSourceClick, selectedDataSource }) {
  const renderDataSourceComponent = () => {
    if (selectedDataSource) {
      const SelectedComponent = childComponents[selectedDataSource.name]?.component;
      if (SelectedComponent) {
        return <SelectedComponent />;
      }
    }
    return null;
  };

  const renderDataSourceDetailsComponent = () => {
    if (selectedDataSource) {
      const SelectedComponent = childComponentsIndexDetails[selectedDataSource.name]?.component;
      if (SelectedComponent) {
        return <SelectedComponent />;
      }
    }
    return null;
  };

  return (
    <div className="main-container">
      <hr style={{ margin: "0" }} />
      <div className="custom-header-container">
        <p className="custom-header-text">Select Data Sources</p>
        <InfoOutlinedIcon className="custom-header-icon" />
      </div>

      <div className="custom-container">
        <div className="card">
          <div className="custom-row">
            <div className="custom-p-right">
              <DataSources onDataSourceClick={onDataSourceClick} />
            </div>
            <div className="custom-right bg">{selectedDataSource === "Upload Documents" ? <UploadDocumentsHome /> : renderDataSourceComponent()}</div>
          </div>
          <hr style={{ margin: "0" }} />
          {/* {selectedDataSource && (
            
          )} */}
        </div>
      </div>

      <br />
      {selectedDataSource && (
        <>
          <div className="custom-header-container-details">
            <p className="custom-header-text">Content index details</p>
            <InfoOutlinedIcon className="custom-header-icon" />
          </div>
          <div className="card">
            <div className="card-body bg">
              {selectedDataSource === "Upload Documents" ? <UploadDocumentContentIndexDetails /> : renderDataSourceDetailsComponent()}
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <Button variant="contained">Cancel</Button>
            <Button variant="contained">Create Index</Button>
          </div>
        </>
      )}
    </div>
  );
}
