import parse from "html-react-parser";

import { placeHolderRegex, placeHolderRegexGlobal } from "./constants";

import EditDocumentEmptyState from "../components/EditDocumentEmptyState/EditDocumentEmptyState";
import PlaceholderEditors from "../components/PlaceholderEditors/PlaceholderEditors";
import { EditDocumentText } from "../i18n/EditDocumentText";

export const generateDocumentWithPlaceHoldersToEdit = (
  htmlContent,
  editedContent,
  setEditedContent,
  documentSectionRef,
  setIsAssitantDisabled,
  setSelectedPlaceHolderId,
  placeholderAndChatId
) => {
  if (!htmlContent) {
    return <EditDocumentEmptyState header={EditDocumentText.contentUnavailable} subHeader={EditDocumentText.selectTemplate} />;
  }
  return parse(htmlContent, {
    // eslint-disable-next-line consistent-return
    replace: (domNode) => {
      if (domNode.type === "tag") {
        const content = domNode.children[0]?.data;
        if (placeHolderRegex.test(content)) {
          const match = placeHolderRegex.exec(content);
          // Extract the ID from the matched content
          const placeholderId = match[1];
          return (
            <PlaceholderEditors
              documentSectionRef={documentSectionRef}
              placeholderId={placeholderId}
              content={content}
              setIsAssitantDisabled={setIsAssitantDisabled}
              setSelectedPlaceHolderId={setSelectedPlaceHolderId}
              editedContent={editedContent}
              setEditedContent={setEditedContent}
              placeholderAndChatId={placeholderAndChatId}
            />
          );
        }
      }
    }
  });
};

export const removeGeneratedPlaceHolders = (htmlContent) => htmlContent.replaceAll(placeHolderRegexGlobal, "");
