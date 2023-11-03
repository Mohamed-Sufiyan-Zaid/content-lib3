import "./ProjectDetails.scss";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppCardDetails from "../../components/ApplicationCard/AppCardDetails";
import ApplicationCard from "../../components/ApplicationCard/ApplicationCard";
import ProjectDetailsHeader from "../../components/common/ProjectDetailsHeader/ProjectDetailsHeader";
import ToastMessage from "../../components/common/ToastMessage/ToastMessage";
import FolderData from "../../components/FolderData/FolderData";
import SidebarContext from "../../context/SidebarContext";
import UserContext from "../../context/UserContext";
import { useFetcher } from "../../hooks/useReactQuery";
import {
  ManageTemplatesCardText,
  AuthorDocumentCardText,
  ManagePromptLibraryCardText,
  ManageContentLibraryCardText
} from "../../i18n/ApplicationCardText";
import { TOAST_TYPE, INDEX_SHARING } from "../../models/components/enums";
import { ApiResponseKeys } from "../../utils/apiKeysMap";
import { returnBreadCrumb } from "../../utils/breadCrumbMapper";
import {
  ApiEndpoints,
  ContentLibraryApiEndpoints,
  ContentQueryKeys,
  PromptLibraryApiEndpoints,
  PromptQueryKeys,
  QueryKeys
} from "../../utils/constants";
import { formatDate } from "../../utils/dateUtils";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { setSidebarButtons, setSidebarTitle } = useContext(SidebarContext);
  const { projectId } = useParams();
  const { ntId } = useContext(UserContext);
  const [templateDetailsList, setTemplateDetailsList] = useState({ detailList: [], total: 0 });
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const [contentLib, setTotalContentLib] = useState(0);
  const [openToast, setOpenToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    message: "",
    severity: TOAST_TYPE.SUCCESS
  });
  const [pendingPrompts, setPendingPrompts] = useState([
    {
      title: "Pending Approvals: ",
      value: 0
    }
  ]);

  const { data: rawTemplatesList } = useFetcher({
    url: ApiEndpoints.getTemplates,
    queryKey: [QueryKeys.templates, projectId],
    params: { project_id: projectId },
    enableQuery: true,
    staleTime: 30000
  });

  const { data: projectDetails = [], isError: isProjectDetailseErr } = useFetcher({
    url: `${ApiEndpoints.projectOperations}/${projectId}`,
    queryKey: [QueryKeys.projectDetails, projectId],
    enableQuery: true
  });

  const projectName = projectDetails[ApiResponseKeys.projectName] || "";
  const creationDate = formatDate(projectDetails[ApiResponseKeys.lastModifiedOn]) || "";
  const createdBy = projectDetails[ApiResponseKeys.ntId] || "";

  const { data: documentsList } = useFetcher({
    url: ApiEndpoints.document,
    queryKey: [QueryKeys.documentsList, projectId],
    params: { project_id: projectId },
    enableQuery: true,
    staleTime: 3000
  });
  const { data: rawPromptsList } = useFetcher({
    url: `${PromptLibraryApiEndpoints.promptsListByGroupId}/${ntId}`,
    queryKey: [PromptQueryKeys.promptsListByGroupId, PromptQueryKeys.prompts],
    enableQuery: true,
    staleTime: 3000000,
    project: "promptLib"
  });
  const { data: rawPendingPromptsData } = useFetcher({
    url: PromptLibraryApiEndpoints.pendingPrompts,
    queryKey: [PromptQueryKeys.pendingPrompts, PromptQueryKeys.prompts],
    enableQuery: true,
    staleTime: 3000000,
    project: "promptLib"
  });
  // TODO: Assumption is that only private content indexes are shown here
  const { data: contentIndexes } = useFetcher({
    url: ContentLibraryApiEndpoints.contentByIndex,
    queryKey: [ContentQueryKeys.contentByIndex + 1],
    params: {
      content_index_type: INDEX_SHARING.SHARED
    },
    enableQuery: true,
    staleTime: 10000,
    project: "contentLib"
  });

  useEffect(() => {
    setSidebarButtons([]);
    setSidebarTitle("Document Authoring");
    return () => {
      setSidebarButtons([]);
      setSidebarTitle("Document Authoring");
    };
  }, []);

  useEffect(() => {
    setOpenToast(isProjectDetailseErr);
    if (isProjectDetailseErr) {
      setToastInfo({
        message: "Error while fetching project details",
        severity: TOAST_TYPE.ERROR
      });
    }
  }, [isProjectDetailseErr]);

  useEffect(() => {
    if (rawTemplatesList?.length) {
      setTemplateDetailsList({
        detailList: [
          {
            title: "Created: ",
            value: rawTemplatesList.length
          },
          {
            title: "Uploaded: ",
            value: 0
          }
        ],
        total: rawTemplatesList.length
      });
    }
  }, [rawTemplatesList]);

  useEffect(() => {
    if (documentsList) {
      setTotalDocuments(documentsList.length);
    }
  }, [documentsList]);

  useEffect(() => {
    if (contentIndexes?.length) {
      setTotalContentLib(contentIndexes.length);
    }
  }, [contentIndexes]);
  useEffect(() => {
    if (rawPromptsList?.length) {
      setTotalPrompts(rawPromptsList.length);
    }
  }, [rawPromptsList]);

  useEffect(() => {
    if (rawPendingPromptsData?.length) {
      setPendingPrompts([
        {
          title: "Pending Approvals: ",
          value: rawPendingPromptsData.length
        }
      ]);
    }
  }, [rawPendingPromptsData]);

  return (
    <div className="doc-container">
      <ToastMessage isVisible={openToast} hideToast={setOpenToast} severity={toastInfo.severity} message={toastInfo.message} />
      <ProjectDetailsHeader
        navProps={returnBreadCrumb("mainMenu", projectId)}
        projectName={projectName}
        createdDate={creationDate}
        createdBy={createdBy}
      />
      <div className="container">
        <div className="row custom-grid">
          <div className="col-md-6 custom-cell" key={ManageTemplatesCardText.title}>
            <ApplicationCard
              title={ManageTemplatesCardText.title}
              description={ManageTemplatesCardText.description}
              folderChildren={<FolderData title={ManageTemplatesCardText.folderTitle} value={templateDetailsList?.total} type="folder" />}
              detailedChildren={<AppCardDetails detailsList={templateDetailsList?.detailList} />}
              btnText={ManageTemplatesCardText.btnText}
              isBtnDisabled={false}
              handleBtnClick={() => navigate(`/project/${projectId}/templates`, { state: { projectName } })}
            />
          </div>
          <div className="col-md-6 custom-cell" key={AuthorDocumentCardText.title}>
            <ApplicationCard
              title={AuthorDocumentCardText.title}
              description={AuthorDocumentCardText.description}
              folderChildren={<FolderData title={ManageTemplatesCardText.folderTitle} value={totalDocuments} type="folder" />}
              detailedChildren=""
              btnText={ManageTemplatesCardText.btnText}
              isBtnDisabled={false}
              handleBtnClick={() => navigate(`/project/${projectId}/documents`)}
            />
          </div>
          <div className="col-md-6 custom-cell" key={ManagePromptLibraryCardText.title}>
            <ApplicationCard
              title={ManagePromptLibraryCardText.title}
              description={ManagePromptLibraryCardText.description}
              folderChildren={<FolderData value={totalPrompts} type="circular" />}
              detailedChildren={<AppCardDetails detailsList={pendingPrompts} />}
              btnText={ManagePromptLibraryCardText.btnText}
              isBtnDisabled={false}
              btnTwoText={ManagePromptLibraryCardText.btnTwoText}
              handleBtnClick={() => navigate("/prompt/admin")}
              handleBtnClickForBtnTwo={() => navigate("/prompt/engineer")}
              isBtnTwoDisabled={ManagePromptLibraryCardText.isBtnTwoDisabled}
            />
          </div>
          <div className="col-md-6 custom-cell" key={ManageContentLibraryCardText.title}>
            <ApplicationCard
              title={ManageContentLibraryCardText.title}
              description={ManageContentLibraryCardText.description}
              folderChildren={<FolderData title={ManageContentLibraryCardText.folderTitle} value={contentLib} type="folder" />}
              btnText={ManageContentLibraryCardText.btnText}
              isBtnDisabled={ManageContentLibraryCardText.isBtnDisabled}
              handleBtnClick={() => navigate(`/project/${projectId}/content`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectDetails;
