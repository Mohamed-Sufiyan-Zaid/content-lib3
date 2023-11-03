import { useState, useEffect } from "react";

import "./PromptSuggestion.scss";
import useDebounce from "../../hooks/useDebounce";
import { useModifier } from "../../hooks/useReactQuery";
import { HTTPMethods, PromptLibraryApiEndpoints, ContentLibraryApiEndpoints } from "../../utils/constants";
import { ApiResponseKeys as ContentApiResponseKeys } from "../../utils/contentApiKeysMap";
import { ApiResponseKeys } from "../../utils/promptApiKeysMap";
import Accordion from "../common/Accordion";
import TextArea from "../common/TextArea";

const PromptSuggestion = ({ domainDetails, inputCallBack, chatHistory, updateChatData, setIsLoading, setIsError, selectedLibrary }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setLoad] = useState(false);
  const [accordionItems, setAccordionItems] = useState([]);

  const debouncedInputValue = useDebounce(inputValue, 500);

  const { mutate, isSuccess: isSuggestionsListSuccess, data: promptSuggestionsData } = useModifier({ project: "promptLib" });
  const {
    mutate: getLLMResult,
    isSuccess: isLLMSuccess,
    data: LLMData,
    isLoading: isLLMLoading,
    isError: isLLMError
  } = useModifier({ project: "contentLib" });

  useEffect(() => {
    if (isLLMLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLLMLoading]);

  useEffect(() => {
    if (isLLMError) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [isLLMError]);

  useEffect(() => {
    if (debouncedInputValue) {
      mutate({
        method: HTTPMethods.POST,
        url: PromptLibraryApiEndpoints.promptSuggestions,
        data: {
          // TODO: ask BE to send domain, subdomain name in get document by id
          [ApiResponseKeys.domainName]: domainDetails.domainName,
          [ApiResponseKeys.subDomainName]: domainDetails.subDomainName,
          // NOTE: This will be a default value to search across all categories
          [ApiResponseKeys.categoryName]: null,
          [ApiResponseKeys.keyword]: debouncedInputValue
        }
      });
    }
  }, [debouncedInputValue]);

  useEffect(() => {
    if (isSuggestionsListSuccess) {
      const tempAccordianData = [];
      promptSuggestionsData?.data?.map((item) => {
        const accordianItem = {
          summary: `${item.prompt_text.slice(0, 70)}...`,
          details: item.prompt_text
        };
        return tempAccordianData.push(accordianItem);
      });
      setAccordionItems(tempAccordianData);
    }
  }, [promptSuggestionsData, isSuggestionsListSuccess]);
  const getRowCount = (text) => {
    if (!text) return 1;
    const charactersPerRow = 70;
    return Math.max(1, Math.ceil(text.length / charactersPerRow));
  };

  const handleOnClick = () => {
    if (inputCallBack) {
      inputCallBack(inputValue);
    }
    setLoad(true);
    const requestBody = {
      [ContentApiResponseKeys.prompt]: inputValue,
      [ContentApiResponseKeys.contentIndexId]: selectedLibrary.contentIndexId,
      [ContentApiResponseKeys.documentId]: selectedLibrary.documentContentIndexId,
      [ContentApiResponseKeys.contentMetaId]: selectedLibrary.documentChunkMetadataId,
      [ContentApiResponseKeys.chatHistory]: chatHistory?.slice(-10) ?? []
    };
    setInputValue("");
    getLLMResult({
      method: HTTPMethods.POST,
      url: ContentLibraryApiEndpoints.llm,
      data: requestBody
    });
  };

  const handleOnKeyPress = (event) => {
    if (event.keyCode === 13 && event.target.value !== "") {
      handleOnClick();
    }
  };

  useEffect(() => {
    if (isLLMSuccess && LLMData) {
      const data = [
        {
          user_query: LLMData.data?.query,
          bot: LLMData.data?.result,
          citation: LLMData.data?.source_documents?.map((item) => {
            const metadata = item?.metadata;
            return {
              documentName: metadata?.filename,
              page: metadata?.page || "",
              section: metadata?.section || ""
            };
          })
        }
      ];
      updateChatData(data);
      setLoad(false);
    }
  }, [isLLMSuccess, LLMData]);

  return (
    <div className="combined-container">
      {inputValue && (
        <>
          {accordionItems.length > 0 && <h6>{`Suggestions (${accordionItems.length}) `}</h6>}
          <div className="accordion-container">
            {accordionItems.map((item, index) => (
              <div key={index} className="expanded-container">
                {/* TODO: There will be no summary, trim the content or keep a fixed header */}
                <Accordion summary={item.summary} details={item.details} onClick={() => setInputValue(item.details)} />
              </div>
            ))}
          </div>
        </>
      )}
      <div className={`input-wrapper d-flex ${isLoading ? " disable" : "normal"}`}>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows={getRowCount(inputValue)}
          handleOnClick={handleOnClick}
          handleOnKeyPress={handleOnKeyPress}
        />
      </div>
    </div>
  );
};

export default PromptSuggestion;
