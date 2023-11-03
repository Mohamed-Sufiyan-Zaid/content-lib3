import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import "./CreatePrompt.scss";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useState, useContext, useEffect } from "react";

import SendIcon from "../../assets/images/send.svg?react";
import UserContext from "../../context/UserContext";
import { useFetcher, useModifier } from "../../hooks/useReactQuery";
import { ConfirmationBoxText } from "../../i18n/Components";
import { ToastMessageText } from "../../i18n/ToastMessageText";
import { PROMPT_ADD_REQUEST_TYPE } from "../../models/components/constants";
import { HTTPMethods, PromptLibraryApiEndpoints, PromptQueryKeys } from "../../utils/constants";
import { ApiResponseKeys } from "../../utils/promptApiKeysMap";
import ConfirmationBox from "../common/ConfirmationBox/ConfirmationBox";
import Pill from "../common/Pills/Pill";
import Select from "../common/Select/Select";

export default function CreatePrompt({ openModal, setOpenModal, setToastInfo }) {
  const [promptText, setPromptText] = useState("");
  const [promptConfigsList, setPromptConfigsList] = useState([]);
  const [promptConfig, setPromptConfig] = useState(null);
  const [annotation, setAnnotation] = useState("");
  const [promptType, setPromptType] = useState("");
  const [usecaseType, setUsecaseType] = useState("");
  const [tags, setTags] = useState([]);
  const [tagsInput, setTagsInputVal] = useState("");

  const addTag = () => {
    if (tagsInput && !tags.includes(tagsInput)) {
      setTags([...tags, tagsInput]);
      setTagsInputVal("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const { ntId } = useContext(UserContext);

  const {
    mutate,
    isSuccess: isCreationPromptSuccess,
    isError
  } = useModifier({ inValidateQueryKey: [PromptQueryKeys.prompts], project: "promptLib" });

  const {
    data: rawPromptConfigsList = [],
    isLoading: isPromptConfigsListLoading,
    isError: isPromptConfigsListError,
    isSuccess: isPromptConfigsListSuccess
  } = useFetcher({
    url: PromptLibraryApiEndpoints.promptConfigsList,
    queryKey: [PromptQueryKeys.promptConfigsList],
    enableQuery: openModal,
    staleTime: 1000000,
    project: "promptLib"
  });

  const promptConfigResponseMapper = (configs) => {
    const updatedConfigs = configs.map((config) => ({
      id: config[ApiResponseKeys.id],
      categoryId: config[ApiResponseKeys.categoryId],
      createdOn: config[ApiResponseKeys.createdOn],
      domainId: config[ApiResponseKeys.domainId],
      ntId: config[ApiResponseKeys.ntId],
      subDomainId: config[ApiResponseKeys.subDomainId],
      displayVal: config[ApiResponseKeys.displayVal]
    }));
    setPromptConfigsList(updatedConfigs);
  };

  useEffect(() => {
    if (isPromptConfigsListSuccess) {
      promptConfigResponseMapper(rawPromptConfigsList);
    }
  }, [isPromptConfigsListSuccess]);

  const resetForm = () => {
    setPromptText("");
    setPromptConfig(null);
    setAnnotation("");
    setPromptType("");
    setUsecaseType("");
    setTags([]);
    setTagsInputVal("");
  };
  const isFormValid = promptText && promptConfig && annotation && promptType;

  const handleSave = async () => {
    const createPromptRequestData = {
      [ApiResponseKeys.adminConfigId]: promptConfig.id,
      [ApiResponseKeys.promptText]: promptText,
      [ApiResponseKeys.version]: 1,
      [ApiResponseKeys.annotation]: annotation,
      [ApiResponseKeys.usecaseType]: usecaseType,
      [ApiResponseKeys.promptType]: promptType,
      [ApiResponseKeys.requestType]: PROMPT_ADD_REQUEST_TYPE,
      [ApiResponseKeys.submittedSource]: "PROMPT_ENGINEER",
      [ApiResponseKeys.ranking]: 0,
      [ApiResponseKeys.tags]: tags,
      [ApiResponseKeys.ntId]: ntId
    };
    mutate({
      method: HTTPMethods.POST,
      url: PromptLibraryApiEndpoints.createPrompt,
      data: createPromptRequestData
    });
  };
  const onSuccessCallback = (message) => {
    setToastInfo(message);
  };
  useEffect(() => {
    if (isCreationPromptSuccess) {
      onSuccessCallback(ToastMessageText.promptCreationSuccess);
    } else if (isError) {
      onSuccessCallback(ToastMessageText.promptCreationFailure);
    }
  }, [isCreationPromptSuccess]);

  const handlePromptConfigSelect = (config) => {
    setPromptConfig(promptConfigsList.filter((listItem) => listItem.displayVal === config)[0]);
  };

  const addTagOnKeyPress = (event) => {
    if (event.keyCode === 13 && event.target.value !== "") {
      addTag();
    }
  };

  return (
    <ConfirmationBox
      title="Create Prompt"
      isOpen={openModal}
      isAgreeDisabled={!isFormValid}
      handleClose={() => {
        setOpenModal(false);
        resetForm();
      }}
      handleAccept={handleSave}
      agreeText="Submit"
      dialogContentClassName="create-prompt"
      disagreeText={ConfirmationBoxText.disagreeText}
    >
      <div className="project-changes-container">
        <div className="configure prompt">
          <FormControl fullWidth sx={{ margin: { xs: "0 0 1rem 0", md: "0 0 2rem 0" } }}>
            <FormLabel className="mb-2">Prompt Text</FormLabel>
            <TextField value={promptText} placeholder="Enter a project text" onChange={(event) => setPromptText(event.target.value)} />
          </FormControl>
          <Select
            value={promptConfig != null ? promptConfig.displayVal : ""}
            label="Prompt Configuration"
            placeholder="Select a prompt configuration"
            options={promptConfigsList.map((val) => val.displayVal)}
            margin={{ xs: "0 0 1rem 0", md: "0 0 2rem 0" }}
            isLoading={isPromptConfigsListLoading}
            isError={isPromptConfigsListError}
            onChange={(event) => handlePromptConfigSelect(event.target.value)}
          />
          <div className="d-flex mb-3">
            <FormControl fullWidth>
              <FormLabel className="mb-2">Annotation</FormLabel>
              <TextField value={annotation} placeholder="Enter an annotation" onChange={(event) => setAnnotation(event.target.value)} />
            </FormControl>
            <FormControl fullWidth sx={{ margin: "0 0 0 1rem" }}>
              <FormLabel className="mb-2">Prompt Type</FormLabel>
              <TextField value={promptType} placeholder="Enter a prompt type" onChange={(event) => setPromptType(event.target.value)} />
            </FormControl>
            <FormControl fullWidth sx={{ margin: "0 0 0 1rem" }}>
              <FormLabel className="mb-2">Use Case Type</FormLabel>
              <TextField value={usecaseType} placeholder="Enter a use case type" onChange={(event) => setUsecaseType(event.target.value)} />
            </FormControl>
          </div>
          <FormControl fullWidth sx={{ margin: { position: "relative" } }}>
            <FormLabel className="mb-2">Add Tags</FormLabel>
            <div className="tags-input-container">
              <span
                style={{
                  padding: "4px 8px",
                  height: "100px",
                  borderRadius: 4,
                  display: "flex",
                  flexWrap: "wrap"
                }}
              >
                {tags.map((tag) => (
                  <Pill label={tag} key={tag} onDelete={() => removeTag(tag)} />
                ))}
              </span>
              <div className="tags-input">
                <TextField
                  value={tagsInput}
                  onChange={(event) => setTagsInputVal(event.target.value)}
                  onKeyDown={addTagOnKeyPress}
                  sx={{ flexGrow: 1 }}
                  InputProps={{
                    sx: { paddingX: "0.25rem" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={addTag}>
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </div>
            </div>
          </FormControl>
        </div>
      </div>
    </ConfirmationBox>
  );
}
