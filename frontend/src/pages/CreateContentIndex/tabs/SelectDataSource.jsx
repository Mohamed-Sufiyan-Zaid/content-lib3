import DataSources from "../DataSources";
import UploadDocumentsHome from "../UploadDocuments/UploadDocumentsHome";

export default function SelectDataSource({ onDataSourceClick, contentIndexId, setContentIndexCreationStatus, setOpenToast, setContentIndexMessage }) {
  return (
    <>
      <div className="d-flex gap-1 mb-3 mt-4 flex-column">
        <h4 className="h4 m-0">Select Data Sources</h4>
        <p>
          Upload one or more documents manually or connect to an external server to access documents. Currently, only supports connection to GDMS
          <br />
          external system. Connections to sharepoint and other solutions will be supported in the future.
        </p>
      </div>
      <div className="custom-container">
        <div className="card">
          <div className="custom-row">
            <div className="custom-p-right">
              <DataSources onDataSourceClick={onDataSourceClick} />
            </div>
            <UploadDocumentsHome
              contentIndexId={contentIndexId}
              setContentIndexCreationStatus={setContentIndexCreationStatus}
              setContentIndexMessage={setContentIndexMessage}
              setOpenToast={setOpenToast}
            />
          </div>
        </div>
      </div>
    </>
  );
}
