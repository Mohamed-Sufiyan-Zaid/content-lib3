import { Button } from "@mui/material";
import { useState, useEffect } from "react";

import { useFetcher } from "../../hooks/useReactQuery";
import { AdvancedFilterText } from "../../i18n/AdvancedFilterText";
import { TOAST_TYPE } from "../../models/components/enums";
import { ContentLibraryApiEndpoints, ContentQueryKeys, DefaultFilterSelection } from "../../utils/constants";
import { ApiResponseKeys } from "../../utils/contentApiKeysMap";
import Select from "../common/Select/Select";
import ToastMessage from "../common/ToastMessage/ToastMessage";

function AdvancedFilter({ selectedLibrary, setSelectedLibrary }) {
  const { contentIndexId, documentContentIndexId, documentChunkMetadataId } = selectedLibrary;
  const { data: documentContentData, isSuccess: documentDataSuccess } = useFetcher({
    url: `${ContentLibraryApiEndpoints.documentByContextId}/${contentIndexId}`,
    queryKey: [ContentQueryKeys.documentByContentId + contentIndexId],
    enableQuery: contentIndexId > 0,
    staleTime: 10000,
    project: "contentLib"
  });
  const { data: documentChunkMetaData, isSuccess: chunkMetaDataSuccess } = useFetcher({
    url: ContentLibraryApiEndpoints.documentChunkMetadata,
    queryKey: [ContentQueryKeys.documentContentChunkData + documentContentIndexId],
    params: { [ApiResponseKeys.contentIndexId]: contentIndexId, [ApiResponseKeys.documentId]: documentContentIndexId },
    enableQuery: documentContentIndexId > 0,
    staleTime: 10000,
    project: "contentLib"
  });
  const [contentLibraryDocumentData, setContentLibraryDocumentData] = useState([]);
  const [contentChunkMetaData, setContentChunkMetaData] = useState([]);
  const [openToast, setOpenToast] = useState(false);

  const handleValueChange = (value, key) => {
    setSelectedLibrary({ [key]: value });
  };

  useEffect(() => {
    if (!documentContentData?.length) {
      handleValueChange(-1, "documentContentIndexId");
    }
    const data =
      documentContentData?.map((item) => ({
        name: item[ApiResponseKeys.fileName],
        id: item[ApiResponseKeys.documentId]
      })) || [];
    setContentLibraryDocumentData([DefaultFilterSelection, ...data]);
  }, [documentContentData, documentDataSuccess]);

  useEffect(() => {
    if (!documentChunkMetaData?.length) {
      handleValueChange(-1, "documentChunkMetadataId");
    }
    const data =
      documentChunkMetaData?.map((item) => ({
        name: item[ApiResponseKeys.section],
        id: item[ApiResponseKeys.contentMetadataId]
      })) || [];
    setContentChunkMetaData([DefaultFilterSelection, ...data]);
  }, [documentChunkMetaData, chunkMetaDataSuccess]);

  const handleApplyClick = () => {
    // Open the modal by setting openModal to true
    // setOpenModal(true);
    setOpenToast(true);
  };

  return (
    <div className="d-flex m-2 flex-column advanced-filters-container">
      <Select
        value={documentContentIndexId}
        label={AdvancedFilterText.documentLabel}
        placeholder={AdvancedFilterText.documentPlaceholder}
        options={contentLibraryDocumentData}
        isOptionsArrayOfObjects
        isDisabled={contentIndexId <= 0}
        margin={{ xs: "0 0 1rem 0", md: "0 0 2rem 0" }}
        onChange={(event) => handleValueChange(event.target.value, "documentContentIndexId")}
      />
      {documentContentIndexId !== -1 && (
        <Select
          value={documentChunkMetadataId}
          label={AdvancedFilterText.selectionLabel}
          placeholder={AdvancedFilterText.selectionPlaceholder}
          options={contentChunkMetaData}
          margin={{ xs: "0 0 1rem 0", md: "0 0 2rem 0" }}
          isOptionsArrayOfObjects
          isDisabled={documentContentIndexId <= 0}
          onChange={(event) => handleValueChange(event.target.value, "documentChunkMetadataId")}
        />
      )}
      <div className="d-flex flex-row justify-content-around">
        <Button disabled={contentIndexId <= 0} type="Submit" onClick={handleApplyClick} disableElevation variant="contained">
          {AdvancedFilterText.applyButton}
        </Button>
      </div>
      <ToastMessage isVisible={openToast} hideToast={setOpenToast} severity={TOAST_TYPE.SUCCESS} message="Filter has been successfully applied" />
    </div>
  );
}

export default AdvancedFilter;
