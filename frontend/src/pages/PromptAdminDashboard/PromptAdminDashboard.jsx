import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useContext, useEffect, useState } from "react";
import "./PromptAdminDashboard.scss";
// import Select from "../../components/common/Select/Select";
import { useParams } from "react-router-dom";

import Plus from "../../assets/icons/plus.svg";
import NavHeader from "../../components/common/NavHeader/NavHeader";
import ToastMessage from "../../components/common/ToastMessage/ToastMessage";
import ConfigurePrompt from "../../components/ConfigurePrompt/ConfigurePrompt";
import PromptDetails from "../../components/PromptDetails/PromptDetails";
import SidebarContext from "../../context/SidebarContext";
import UserContext from "../../context/UserContext";
import { useFetcher, useModifier } from "../../hooks/useReactQuery";
import { promptDashboardText } from "../../i18n/PromptAdminDashboardText";
import { ToastMessageText } from "../../i18n/ToastMessageText";
import { TOAST_TYPE } from "../../models/components/enums";
import { returnBreadCrumb } from "../../utils/breadCrumbMapper";
import { PromptLibraryApiEndpoints, PromptQueryKeys, HTTPMethods } from "../../utils/constants";
import GetSvgIcon from "../../utils/GetSvgIcon";
import { ApiResponseKeys } from "../../utils/promptApiKeysMap";

