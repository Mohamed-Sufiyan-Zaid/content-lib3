import Button from "@mui/material/Button";
import { useState, useEffect, useContext } from "react";
import "../Home/Home.scss";
import { useParams } from "react-router-dom";

import Plus from "../../assets/icons/plus.svg";
// import ConfigurePrompt from "../../../components/ConfigurePrompt/ConfigurePrompt";
import ConfirmationBox from "../../components/common/ConfirmationBox/ConfirmationBox";
import NavHeader from "../../components/common/NavHeader/NavHeader";
import Table from "../../components/common/Table/Table";
import ToastMessage from "../../components/common/ToastMessage/ToastMessage";
import CreatePrompt from "../../components/CreatePrompt/CreatePrompt";
import PromptDetails from "../../components/PromptDetails/PromptDetails";
import SidebarContext from "../../context/SidebarContext";
import UserContext from "../../context/UserContext";
import { useFetcher } from "../../hooks/useReactQuery";
import { TOAST_TYPE } from "../../models/components/enums";
import { returnBreadCrumb } from "../../utils/breadCrumbMapper";
import { MyPromptsTableHeaders, PromptLibraryApiEndpoints, PromptQueryKeys } from "../../utils/constants";
import GetSvgIcon from "../../utils/GetSvgIcon";
import { ApiResponseKeys } from "../../utils/promptApiKeysMap";
import "./PromptEngineerDashboard.scss";

export default function PromptEngineerDashboard() {
  const [tableRows, setTableRows] = useState([]);
  const [tablePageNo, setTablePageNo] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [openPromptDetails, setOpenPromptDetails] = useState(false);
  const [promptsList, setPromptsList] = useState([]);
  const [actionType, setActionType] = useState("");
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(null);
  const sidebarContext = useContext(SidebarContext);
  const { ntId } = useContext(UserContext);
  const [toastInfo, setToastInfo] = useState({
    message: "",
    severity: TOAST_TYPE.SUCCESS
  });
  const [openToast, setOpenToast] = useState(false);
  const { projectId } = useParams();

  const showToast = (message) => {
    setToastInfo({
      message,
      severity: TOAST_TYPE.SUCCESS
    });
    setOpenToast(true);
  };

  const buttons = [
    {
      text: "Create Prompt",
      onClick: () => {
        setActionType("create");
        setOpenModal(true);
      },
      icon: Plus
    }
  ];

  const {
    data: rawPromptsList,
    isSuccess: isPromptsListSuccess,
    isLoading: isPromptsListLoading,
    isError: isPromptsListError
  } = useFetcher({
    url: `${PromptLibraryApiEndpoints.promptsListByGroupId}/${ntId}`,
    queryKey: [PromptQueryKeys.prompts, PromptQueryKeys.promptsListByGroupId],
    enableQuery: true,
    staleTime: 3000000,
    project: "promptLib"
  });

  const generateTableContent = (data = []) => {
    setTableRows(
      data.map((project, index) => [
        project.promptText,
        project.domain,
        project.promptType,
        project.status,
        <div key={index} className="d-flex">
          <Button
            variant="text"
            sx={{ textDecoration: "underline" }}
            onClick={() => {
              setSelectedPromptIndex(index);
              setOpenPromptDetails(true);
            }}
          >
            View Details
          </Button>
        </div>
      ])
    );
  };

  const mapProjectsListRows = (data) => {
    const updatedList = data.map((project) => ({
      promptText: project[ApiResponseKeys.promptText],
      domain: project[ApiResponseKeys.domain],
      promptType: project[ApiResponseKeys.promptType],
      status: project[ApiResponseKeys.status],
      groupId: project[ApiResponseKeys.groupId],
      groupName: project[ApiResponseKeys.groupName],
      subDomain: project[ApiResponseKeys.subDomain],
      category: project[ApiResponseKeys.category],
      annotation: project[ApiResponseKeys.annotation],
      usecaseType: project[ApiResponseKeys.usecaseType],
      tags: project[ApiResponseKeys.tags]
    }));
    setPromptsList(updatedList);
    generateTableContent(updatedList);
  };

  useEffect(() => {
    sidebarContext.setSidebarTitle("Prompt Library");
  }, []);

  useEffect(() => {
    if (isPromptsListSuccess) {
      mapProjectsListRows(rawPromptsList);
    }
  }, [isPromptsListSuccess, rawPromptsList]);

  return (
    <div className="home-container">
      <ToastMessage isVisible={openToast} hideToast={setOpenToast} message={toastInfo.message} severity={toastInfo.severity} />
      <NavHeader breadcrumbData={returnBreadCrumb("managePrompLibEngineer", projectId)} />
      <div className="content-header d-flex mt-3 mb-3">
        <h1 className="heading mt-0 mb-0">My Prompts</h1>
        <div className="d-flex">
          {buttons.map((button, key) => (
            <Button key={key} variant="contained" color="primary" onClick={button.onClick} startIcon={<GetSvgIcon icon={button.icon} />}>
              {button.text}
            </Button>
          ))}
        </div>
      </div>

      <Table
        rows={tableRows}
        headers={MyPromptsTableHeaders}
        isPaginated
        isError={isPromptsListError}
        isLoading={isPromptsListLoading}
        pageNo={tablePageNo}
        handlePageChange={(_, newPage) => setTablePageNo(newPage)}
      />
      {/* <ConfigurePrompt openModal={openModal} setOpenModal={setOpenModal} actionType={actionType} /> */}
      <CreatePrompt openModal={openModal} setOpenModal={setOpenModal} actionType={actionType} setToastInfo={showToast} />
      <ConfirmationBox
        isOpen={openPromptDetails}
        disagreeText="Close"
        title="Prompt Details"
        handleClose={() => {
          setOpenPromptDetails(false);
        }}
      >
        <PromptDetails promptData={promptsList[selectedPromptIndex]} isAdmin={false} />
      </ConfirmationBox>
    </div>
  );
}
