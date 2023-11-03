import CloseIcon from "@mui/icons-material/Close";
import { FormControl, FormLabel, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";

// import AddIcon from "@mui/icons-material/Add";
import DocSplit from "../../components/common/DocSplit/DocSplit";
import Select from "../../components/common/Select/Select";
import { useFetcher } from "../../hooks/useReactQuery";
import { AdvSettingsText } from "../../i18n/AdvancedSettingsText";
import { ContentLibraryApiEndpoints, ContentQueryKeys } from "../../utils/constants";
import { ApiResponseKeys } from "../../utils/contentApiKeysMap";
import "./AdvancedSettings.scss";

const AdvancedSettingsPage = ({ anchor, open, closeListener, onSubmit }) => {
  const [advanceFilterData, setAdvanceFilterData] = useState({});
  const {
    data: defaultFilterData = {},
    isSuccess: isDefaultFilterSuccess,
    isLoading: isDefaultFilterLoading
  } = useFetcher({
    url: ContentLibraryApiEndpoints.defaultFilters,
    queryKey: [ContentQueryKeys.defaultFilters],
    enableQuery: open,
    staleTime: 50000,
    project: "contentLib"
  });

  useEffect(() => {
    if (isDefaultFilterSuccess) {
      const { content_splitting_metadata: contentSplittingMetadata } = defaultFilterData;
      const formattedDefaultData = {};
      formattedDefaultData.chunkOverlap = contentSplittingMetadata[ApiResponseKeys.chunkOverlap];
      formattedDefaultData.chunkSize = contentSplittingMetadata[ApiResponseKeys.chunkSize];
      formattedDefaultData.chunkingAlgorithm = contentSplittingMetadata[ApiResponseKeys.chunkingAlgorithm];
      formattedDefaultData.length = contentSplittingMetadata[ApiResponseKeys.length];
      formattedDefaultData.splitDocumentBy = contentSplittingMetadata[ApiResponseKeys.splitDocumentBy];
      setAdvanceFilterData(formattedDefaultData);
    }
  }, [isDefaultFilterSuccess, defaultFilterData]);

  const { data: lengthsData } = useFetcher({
    url: ContentLibraryApiEndpoints.enums,
    queryKey: [ContentQueryKeys.enumsModel],
    params: {
      key: "length"
    },
    enableQuery: open,
    staleTime: 10000,
    project: "contentLib"
  });

  const { data: modelsData } = useFetcher({
    url: ContentLibraryApiEndpoints.enums,
    queryKey: ContentQueryKeys.enumLength,
    params: {
      key: "models"
    },
    enableQuery: open,
    staleTime: 10000,
    project: "contentLib"
  });

  // TODO: this is to be enabled when we start supporting multiple options
  // const addMoreSections = () => {
  //   const list = [...advanceFilterData.splitDocumentBy, ""];
  //   setAdvanceFilterData((prev) => ({
  //     ...prev,
  //     splitDocumentBy: list
  //   }));
  // };

  const toggleDrawer = (openDrawer) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    closeListener(openDrawer);
  };

  const handleValueChange = (value, index) => {
    const list = advanceFilterData.splitDocumentBy;
    list[index] = value;
    setAdvanceFilterData((prev) => ({
      ...prev,
      splitDocumentBy: list
    }));
  };

  const deleteSection = (index) => {
    const list = advanceFilterData.splitDocumentBy;
    list.splice(index, 1);
    setAdvanceFilterData((prev) => ({
      ...prev,
      splitDocumentBy: list
    }));
  };

  const btnApplyListener = () => {
    onSubmit(advanceFilterData);
    closeListener(false);
  };
  return (
    <div key={anchor}>
      <Drawer anchor={anchor} open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 500 }} role="presentation" className="advanced-settings-container">
          <div className="row">
            <div className="col-lg-12">
              <div className="pull-right">
                <CloseIcon onClick={toggleDrawer(false)} />
              </div>
            </div>
          </div>
          <div className="advanced-settings">
            <div className="row">
              <div className="advanced-heading">
                <h1>{AdvSettingsText.advSettings}</h1>
              </div>
            </div>
            <Divider />
            <div className="row">
              <div className="col-lg-12">{AdvSettingsText.descTextForAdvancedSettings}</div>
            </div>
            <div className="row box">
              <div className="col-lg-12 heading">{AdvSettingsText.uploadedInfoQuestionText}</div>
              <Divider />

              <div className="col-lg-12 sub-heading text-uppercase">{AdvSettingsText.splitDocQuestionText}</div>
              <div className="col-lg-12">
                <DocSplit
                  itemsList={advanceFilterData.splitDocumentBy}
                  handleValueChange={handleValueChange}
                  deleteItem={deleteSection}
                  optionsList={lengthsData}
                  isLoading={isDefaultFilterLoading}
                  isSuccess={isDefaultFilterSuccess}
                />
              </div>
            </div>

            <div className="row box">
              <div className="col-lg-12 heading">{AdvSettingsText.needToAdjustAdvConfig}</div>
              <Divider />
              <div className="row">
                <div className="col-lg-12">
                  <Select
                    value={advanceFilterData.chunkingAlgorithm}
                    label="Select Model"
                    placeholder="Select a Model"
                    options={modelsData}
                    onChange={(e) =>
                      setAdvanceFilterData((prev) => ({
                        ...prev,
                        chunkingAlgorithm: e.target.value
                      }))
                    }
                    margin={{ xs: "0 0 1rem 0", md: "0 0 2rem 0" }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 sub-heading">{AdvSettingsText.splitParameters}</div>
                <div className="col-lg-6">
                  <FormControl className="mui-custom-form" fullWidth>
                    <FormLabel className="mb-2">{AdvSettingsText.formLabelChunkSize}</FormLabel>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      value={advanceFilterData.chunkSize}
                      onChange={(e) =>
                        setAdvanceFilterData((prev) => ({
                          ...prev,
                          chunkSize: e.target.value
                        }))
                      }
                    />
                  </FormControl>
                </div>
                <div className="col-lg-6">
                  <FormControl className="mui-custom-form" fullWidth>
                    <FormLabel className="mb-2">{AdvSettingsText.formLabelChunkOverlap}</FormLabel>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      value={advanceFilterData.chunkOverlap}
                      onChange={(e) =>
                        setAdvanceFilterData((prev) => ({
                          ...prev,
                          chunkOverlap: e.target.value
                        }))
                      }
                    />
                  </FormControl>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <Select
                    value={advanceFilterData.length}
                    label="Length Parameters"
                    placeholder="Select a length"
                    options={lengthsData}
                    margin={{ xs: "0 0 1rem 0", md: "0 0 2rem 0" }}
                    onChange={(e) =>
                      setAdvanceFilterData((prev) => ({
                        ...prev,
                        length: e.target.value
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <Divider />
            <div className="row">
              <Button variant="contained" onClick={btnApplyListener}>
                {AdvSettingsText.applyChangesBtn}
              </Button>
            </div>
          </div>
        </Box>
      </Drawer>
    </div>
  );
};
export default AdvancedSettingsPage;
