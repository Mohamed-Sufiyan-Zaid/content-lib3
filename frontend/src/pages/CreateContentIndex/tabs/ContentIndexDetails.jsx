import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";

import ChevronRight from "../../../assets/images/chevron_right.svg?react";
import { useModifier } from "../../../hooks/useReactQuery";
import { AppText } from "../../../i18n/AppText";
import { INDEX_SHARING, TOAST_TYPE } from "../../../models/components/enums";
import "./ContentIndexDetails.scss";
import { hasSpacesCapsSpecialChars } from "../../../utils/common";
import { ContentLibraryApiEndpoints, ContentQueryKeys, HTTPMethods } from "../../../utils/constants";
import { ApiResponseKeys } from "../../../utils/contentApiKeysMap";
import AdvancedSettings from "../../AdvancedSettings/AdvancedSettings";

export const ContentIndexDetails = forwardRef(
  ({ onIsFormValidChange, onContentIndexSuccess, setContentIndexCreationStatus, setContentIndexMessage, setOpenToast }, ref) => {
    const [openAnchor, setOpenAnchor] = useState(false);
    const [formData, setFormData] = useState({
      contentIndexName: "",
      contentDescription: "",
      indexType: "shared",
      metaTags: [],
      relatedTag: ""
    });

    const [indexNameError, setIndexNameError] = useState(false);

    const customOnSuccess = (data) => {
      setContentIndexCreationStatus(TOAST_TYPE.SUCCESS);
      setContentIndexMessage(data.message);
      const { [ApiResponseKeys.resourceId]: resourceId } = data;
      onContentIndexSuccess(resourceId);
      setOpenToast(true);
    };
    const handleCustomError = () => {
      setContentIndexCreationStatus(TOAST_TYPE.ERROR);
      setContentIndexMessage("Failed to create Content Index");
      setOpenToast(true);
    };
    const { mutate } = useModifier({
      inValidateQueryKey: [ContentQueryKeys.contentByIndex],
      project: "contentLib",
      customOnSuccess,
      handleCustomError
    });
    useImperativeHandle(ref, () => ({
      submitIndexData() {
        const data = {
          [ApiResponseKeys.ntId]: AppText.ntId,
          [ApiResponseKeys.contentIndexName]: formData.contentIndexName,
          [ApiResponseKeys.contentDescription]: formData.contentDescription,
          [ApiResponseKeys.indexType]: formData.indexType,
          [ApiResponseKeys.metaTags]: formData.metaTags,
          [ApiResponseKeys.contentSplittingMetadata]: formData.contentSplittingMetadata
        };
        mutate({
          method: HTTPMethods.POST,
          url: ContentLibraryApiEndpoints.contentIndex,
          data
        });
      }
    }));

    const storeAdvanceFilterData = (advanceFilterData) => {
      setFormData((prev) => ({
        ...prev,
        contentSplittingMetadata: {
          [ApiResponseKeys.chunkOverlap]: advanceFilterData.chunkOverlap,
          [ApiResponseKeys.chunkSize]: advanceFilterData.chunkSize,
          [ApiResponseKeys.chunkingAlgorithm]: advanceFilterData.chunkingAlgorithm,
          [ApiResponseKeys.length]: advanceFilterData.length,
          [ApiResponseKeys.splitDocumentBy]: advanceFilterData.splitDocumentBy
        }
      }));
    };

    const storeRelatedTags = () => {
      if (formData.relatedTag.trim()) {
        const tags = formData.metaTags;
        tags.push(formData.relatedTag);
        setFormData((prev) => ({
          ...prev,
          relatedTag: "",
          metaTags: tags
        }));
      }
    };

    const handleTextFieldChange = (e) => {
      const { name, value } = e.target;
      const updatedFormData = {
        ...formData,
        [name]: value
      };
      setFormData(updatedFormData);
    };

    useEffect(() => {
      const isValid = !!formData.contentIndexName && !!formData.indexType && !hasSpacesCapsSpecialChars(formData.contentIndexName);
      onIsFormValidChange(isValid);
    }, [formData]);

    const removeStoredRelatedTag = (i) => {
      const tags = formData.metaTags;
      tags.splice(i, 1);
      setFormData((prev) => ({
        ...prev,
        tags
      }));
    };

    const closeListener = (openDrawer) => {
      setOpenAnchor(openDrawer);
    };

    const addTagOnKeyPress = (event) => {
      if (event.keyCode === 13 && event.target.value !== "") {
        storeRelatedTags();
      }
    };

    const validateIndexName = ({ target: { value: indexName } }) => {
      setIndexNameError(hasSpacesCapsSpecialChars(indexName));
    };

    const handleRadioChange = (e) => {
      const { value } = e.target;
      setFormData({
        ...formData,
        indexType: value
      });
    };
    return (
      <>
        <AdvancedSettings anchor="right" open={openAnchor} onSubmit={storeAdvanceFilterData} closeListener={closeListener} />
        <div className="d-flex gap-1 mb-3 mt-4 flex-column">
          <h4 className="h4 m-0">Content Index Details</h4>
          <p>Add name and description for the content index, and tags to add additional descriptive context to the content index.</p>
        </div>
        <div className="contentIndexDetails p-3 d-flex">
          <div className="left-side-custom">
            <Typography variant="subtitle1" style={{ fontSize: "16px", fontWeight: "bold" }}>
              Basic Details
            </Typography>
            <hr />
            <div className="input-group-custom">
              <FormControl fullWidth sx={{ margin: { xs: "0 0 1rem 0", md: "0 0 2rem 0" } }}>
                <FormLabel htmlFor="contentIndexName" className="mb-2">
                  Name of the index
                </FormLabel>
                <TextField
                  value={formData.contentIndexName}
                  placeholder="Enter a name for the index"
                  id="contentIndexName"
                  name="contentIndexName"
                  onChange={handleTextFieldChange}
                  onBlur={validateIndexName}
                  error={indexNameError}
                  helperText={indexNameError && "Index name should be in lowercase with no spaces and no special characters other than _ or -"}
                />
              </FormControl>
            </div>

            <div className="input-group-custom" style={{ paddingTop: "10px" }}>
              <FormControl fullWidth sx={{ margin: { xs: "0 0 1rem 0", md: "0 0 2rem 0" } }}>
                <FormLabel htmlFor="relatedTags" className="mb-2">
                  Related tags
                </FormLabel>
                <TextField
                  value={formData.relatedTag}
                  onKeyDown={addTagOnKeyPress}
                  placeholder="Add tags"
                  id="relatedTag"
                  name="relatedTag"
                  onChange={handleTextFieldChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={storeRelatedTags} className="custom-tags-icon h-100 position-absolute end-0 rounded-1">
                          <ChevronRight />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </FormControl>
            </div>
            {!!formData.metaTags.length && (
              <div className="d-flex gap-2 py-2 flex-wrap">
                {formData.metaTags?.map((item, index) => (
                  <Chip label={item} onDelete={() => removeStoredRelatedTag(index)} key={index} />
                ))}
              </div>
            )}
            <Typography variant="subtitle1" style={{ fontSize: "16px", fontWeight: "bold" }}>
              Index Sharing Details
            </Typography>
            <hr />
            <RadioGroup
              aria-label="indexType"
              name="indexType"
              value={formData.indexType}
              onChange={handleRadioChange}
              className="radio-group-custom"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <FormControlLabel value={INDEX_SHARING.PRIVATE} control={<Radio className="radio-button-custom" />} label="Private" />
              <FormControlLabel value={INDEX_SHARING.SHARED} control={<Radio className="radio-button-custom" />} label="Shared" />
            </RadioGroup>
            {formData.indexType && (
              <p className="shared-message">
                {formData.indexType === INDEX_SHARING.PRIVATE
                  ? "Only you will have access to this index"
                  : "All members of the project will have access to this index"}
              </p>
            )}
            <div className="advance-filter">
              <p>Define how the files and data is uploaded</p>
              <Button variant="text" onClick={() => setOpenAnchor(true)} endIcon={<SettingsOutlinedIcon />}>
                Advanced Metadata Filters
              </Button>
            </div>
          </div>
          <div className="right-side-custom">
            <div className="input-group-custom d-flex flex-column" style={{ paddingTop: "10px" }}>
              <FormControl fullWidth sx={{ margin: { xs: "0 0 1rem 0", md: "0 0 2rem 0" } }}>
                <FormLabel htmlFor="description" className="mb-2">
                  Description
                </FormLabel>
                <TextareaAutosize
                  value={formData.contentDescription}
                  placeholder="Enter a Description"
                  id="description"
                  minRows={9}
                  name="contentDescription"
                  onChange={handleTextFieldChange}
                />
              </FormControl>
            </div>
          </div>
        </div>
      </>
    );
  }
);
