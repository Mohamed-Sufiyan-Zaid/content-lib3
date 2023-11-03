import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useEffect, useState, useContext } from "react";

import "./CreateEditDeleteProject.scss";
import { defaultProjectData } from "./pageConstants";

import UserContext from "../../context/UserContext";
import { useFetcher, useModifier } from "../../hooks/useReactQuery";
import { commonText } from "../../i18n/Common";
import { ConfirmationBoxText } from "../../i18n/Components";
import { CreateEditDeleteProjectText } from "../../i18n/CreateEditDeleteProjectText";
import { ToastMessageText } from "../../i18n/ToastMessageText";
import { TOAST_TYPE } from "../../models/components/enums";
import { ApiResponseKeys } from "../../utils/apiKeysMap";
import { ApiEndpoints, QueryKeys, HTTPMethods } from "../../utils/constants";
import ConfirmationBox from "../common/ConfirmationBox/ConfirmationBox";
import Select from "../common/Select/Select";

export default function CreateEditDeleteProject({ openModal, setOpenModal, actionType, projectData, setToastInfo }) {
  const [projectDetails, setProjectDetails] = useState(actionType !== "create" ? { ...projectData } : { ...defaultProjectData });
  const [actionTemp, setActionTemp] = useState(null);
  const { ntId } = useContext(UserContext);
  const getApiKeys = () => {
    switch (actionType) {
      case "create":
        return { method: HTTPMethods.POST, key: QueryKeys.projectsList };
      case "edit":
        return { method: HTTPMethods.PUT, key: QueryKeys.projectsList };
      case "delete":
        return { method: HTTPMethods.DELETE, key: QueryKeys.projectsList };
      default:
        return {};
    }
  };
  const handleValueChange = (newValue, changingParam) => {
    const newProjectDetails = { ...projectDetails };
    newProjectDetails[changingParam] = newValue;
    setProjectDetails(newProjectDetails);
  };
  const {
    data: domains = [],
    isLoading: isDomainLoading,
    isError: isDomainError
  } = useFetcher({
    url: ApiEndpoints.getDomains,
    queryKey: [QueryKeys.getDomains],
    enableQuery: openModal
  });
  // TODO: Uncomment if Sub domain is to be enabled back again
  // const {
  //   data: subDomains = [],
  //   isLoading: isSubDomainLoading,
  //   isError: isSubDomainError
  // } = useFetcher(ApiEndpoints.getSubDomains, [QueryKeys.getSubDomains], {domain_id: 1}, openModal === true);

  useEffect(() => setProjectDetails({ ...projectData }), [projectData]);
  const handleCustomError = (error) => {
    setToastInfo({
      message: error?.response?.data?.detail?.errorMessage[0] || ToastMessageText.promptConfigurationFailure,
      severity: TOAST_TYPE.ERROR
    });
  };
  const { mutate, status: apiChangeStatus } = useModifier({ inValidateQueryKey: [getApiKeys().key], handleCustomError });

  const formatRequestPayload = (data) => {
    switch (actionType) {
      case "edit":
        return {
          [ApiResponseKeys.ntId]: ntId,
          [ApiResponseKeys.projectId]: data.projectId,
          [ApiResponseKeys.projectName]: data.projectName,
          [ApiResponseKeys.projectGroup]: data.projectGroup,
          [ApiResponseKeys.projectDomain]: data.projectDomain,
          [ApiResponseKeys.projectSubDomain]: "dummy_sub_domain"
        };
      case "create":
        return {
          [ApiResponseKeys.ntId]: ntId,
          [ApiResponseKeys.projectName]: data.projectName,
          [ApiResponseKeys.projectGroup]: data.projectGroup,
          [ApiResponseKeys.projectDomain]: data.projectDomain,
          [ApiResponseKeys.projectSubDomain]: "dummy_sub_domain"
        };
      case "delete":
        return {
          [ApiResponseKeys.projectId]: data.projectId
        };
      default:
        console.warn("Action not specified");
        return null;
    }
  };
  const onSuccessCallback = (action) => {
    let message;
    switch (action) {
      case "create":
        message = ToastMessageText.projectCreated;
        break;
      case "edit":
        message = ToastMessageText.projectEdited;
        break;
      default:
        message = ToastMessageText.projectDeleted;
        break;
    }
    setToastInfo({ message, severity: TOAST_TYPE.SUCCESS });
  };

  const isFormInvalid = !projectDetails.projectName || !projectDetails.projectGroup || !projectDetails.projectDomain;
  const handleSave = (data, action) => {
    const formattedData = formatRequestPayload(data);
    mutate(
      action === "delete"
        ? { method: getApiKeys().method, url: ApiEndpoints.projectOperations, data: {}, params: formattedData }
        : { method: getApiKeys().method, url: ApiEndpoints.projectOperations, data: formattedData }
    );
    setActionTemp(action);
  };
  useEffect(() => {
    if (apiChangeStatus === "success") {
      onSuccessCallback(actionTemp);
    }
  }, [apiChangeStatus, actionTemp]);

  return (
    <ConfirmationBox
      title={`${actionType === "create" ? "Create" : actionType === "edit" ? "Edit" : "Delete"} Project`}
      isOpen={openModal}
      agreeText={`${actionType === "create" ? "Create" : actionType === "edit" ? ConfirmationBoxText.agreeText : ConfirmationBoxText.deleteText}`}
      disagreeText={ConfirmationBoxText.disagreeText}
      handleClose={() => setOpenModal(false)}
      handleAccept={() => handleSave(projectDetails, actionType)}
      isAgreeDisabled={isFormInvalid}
    >
      <div className="project-changes-container">
        {actionType !== "delete" ? (
          <div className="create-edit-container">
            <FormControl fullWidth sx={{ margin: { xs: "0 0 1rem 0", md: "0 0 2rem 0" } }}>
              <FormLabel className="mb-2">{CreateEditDeleteProjectText.projectName}</FormLabel>
              <TextField
                value={projectDetails.projectName}
                placeholder={CreateEditDeleteProjectText.projectNamePlaceholder}
                onChange={(event) => handleValueChange(event.target.value, "projectName")}
              />
            </FormControl>
            <Select
              value={projectDetails.projectGroup}
              label={commonText.groupLabel}
              placeholder={commonText.groupPlaceHolder}
              options={["Group 1", "Group 2", "Group 3", "Group 4", "Group 5", "Group 6"]}
              margin={{ xs: "0 0 1rem 0", md: "0 0 2rem 0" }}
              onChange={(event) => handleValueChange(event.target.value, "projectGroup")}
            />
            <div className="d-flex">
              <Select
                value={projectDetails.projectDomain}
                label={commonText.domainLabel}
                placeholder={commonText.domainSelectionPlaceholder}
                options={domains.map((domain) => domain[ApiResponseKeys.domainName])}
                margin={{ xs: "0 0 1rem 0", md: "0 0 2rem 0" }}
                onChange={(event) => handleValueChange(event.target.value, "projectDomain")}
                isLoading={isDomainLoading}
                isError={isDomainError}
              />
              {/* TODO: Uncomment if Sub domain is to be enabled back again */}
              {/* <Select
                value={projectDetails.projectSubDomain}
                label={commonText.subDomainLabel}
                placeholder={commonText.subDomainSelectionPlaceholder}
                options={subDomains.map((subDomain) => subDomain[ApiResponseKeys.subDomainName])}
                margin="0 0 0 1rem"
                onChange={(event) => handleValueChange(event.target.value, "projectSubDomain")}
                isLoading={isSubDomainLoading}
                isError={isSubDomainError}
              /> */}
            </div>
          </div>
        ) : (
          <div className="delete-project-container">
            <h6 className="mt-4 sub-heading">{CreateEditDeleteProjectText.projectName}:</h6>
            <p className="mt-1 project-name m-1">{projectData.projectName}</p>
            <p className="delete-disclaimer mt-2">{CreateEditDeleteProjectText.deleteDisclaimer}</p>
          </div>
        )}
        {apiChangeStatus === "loading" && (
          <div className="project-action-loader d-flex position-absolute align-items-center justify-content-center mt-6">
            <CircularProgress sx={{ margin: "auto" }} />
          </div>
        )}
      </div>
    </ConfirmationBox>
  );
}
