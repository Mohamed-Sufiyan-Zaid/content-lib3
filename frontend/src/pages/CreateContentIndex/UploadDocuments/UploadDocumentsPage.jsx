import { useState, useEffect } from "react";

import CheckCircleOutlined from "../../../assets/images/check_circle.svg?react";
import Table from "../../../components/common/Table/Table";
import UploadButton from "../../../components/common/UploadButton/UploadButton";
import { ApiResponseKeys } from "../../../utils/contentApiKeysMap";
import TotalAndAdvancedSettings from "../TotalAndAdvancedSettings";
import "./UploadDocuments.scss";

function UploadDocumentsPage({ documents, setFiles }) {
  const [tableRows, setTableRows] = useState([]);
  const [docList, setDocList] = useState(documents);
  const ProjectTableHeaders = ["Document Name", "Status"];
  const generateTableContent = () => {
    const newTableData = [];
    docList?.forEach((document) => {
      if (document[ApiResponseKeys.fileName]?.length > 0) {
        const rowContent = [];
        rowContent.push(document[ApiResponseKeys.fileName]);
        rowContent.push(
          <span>
            Uploaded <CheckCircleOutlined />
          </span>
        );

        newTableData.push(rowContent);
      } else {
        newTableData.push(["Yet to save links"]);
      }
    });

    setTableRows(newTableData);
  };

  useEffect(() => {
    setDocList(documents);
    generateTableContent();
  }, [documents, docList]);

  return (
    <div style={{ margin: "10px" }}>
      <div className="card">
        <div className="card-body">
          <div className="grid-container-custom">
            <div className="section">
              <label>TOTAL FILES</label>

              <p>{docList.length} </p>
            </div>

            <div className="section" style={{ display: "flex", justifyContent: "flex-end" }}>
              <UploadButton setFiles={setFiles} />
            </div>
          </div>
        </div>
      </div>

      <br />

      <div className="card">
        <div className="card-body">
          <Table rows={tableRows} headers={ProjectTableHeaders} />
        </div>
      </div>

      <div className="card">
        <TotalAndAdvancedSettings total={docList.length} />
      </div>
    </div>
  );
}

export default UploadDocumentsPage;
