import Grid from "@mui/material/Grid";
import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";

import Plus from "../../assets/icons/plus.svg";
import Assistant from "../../components/Assistant/Assistant";
import ToastMessage from "../../components/common/ToastMessage/ToastMessage";
import CreateDocument from "../../components/CreateDocument/CreateDocument";
import DocumentHeader from "../../components/DocumentHeader/DocumentHeader";
import SidebarContext from "../../context/SidebarContext";
import UserContext from "../../context/UserContext";
import { useFetcher, useModifier } from "../../hooks/useReactQuery";
import { TOAST_TYPE } from "../../models/components/enums";
import { ApiResponseKeys } from "../../utils/apiKeysMap";
import { ApiEndpoints, HTTPMethods, QueryKeys } from "../../utils/constants";
import "./EditDocument.scss";
import { generateDocumentWithPlaceHoldersToEdit, removeGeneratedPlaceHolders } from "../../utils/documentUtils";
import { exportDocument, getDownloadMetaData } from "../../utils/downloadUtil";
import { editPlaceHolderHtmlString, cleanHtmlForDownload } from "../../utils/placeHolderUtilityFunctions";

const EditDocument = () => {
  const [selectedChatId, setSelectedChatId] = useState();
  const [documentWithEditablePlaceholder, setDocumentWithEditablePlaceholder] = useState();
  const [isAssistantDisabled, setIsAssitantDisabled] = useState(true);
  const [selectedPlaceHolderId, setSelectedPlaceHolderId] = useState();
  const [domainDetails, setDomainDetails] = useState();
  const [editedContent, setEditedContent] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState({
    contentIndexId: -1,
    documentContentIndexId: -1,
    documentChunkMetadataId: -1
  });
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [htmlString, setHtmlString] = useState("");
  const [placeholderAndChatId, setPlaceholderAndChatId] = useState([]);
  const { documentId, projectId } = useParams();
  const { setSidebarButtons, setSidebarTitle } = useContext(SidebarContext);
  const documentSectionRef = useRef(null);
  const fullDocumentRef = useRef(null);
  const { ntId } = useContext(UserContext);
  const [openToast, setOpenToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    message: "",
    severity: TOAST_TYPE.SUCCESS
  });

  const { data: documentDetails, isSuccess } = useFetcher({
    url: `${ApiEndpoints.document}/${documentId}`,
    queryKey: [QueryKeys.documentDetails, documentId],
    enableQuery: true
  });

  const showToast = (message) => {
    setToastInfo({
      message,
      severity: TOAST_TYPE.SUCCESS
    });
    setOpenToast(true);
  };

  const { mutate } = useModifier({
    inValidateQueryKey: [QueryKeys.documentDetails, documentId],
    project: "docAuth",
    customOnSuccess: () => {
      showToast("Document saved successfully");
    }
  });

  useEffect(() => {
    setDocumentWithEditablePlaceholder(
      generateDocumentWithPlaceHoldersToEdit(
        htmlString,
        editedContent,
        setEditedContent,
        documentSectionRef,
        setIsAssitantDisabled,
        setSelectedPlaceHolderId,
        placeholderAndChatId
      )
    );
  }, [htmlString, editedContent, setEditedContent, placeholderAndChatId]);

  useEffect(() => {
    if (documentDetails && isSuccess) {
      setHtmlString(documentDetails[ApiResponseKeys.htmlContent]);
      setPlaceholderAndChatId(documentDetails[ApiResponseKeys.documentPlaceholder]);
      setSelectedLibrary({
        ...selectedLibrary,
        contentIndexId: parseInt(documentDetails[ApiResponseKeys.contentLibrary], 10)
      });
      setSelectedTemplate(documentDetails[ApiResponseKeys.templateName]);
      setDomainDetails({
        domainName: documentDetails[ApiResponseKeys.docDomainName],
        subDomainName: documentDetails[ApiResponseKeys.docSubDomainName]
      });
    }
  }, [documentDetails, isSuccess]);

  useEffect(() => {
    setSidebarTitle("Document Authoring");
    setSidebarButtons([
      {
        text: "New Document",
        onClick: () => setOpenModal(true),
        icon: Plus
      }
    ]);
    return () => {
      setSidebarButtons([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedChatId(placeholderAndChatId.find((item) => item.template_placeholder_id === selectedPlaceHolderId)?.chat_history_id || null);
  }, [selectedPlaceHolderId]);

  const exportData = () => {
    const meta = getDownloadMetaData(ntId);
    const cleanedHtml = cleanHtmlForDownload(htmlString);
    exportDocument(meta, removeGeneratedPlaceHolders(cleanedHtml), meta.title);
  };

  const handleAdvanceFilterChange = (value) => {
    setSelectedLibrary((prev) => ({
      ...prev,
      ...value
    }));
  };
  const handleContentLibraryChange = (value) => {
    setSelectedLibrary(() => ({
      ...value,
      documentContentIndexId: -1,
      documentChunkMetadataId: -1
    }));
  };

  const handleSave = () => {
    const updatedHtmlString = editPlaceHolderHtmlString(htmlString);
    const request = {
      [ApiResponseKeys.documentName]: documentDetails[ApiResponseKeys.documentName],
      [ApiResponseKeys.id]: documentId,
      [ApiResponseKeys.templateId]: documentDetails[ApiResponseKeys.templateId],
      [ApiResponseKeys.projectId]: projectId,
      // TODO: Remove this conversion of string once BE fixes the data type of content lib and metadat
      [ApiResponseKeys.contentLibrary]: `${selectedLibrary.contentIndexId}`,
      [ApiResponseKeys.contentLibraryMetadata]: `${selectedLibrary.documentChunkMetadataId}`,
      [ApiResponseKeys.docAuthor]: ntId
    };
    const blob = new Blob([updatedHtmlString], { type: "text/html" });
    const formData = new FormData();
    formData.append("update_document_request", JSON.stringify(request));
    formData.append("html_file", blob, "document.html");
    mutate({
      method: HTTPMethods.PUT,
      url: `${ApiEndpoints.document}/${documentId}`,
      data: formData,
      contentType: "multipart/form-data"
    });
  };

  return (
    <div className="edit-doc">
      <ToastMessage isVisible={openToast} hideToast={setOpenToast} message={toastInfo.message} severity={toastInfo.severity} />
      <Grid container spacing={0}>
        <Grid item xs={7}>
          <div className="d-flex flex-column edit-document-container" ref={documentSectionRef}>
            <div className="document-header mb-3">
              <DocumentHeader
                navigationHeader="Back"
                documentNameLabel="Document Name : "
                defaultTitle={documentDetails?.[ApiResponseKeys.documentName] || "Document Name"}
                templateLabel="Template Name : "
                contentLibraryLabel="Content Library : "
                numOfSections={documentDetails?.[ApiResponseKeys.placeholderCount] || 0}
                handleDownload={() => exportData()}
                setSelectedLibrary={handleContentLibraryChange}
                selectedLibrary={selectedLibrary}
                selectedTemplate={selectedTemplate}
                handleSave={handleSave}
              />
            </div>
            <div className="d-flex flex-column document-editor-content" ref={fullDocumentRef}>
              {documentWithEditablePlaceholder}
            </div>
          </div>
        </Grid>
        <Grid item xs={5}>
          <Assistant
            isDisabled={isAssistantDisabled}
            selectedPlaceHolderId={selectedPlaceHolderId}
            setEditedContent={setEditedContent}
            selectedChatId={selectedChatId}
            domainDetails={domainDetails}
            setSelectedLibrary={handleAdvanceFilterChange}
            selectedLibrary={selectedLibrary}
          />
        </Grid>
      </Grid>
      <CreateDocument openModal={openModal} setOpenModal={setOpenModal} onDocumentCreated={showToast} />
    </div>
  );
};
export default EditDocument;