const PromptAdminDashboard = () => {
  const [pendingPrompts, setPendingPrompts] = useState([]);
  // const [showingRequestsType, setShowingRequestsType] = useState("Add");
  // const [requestTypes, setRequestTypes] = useState([]);
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [actionTypes, setActionType] = useState(null);
  const { ntId } = useContext(UserContext);
  const sidebarContext = useContext(SidebarContext);
  const [toastInfo, setToastInfo] = useState({
    message: "",
    severity: TOAST_TYPE.SUCCESS
  });
  const { projectId } = useParams();
  const [openToast, setOpenToast] = useState(false);

  const showToast = (message) => {
    setToastInfo({
      message,
      severity: TOAST_TYPE.SUCCESS
    });
    setOpenToast(true);
  };
  const buttons = [
    {
      text: "Configure Prompt",
      onClick: () => {
        setOpenModal(true);
      },
      icon: Plus
    }
  ];

  const {
    data: rawPendingPromptsData = [],
    isLoading: isPendingPromptsLoading,
    isError: isPendingPromptsError,
    isSuccess: isPendingPromptsSuccess
  } = useFetcher({
    url: PromptLibraryApiEndpoints.pendingPrompts,
    queryKey: [PromptQueryKeys.prompts, PromptQueryKeys.pendingPrompts],
    enableQuery: true,
    staleTime: 3000000,
    project: "promptLib"
  });

  const { mutate, isSuccess: isConfiguredPromptSuccess } = useModifier({ inValidateQueryKey: [PromptQueryKeys.prompts], project: "promptLib" });

  useEffect(() => {
    sidebarContext.setSidebarTitle("Prompt Library");
  }, [sidebarContext]);

  const pendingPromptsResponseMapper = (data) => {
    setPendingPrompts(
      data.map((prompt) => ({
        promptId: prompt[ApiResponseKeys.id],
        promptText: prompt[ApiResponseKeys.promptText],
        requestType: prompt[ApiResponseKeys.requestType],
        groupName: prompt[ApiResponseKeys.groupName],
        domain: prompt[ApiResponseKeys.domain],
        subDomain: prompt[ApiResponseKeys.subDomain],
        annotation: prompt[ApiResponseKeys.annotation],
        category: prompt[ApiResponseKeys.category],
        promptType: prompt[ApiResponseKeys.promptType],
        submittedBy: prompt[ApiResponseKeys.submittedBy],
        tags: prompt[ApiResponseKeys.tags],
        usecaseType: prompt[ApiResponseKeys.usecaseType]
      }))
    );
  };

  useEffect(() => {
    if (isPendingPromptsSuccess) {
      pendingPromptsResponseMapper(rawPendingPromptsData);
      // const uniqueRequestTypes = [...new Set(rawPendingPromptsData.map((prompt) => prompt[ApiResponseKeys.requestType]))];
      // setRequestTypes(uniqueRequestTypes);
    }
  }, [isPendingPromptsSuccess, rawPendingPromptsData]);

  const toggleSelectedPrompt = (event, promptId) => {
    if (event.target.checked) {
      setSelectedPrompts([...selectedPrompts, promptId]);
    } else {
      setSelectedPrompts(selectedPrompts.filter((selectedPromptId) => promptId !== selectedPromptId));
    }
  };

  const onSuccessCallback = (actionType) => {
    let message;
    if (actionType === "APPROVED") {
      message = ToastMessageText.promptApproved;
    } else {
      message = ToastMessageText.promptRejected;
    }
    setToastInfo({
      message,
      severity: TOAST_TYPE.SUCCESS
    });
    setOpenToast(true);
  };

  const approveOrRejectPrompts = (actionType) => {
    setActionType(actionType);
    mutate({
      method: HTTPMethods.POST,
      url: PromptLibraryApiEndpoints.approveOrRejectPrompts,
      data: {
        status: actionType,
        approver_id: ntId,
        prompt_ids: selectedPrompts
      }
    });
    setSelectedPrompts([]);
    onSuccessCallback(actionType);
  };

  useEffect(() => {
    if (isConfiguredPromptSuccess) {
      onSuccessCallback(actionTypes);
    }
  }, [isConfiguredPromptSuccess, actionTypes]);

  return (
    <div className="prompt-admin-container">
      <ToastMessage isVisible={openToast} hideToast={setOpenToast} message={toastInfo.message} severity={toastInfo.severity} />
      <NavHeader breadcrumbData={returnBreadCrumb("managePrompLibAdmin", projectId)} />

      <div className="d-flex content-header">
        <div className="section-header mt-3">My Request Dashboard</div>
        <div className="d-flex">
          {buttons.map((button, key) => (
            <Button key={key} variant="contained" color="primary" onClick={button.onClick} startIcon={<GetSvgIcon icon={button.icon} />}>
              {button.text}
            </Button>
          ))}
        </div>
      </div>
      <div className="prompt-request-container">
        <div className="prompt-actions">
          <div className="prompt-actions-left">
            {/* <span>{promptDashboardText.typeSelection}</span>
            <Select label="" options={requestTypes} value={showingRequestsType} onChange={(event) => setShowingRequestsType(event.target.value)} /> */}
          </div>
          <div className="prompt-actions-right">
            <Button disabled={selectedPrompts.length === 0} variant="contained" size="small" onClick={() => approveOrRejectPrompts("APPROVED")}>
              {promptDashboardText.approveBtn}
            </Button>
            <Button disabled={selectedPrompts.length === 0} variant="outlined" size="small" onClick={() => approveOrRejectPrompts("REJECTED")}>
              {promptDashboardText.rejectBtn}
            </Button>
          </div>
        </div>
        <Divider className="prompt-seperator" variant="middle" />
        <div className="prompt-texts">
          {isPendingPromptsLoading ? (
            <div className="d-flex align-items-center justify-content-center mt-6 no-records">
              <CircularProgress sx={{ margin: "auto" }} />
            </div>
          ) : isPendingPromptsError ? (
            <div className="d-flex align-items-center justify-content-center text-center no-records">
              <div>
                {promptDashboardText.errorFetchingProjects} <br /> {promptDashboardText.refreshText}
              </div>
            </div>
          ) : pendingPrompts.length > 0 ? (
            pendingPrompts.map((prompt, index) => (
              <PromptDetails
                key={index}
                promptData={prompt}
                isChecked={selectedPrompts.some((promptId) => promptId === prompt.promptId)}
                showDivider={index !== pendingPrompts.length - 1}
                handleCheckboxClick={toggleSelectedPrompt}
                isAdmin
              />
            ))
          ) : (
            <div className="d-flex align-items-center justify-content-center no-records">
              <div>{promptDashboardText.noPromptsText}</div>
            </div>
          )}
        </div>
      </div>
      <ConfigurePrompt openModal={openModal} setOpenModal={setOpenModal} setToastInfo={showToast} />
    </div>
  );
};

export default PromptAdminDashboard;
