import Button from "@mui/material/Button";
import { useState, useEffect, useContext } from "react";
import "./ProjectDocuments.scss";
import { useNavigate, useParams } from "react-router-dom";

import Plus from "../../assets/icons/plus.svg";
import ProjectDetailsHeader from "../../components/common/ProjectDetailsHeader/ProjectDetailsHeader";
import Table from "../../components/common/Table/Table";
import ToastMessage from "../../components/common/ToastMessage/ToastMessage";
import CreateDocument from "../../components/CreateDocument/CreateDocument";
import UserContext from "../../context/UserContext";
import { useFetcher } from "../../hooks/useReactQuery";
import { ProjectDocumentsText } from "../../i18n/ProjectDocumentsText";
import { TOAST_TYPE } from "../../models/components/enums";
import { ApiResponseKeys } from "../../utils/apiKeysMap";
import { returnBreadCrumb } from "../../utils/breadCrumbMapper";
import { DocumentTableHeaders, ApiEndpoints, QueryKeys } from "../../utils/constants";
import { getFullDateFormatted } from "../../utils/dateUtils";
import { removeGeneratedPlaceHolders } from "../../utils/documentUtils";
import { exportDocument, getDownloadMetaData } from "../../utils/downloadUtil";
import { cleanHtmlForDownload } from "../../utils/placeHolderUtilityFunctions";

const ProjectDocuments = () => {
  const [tableRows, setTableRows] = useState([]);
  const [tablePageNo, setTablePageNo] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const { documentId, projectId } = useParams();
  const navigate = useNavigate();
  const { ntId } = useContext(UserContext);
  const [openToast, setOpenToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    message: "",
    severity: TOAST_TYPE.SUCCESS
  });

  const buttons = [
    {
      text: "New Document",
      onClick: () => setOpenModal(true),
      icon: Plus,
      state: "create"
    }
  ];

  const { data: documentsList, isSuccess } = useFetcher({
    url: ApiEndpoints.document,
    queryKey: [QueryKeys.documentsList, projectId],
    params: { project_id: projectId },
    enableQuery: true
  });

  const { data: documentDetails, isSuccess: isDocumentDetailApisSuccess } = useFetcher({
    url: `${ApiEndpoints.document}/${documentId}`,
    queryKey: [QueryKeys.documentDetails, documentId],
    enableQuery: typeof documentId === "number",
    staleTime: 3000000,
    project: "docAuth",
    retry: false
  });

  const showToast = ({ message, severity }) => {
    setToastInfo({
      message,
      severity
    });
    setOpenToast(true);
  };
  const generateTableContent = (allDocuments) => {
    const newTableData = [];
    allDocuments.forEach((document, index) => {
      newTableData[index + 1] = [
        document.documentName,
        document.createdBy,
        getFullDateFormatted(document.createdOn),
        <div key={index} className="d-flex">
          <Button
            variant="text"
            sx={{ textDecoration: "underline" }}
            onClick={() => navigate(`/project/${projectId}/document/${document.documentId}`)}
          >
            {ProjectDocumentsText.tableOption}
          </Button>
        </div>
      ];
    });
    setTableRows(newTableData);
  };

  const mapDocumentListRows = (data) =>
    data.map((document) => ({
      documentName: document[ApiResponseKeys.documentName],
      createdBy: document[ApiResponseKeys.docAuthor],
      createdOn: document[ApiResponseKeys.createdOn],
      documentId: document[ApiResponseKeys.id]
    }));

  useEffect(() => {
    if (documentsList?.length > 0) {
      const updatedList = mapDocumentListRows(documentsList);
      generateTableContent(updatedList);
    }
  }, [documentsList, isSuccess]);

  useEffect(() => {
    if (isDocumentDetailApisSuccess) {
      const meta = getDownloadMetaData(ntId);
      const cleanedHtml = cleanHtmlForDownload(documentDetails[ApiResponseKeys.htmlContent]);
      exportDocument(meta, removeGeneratedPlaceHolders(cleanedHtml), meta.title);
    }
  });

  return (
    <div className="doc-container">
      <ToastMessage isVisible={openToast} hideToast={setOpenToast} message={toastInfo.message} severity={toastInfo.severity} />
      <ProjectDetailsHeader navProps={returnBreadCrumb("documentList", projectId)} buttons={buttons} setOpen={setOpenModal} />
      <div>
        <h1 className="doc-heading mb-lg-3">{ProjectDocumentsText.headingText}</h1>
        <Table
          rows={tableRows}
          headers={DocumentTableHeaders}
          isPaginated
          pageNo={tablePageNo}
          handlePageChange={(_, newPage) => setTablePageNo(newPage)}
        />
        {openModal && <CreateDocument openModal={openModal} setOpenModal={setOpenModal} onDocumentCreated={showToast} />}
      </div>
    </div>
  );
};
export default ProjectDocuments;
