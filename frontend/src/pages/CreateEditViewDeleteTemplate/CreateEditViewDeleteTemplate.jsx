import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import "./CreateEditViewDeleteTemplate.scss";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import parse from "html-react-parser";
import { useState, useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import QuillEditor from "../../components/QuillEditor/QuillEditor";
import UserContext from "../../context/UserContext";
import { useFetcher, useModifier } from "../../hooks/useReactQuery";
import { ToastMessageText } from "../../i18n/ToastMessageText";
import { TOAST_TYPE } from "../../models/components/enums";
import { ApiResponseKeys } from "../../utils/apiKeysMap";
import { TemplateState, ApiEndpoints, QueryKeys, HTTPMethods } from "../../utils/constants";

function CreateEditViewDeleteTemplate({ templateData, open, setOpen, templateState, setToastInfo, projectName = "" }) {
  const [name, setName] = useState(templateData.templateName || "");
  const { projectId } = useParams();
  const [editorHtml, setEditorHtml] = useState("");
  const { ntId } = useContext(UserContext);
  const placeHolderRef = useRef({ placeholderIds: [] });
  const editorRef = useRef(null);

  const { data: templateApiData } = useFetcher({
    url: `${ApiEndpoints.templateDetails}/${templateData?.templateId}`,
    queryKey: [QueryKeys.templates, templateData?.templateId],
    enableQuery: templateState !== TemplateState.CREATED
  });

  const getApiKeysTitleAndUrl = () => {
    const templateStateMap = {
      [TemplateState.CREATED]: {
        title: "Create Template",
        method: HTTPMethods.POST,
        key: QueryKeys.createTemplate,
        contentType: "multipart/form-data",
        url: `${ApiEndpoints.templateNewOrUpdate}`
      },
      [TemplateState.EDITED]: {
        title: "Edit Template",
        method: HTTPMethods.PUT,
        key: QueryKeys.editTemplate,
        contentType: "multipart/form-data",
        url: `${ApiEndpoints.templateNewOrUpdate}/${templateData?.templateId}`
      },
      [TemplateState.READONLY]: { title: "View Template", url: `${ApiEndpoints.templateNewOrUpdate}/${templateData?.templateId}` },
      [TemplateState.DELETE]: {
        title: "Delete Template",
        method: HTTPMethods.DELETE,
        key: null,
        contentType: "application/json",
        url: `${ApiEndpoints.templateNewOrUpdate}/${templateData?.templateId}`
      }
    };

    return templateStateMap[templateState] || {};
  };

  const getRequestPayload = () => {
    if (templateState === TemplateState.DELETE) {
      return null;
    }
    const requestPayloadMap = {
      [TemplateState.CREATED]: {
        request: {
          ntid: ntId,
          [ApiResponseKeys.templateName]: name,
          [ApiResponseKeys.projectId]: parseInt(projectId, 10),
          [ApiResponseKeys.templateCreationType]: "CREATED",
          [ApiResponseKeys.templateFileType]: "HTML",
          [ApiResponseKeys.placeHolderId]: placeHolderRef.current.placeholderIds
        }
      },
      [TemplateState.EDITED]: {
        request: {
          ntid: ntId,
          [ApiResponseKeys.templateName]: name,
          [ApiResponseKeys.templateId]: templateApiData?.id,
          [ApiResponseKeys.projectId]: projectId,
          [ApiResponseKeys.templateCreationType]: "CREATED",
          [ApiResponseKeys.templateFileType]: "HTML",
          [ApiResponseKeys.placeHolderId]: placeHolderRef.current.placeholderIds
        }
      }
    };
    const blob = new Blob([editorHtml], { type: "text/html" });
    const formData = new FormData();
    formData.append("request", JSON.stringify(requestPayloadMap[templateState]?.request));
    formData.append("fileb", blob, `${name}.html`);
    return formData;
  };

  useEffect(() => {
    if (templateApiData && templateState !== TemplateState.CREATED) {
      setEditorHtml(templateApiData[ApiResponseKeys.htmlContent]);
    } else {
      setEditorHtml("");
    }
  }, [templateApiData, templateState]);

  const handleCustomError = (error) => {
    setToastInfo({ message: error?.response?.data?.detail?.errorMessage[0], severity: TOAST_TYPE.ERROR });
  };

  const { mutate, status: apiChangeStatus } = useModifier({ inValidateQueryKey: [QueryKeys.templates], handleCustomError });

  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = () => {
    const dataBody = getRequestPayload() || {};
    mutate({
      method: getApiKeysTitleAndUrl().method,
      url: getApiKeysTitleAndUrl().url,
      data: dataBody,
      contentType: getApiKeysTitleAndUrl().contentType
    });
  };

  const handleGeneratedPlaceholderIdClick = () => {
    const editor = editorRef.current.getEditor();
    const range = editor.getSelection();
    const position = range ? range.index : 0;
    const newPlaceHolderId = uuidv4();
    placeHolderRef.current.placeholderIds.push(newPlaceHolderId);
    const placeHolderIdString = `{Generated Text Placeholder - ID ${newPlaceHolderId}}`;
    editor.insertText(position, placeHolderIdString, {
      color: "blue",
      italic: true
    });
  };
  const onSuccessCallback = () => {
    let message;
    if (templateState === TemplateState.CREATED) {
      message = ToastMessageText.templateCreated;
    } else if (templateState === TemplateState.EDITED) {
      message = ToastMessageText.templateEdited;
    } else {
      message = ToastMessageText.templateDeleted;
    }
    setToastInfo({ message, severity: TOAST_TYPE.SUCCESS });
  };

  useEffect(() => {
    if (apiChangeStatus === "success") {
      setOpen(false);
      onSuccessCallback();
    }
  }, [apiChangeStatus]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title" className="create-edit-view-template">
        <div style={{ minWidth: "500px" }}>
          <h2 className="MuiDialogTitle-root">{getApiKeysTitleAndUrl().title}</h2>
        </div>
        <Grid container className="align-items-center d-flex">
          {templateState !== TemplateState.READONLY && templateState !== TemplateState.DELETE && projectName.length > 0 && (
            <Grid item xs={6}>
              <div className="d-flex">
                <span className="m-1 project-label">Project Name:</span>
                <span className="m-1">{projectName}</span>
              </div>
            </Grid>
          )}
          <Grid item xs={6}>
            <div className="d-flex">
              <span className="label">Template Name:</span>
              {templateState !== TemplateState.READONLY && templateState !== TemplateState.DELETE ? (
                <FormControl>
                  <TextField
                    placeholder="Enter template name"
                    className="customTextField"
                    sx={{ width: "16rem" }}
                    defaultValue={templateState !== TemplateState.CREATED ? name : ""}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                </FormControl>
              ) : (
                <p className="m-1">{name}</p>
              )}
            </div>
          </Grid>
        </Grid>
        <DialogContent className="px-1">
          {templateState !== TemplateState.READONLY && templateState !== TemplateState.DELETE && (
            <div className="template-view-container">
              <QuillEditor editorHtml={editorHtml || ""} setEditorHtml={setEditorHtml} editorRef={editorRef} />
            </div>
          )}
          {templateState === TemplateState.READONLY && editorHtml && <div className="template-view-container">{parse(editorHtml)}</div>}
          {apiChangeStatus === "loading" && (
            <div className="template-action-loader d-flex position-absolute align-items-center justify-content-center mt-6">
              <CircularProgress sx={{ margin: "auto" }} />
            </div>
          )}
          {templateState === TemplateState.DELETE && <div>You are about to delete a template, this action cannot be reversed.</div>}
        </DialogContent>
        <Divider className="template-divider mb-3" />
        <DialogActions
          className={`d-flex ${
            templateState !== TemplateState.READONLY && templateState !== TemplateState.DELETE ? "justify-content-between" : "justify-content-end"
          }`}
        >
          {templateState !== TemplateState.READONLY && templateState !== TemplateState.DELETE && (
            <div>
              <Button
                onClick={() => handleGeneratedPlaceholderIdClick()}
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                  "borderWidth": "1px",
                  "fontSize": "14px",
                  "&:hover": {
                    borderWidth: "2px"
                  }
                }}
              >
                Generate PlaceHolder ID
              </Button>
            </div>
          )}
          {templateState !== TemplateState.READONLY && (
            <div className="final-btns">
              <Button onClick={handleClose} variant="outlined" className="confirmation-btn">
                Cancel
              </Button>
              <Button
                variant="contained"
                className="confirmation-btn"
                onClick={handleSave}
                disabled={name.trim().length === 0 || editorHtml?.trim()?.length === 0}
                sx={{ marginLeft: "16px" }}
              >
                {templateState === TemplateState.DELETE ? "Delete" : "Save"}
              </Button>
            </div>
          )}
          {templateState === TemplateState.READONLY && (
            <Button variant="contained" className="confirmation-btn" onClick={() => setOpen(false)} sx={{ marginLeft: "auto" }}>
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

CreateEditViewDeleteTemplate.defaultProps = {
  templateState: TemplateState.CREATED,
  templateName: ""
};

export default CreateEditViewDeleteTemplate;
