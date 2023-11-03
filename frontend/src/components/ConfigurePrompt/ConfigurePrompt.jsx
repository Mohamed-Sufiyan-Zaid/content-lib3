import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useContext, useEffect, useState } from "react";

import UserContext from "../../context/UserContext";
import { useFetcher, useModifier } from "../../hooks/useReactQuery";
import { commonText } from "../../i18n/Common";
import { ConfirmationBoxText } from "../../i18n/Components";
import { ConfigurePromptText } from "../../i18n/ConfigurePromptText";
import { ToastMessageText } from "../../i18n/ToastMessageText";
import { HTTPMethods, PromptLibraryApiEndpoints, PromptQueryKeys } from "../../utils/constants";
import { ApiResponseKeys } from "../../utils/promptApiKeysMap";
import ConfirmationBox from "../common/ConfirmationBox/ConfirmationBox";
import Select from "../common/Select/Select";

export default function ConfigurePrompt({ openModal, setOpenModal, setToastInfo }) {
  const [group, setGroup] = useState("");
  const [domain, setDomain] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [category, setCategory] = useState("");
  const { ntId } = useContext(UserContext);
  const isFormValid = domain && subDomain && category;

  const {
    data: groupsList,
    isLoading: isGroupsListLoading,
    isError: isGroupsListError
  } = useFetcher({
    url: PromptLibraryApiEndpoints.groupsList,
    queryKey: [PromptQueryKeys.groupsList],
    enableQuery: openModal,
    staleTime: 10000,
    project: "promptLib"
  });

  const clearForm = () => {
    setGroup("");
    setDomain("");
    setSubDomain("");
    setCategory("");
  };

  const onSuccessCallback = (message) => {
    setToastInfo(message);
  };

  const { mutate, isSuccess: isConfiguredPromptSuccess, isError } = useModifier({ project: "promptLib" });

  const handleSave = () => {
    mutate({
      method: HTTPMethods.POST,
      url: PromptLibraryApiEndpoints.createConfig,
      data: {
        [ApiResponseKeys.ntId]: ntId,
        domain_name: domain,
        sub_domain_name: subDomain,
        category_name: category
      }
    });
  };

  useEffect(() => {
    if (isConfiguredPromptSuccess) {
      onSuccessCallback(ToastMessageText.promptConfigurationSuccess);
    } else if (isError) {
      onSuccessCallback(ToastMessageText.promptConfigurationFailure);
    }
    setOpenModal(false);
    clearForm();
  }, [isConfiguredPromptSuccess]);

  return (
    <ConfirmationBox
      title={ConfigurePromptText.titleText}
      agreeText={ConfirmationBoxText.agreeText}
      disagreeText={ConfirmationBoxText.disagreeText}
      isAgreeDisabled={!isFormValid}
      isOpen={openModal}
      handleClose={() => {
        setOpenModal(false);
        clearForm();
      }}
      handleAccept={handleSave}
    >
      <div className="project-changes-container">
        <div className="configure prompt">
          <Select
            value={group}
            label={commonText.groupLabel}
            placeholder={commonText.groupPlaceHolder}
            options={groupsList}
            margin={{ xs: "0 0 1rem 0", md: "0 0 2rem 0" }}
            onChange={(event) => setGroup(event.target.value)}
            isLoading={isGroupsListLoading}
            isError={isGroupsListError}
          />
          <div className="d-flex mb-3">
            <FormControl fullWidth>
              <FormLabel className="mb-2">{commonText.domainLabel}</FormLabel>
              <TextField value={domain} placeholder={commonText.domainTextPlaceholder} onChange={(event) => setDomain(event.target.value)} />
            </FormControl>
            <FormControl fullWidth sx={{ margin: "0 0 0 1rem" }}>
              <FormLabel className="mb-2">{commonText.subDomainLabel}</FormLabel>
              <TextField value={subDomain} placeholder={commonText.subDomainTextPlaceholder} onChange={(event) => setSubDomain(event.target.value)} />
            </FormControl>
            <FormControl fullWidth sx={{ margin: "0 0 0 1rem" }}>
              <FormLabel className="mb-2">{commonText.categoryLabel}</FormLabel>
              <TextField value={category} placeholder={commonText.categoryPlaceholder} onChange={(event) => setCategory(event.target.value)} />
            </FormControl>
          </div>
        </div>
      </div>
    </ConfirmationBox>
  );
}
