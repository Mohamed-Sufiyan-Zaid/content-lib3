import "./Assistant.scss";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

import { useFetcher, useModifier } from "../../hooks/useReactQuery";
import { commonText } from "../../i18n/Common";
import { TOAST_TYPE } from "../../models/components/enums";
import { ApiResponseKeys } from "../../utils/apiKeysMap";
import { ApiEndpoints, AssistantTabHeaders, HTTPMethods, QueryKeys } from "../../utils/constants";
import AdvancedFilter from "../AdvancedFilter/AdvancedFilter";
import ChatMessage from "../ChatMessage/ChatMessage";
import TabsContainer from "../common/TabsContainer/TabsContainer";
import ToastMessage from "../common/ToastMessage/ToastMessage";
import EditDocumentEmptyState from "../EditDocumentEmptyState/EditDocumentEmptyState";
import PromptSuggestion from "../PromptSuggestions/PromptSuggestion";

function Assistant({
  isDisabled = true,
  selectedPlaceHolderId,
  selectedChatId,
  domainDetails,
  setEditedContent,
  selectedLibrary,
  setSelectedLibrary
}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [chatData, setData] = useState([]);
  const { data: chatHistoryData } = useFetcher({
    url: `${ApiEndpoints.chatHistory}/${selectedChatId}`,
    queryKey: [QueryKeys.chatHistory, selectedChatId],
    enableQuery: !!selectedChatId
  });
  const { mutate } = useModifier({ inValidateQueryKey: [QueryKeys.chatHistory] });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (chatHistoryData) {
      setData(chatHistoryData);
    }
  }, [chatHistoryData]);

  const handleTabChange = (event, newValue) => {
    setActiveTabIndex(newValue);
  };
  const updatedInput = (value) => {
    const curChatData = [...chatData];
    curChatData.push({
      user_query: value,
      bot: "",
      citation: ""
    });
    setData(curChatData);
  };

  const updateChatData = (data) => {
    const updatedChatData = chatData;
    updatedChatData.pop();
    updatedChatData.push(data[0]);
    setData([...updatedChatData]);
    mutate({
      method: HTTPMethods.POST,
      url: ApiEndpoints.chatHistory,
      data: { [ApiResponseKeys.chatHistory]: updatedChatData },
      params: { [ApiResponseKeys.id]: selectedChatId }
    });
  };

  return (
    <div className={`d-flex flex-column assitant-comp ${isLoading ? "loading-assistant-backdrop" : ""}`}>
      <TabsContainer
        tabLabels={AssistantTabHeaders}
        tabsAriaLabel={commonText.AssistantAria}
        activeTabIndex={activeTabIndex}
        handleChange={handleTabChange}
        isSticky
      />
      {isLoading && (
        <div className="assistant-loader" style={{ zIndex: 100 }}>
          <CircularProgress sx={{ zIndex: 5 }} />
        </div>
      )}
      {isError && <ToastMessage severity={TOAST_TYPE.ERROR} isVisible hideToast={setIsError} message="Error in fetching chat result" />}
      <div className="prompt-assistant">
        {activeTabIndex === 0 && isDisabled && (
          <EditDocumentEmptyState header="Assistant not available" subHeader="Please select a placeholder to enable Assistant" />
        )}
        {activeTabIndex === 0 && !isDisabled && (
          <>
            <div className="messages-container" style={{ flex: 1, overflow: "auto" }}>
              {chatData?.length > 0 &&
                chatData.map((message, index) => (
                  <div key={index}>
                    <ChatMessage
                      textMessage={message.user_query}
                      isReply={message.bot}
                      botMessage={message.bot}
                      citationsContent={message.citation}
                      selectedPlaceHolderId={selectedPlaceHolderId}
                      setEditedContent={setEditedContent}
                    />
                  </div>
                ))}
            </div>
            <div className="suggestions-box">
              <PromptSuggestion
                selectedPlaceHolderId={selectedPlaceHolderId}
                inputCallBack={updatedInput}
                updateChatData={updateChatData}
                domainDetails={domainDetails}
                chatHistory={chatHistoryData}
                setIsLoading={setIsLoading}
                setIsError={setIsError}
                selectedLibrary={selectedLibrary}
              />
            </div>
          </>
        )}
        {activeTabIndex === 1 && <AdvancedFilter selectedLibrary={selectedLibrary} setSelectedLibrary={setSelectedLibrary} />}
      </div>
    </div>
  );
}

export default Assistant;
