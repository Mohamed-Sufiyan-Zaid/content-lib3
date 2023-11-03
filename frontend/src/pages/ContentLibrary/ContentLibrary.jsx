import { Chip, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import KebabMenu from "../../components/common/KebabMenu/KebabMenu";
import NavHeader from "../../components/common/NavHeader/NavHeader";
import Table from "../../components/common/Table/Table";
import TabsContainer from "../../components/common/TabsContainer/TabsContainer";
import ToastMessage from "../../components/common/ToastMessage/ToastMessage";
import SidebarContext from "../../context/SidebarContext";
import { useFetcher, useModifier } from "../../hooks/useReactQuery";
import { INDEX_SHARING, TOAST_TYPE } from "../../models/components/enums";
import { contentLibrary } from "../../utils/breadCrumbMapper";
import {
  ContentQueryKeys,
  CLHeaders,
  CLTabHeaders,
  DocumentTableKebabMenuOptions,
  ContentLibraryApiEndpoints,
  HTTPMethods
} from "../../utils/constants";
import { ApiResponseKeys } from "../../utils/contentApiKeysMap";
import { formatDate } from "../../utils/dateUtils";
import "./ContentLibrary.scss";

const ContenLibraryPage = () => {
  const [tableRows, setTableRows] = useState([]);
  const [tablePageNo, setTablePageNo] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const navigate = useNavigate();
  const { setSidebarButtons, setSidebarTitle } = useContext(SidebarContext);

  const { mutate, status: apiChangeStatus } = useModifier({
    inValidateQueryKey: [ContentQueryKeys.contentByIndex + activeTabIndex],
    project: "contentLib"
  });

  const handleMenuItemClick = (selectionFor = "") => {
    mutate({
      method: HTTPMethods.DELETE,
      url: `${ContentLibraryApiEndpoints.contentIndex}/${selectionFor}`
    });
  };

  useEffect(() => {
    setSidebarButtons([]);
    setSidebarTitle("Content Library");
    return () => {
      setSidebarButtons([]);
      setSidebarTitle("Document Authoring");
    };
  }, []);

  const {
    data: contentIndexes = [],
    isLoading: isContentIndexLoading,
    isError: isContentLibraryFailed,
    isSuccess: isContentLibrarySuccess
  } = useFetcher({
    url: ContentLibraryApiEndpoints.contentByIndex,
    queryKey: [ContentQueryKeys.contentByIndex + activeTabIndex, ContentQueryKeys.defaultFilters],
    params: {
      [ApiResponseKeys.contentIndexType]: activeTabIndex === 0 ? INDEX_SHARING.PRIVATE : INDEX_SHARING.SHARED
    },
    enableQuery: true,
    staleTime: 10000,
    project: "contentLib"
  });

  const formatDataKeys = (data) =>
    data.map((el) => {
      const object = {};
      object.contentDescription = el[ApiResponseKeys.contentDescription];
      object.contentIndexId = el[ApiResponseKeys.contentIndexId];
      object.contentIndexName = el[ApiResponseKeys.contentIndexName];
      object.contentStatus = el[ApiResponseKeys.contentStatus];
      object.createdBy = el[ApiResponseKeys.createdBy];
      object.createdDate = el[ApiResponseKeys.createdDate];
      object.indexType = el[ApiResponseKeys.indexType];
      object.lastModifiedBy = el[ApiResponseKeys.lastModifiedBy];
      object.lastModifiedDate = formatDate(new Date(el.last_modified_date));
      object.metaTags = el[ApiResponseKeys.metaTags];
      object.ntId = el[ApiResponseKeys.ntId];
      object.numDoc = el[ApiResponseKeys.numDoc];
      return object;
    });

  const generateTableContent = () => {
    const clGridData = [];
    const formattedKeysData = formatDataKeys(contentIndexes);
    formattedKeysData?.forEach((data, index) => {
      clGridData[index] = [
        data.contentIndexName,
        data.contentStatus,
        data.numDoc,
        data.lastModifiedDate,
        <div key={index} className="d-flex gap-2">
          {data.metaTags.map((item, chipIndex) => (
            <Stack key={chipIndex} direction="row" spacing={1}>
              <Chip label={item} />
            </Stack>
          ))}
        </div>,
        <div key={index} className="d-flex">
          <Button variant="text" disabled sx={{ textDecoration: "underline" }} onClick={() => navigate(`/content/${data.id}`)}>
            View
          </Button>
          <KebabMenu
            handleMenuItemClick={() => handleMenuItemClick(data.content_index_name)}
            menuOptions={DocumentTableKebabMenuOptions}
            closeOnSelect
          />
        </div>
      ];
    });
    return clGridData;
  };

  useEffect(() => {
    setTableRows(generateTableContent());
  }, [activeTabIndex, isContentIndexLoading, contentIndexes, isContentLibrarySuccess]);

  const handleTabChange = (_event, newValue) => {
    setActiveTabIndex(newValue);
  };

  const createNewIndex = () => {
    const url = new URL(window.location);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.indexOf("project") + 1];
    navigate("/project/createContent", {
      state: { id }
    });
  };

  // const libraryIndexListener = () => {};
  return (
    <div className="content-library-container">
      <NavHeader breadcrumbData={contentLibrary} />
      <div className="content">
        <div className="row">
          <div className="col-lg-6">
            <h1 className="doc-heading">Content Library Indexes</h1>
          </div>
          <div className="col-lg-3">
            <div className="pull-right">
              {/* <Button variant="text" onClick={libraryIndexListener} endIcon={<HelpIcon />}>
                What is library index?
              </Button> */}
            </div>
          </div>
          <div className="col-lg-3">
            <div className="pull-right">
              <Button variant="contained" onClick={createNewIndex}>
                Create New Index
              </Button>
            </div>
          </div>
        </div>
        <div>
          <TabsContainer
            tabLabels={CLTabHeaders}
            tabsAriaLabel="Create and Upload Tabs"
            activeTabIndex={activeTabIndex}
            handleChange={handleTabChange}
          />
          <Table rows={tableRows} headers={CLHeaders} isPaginated pageNo={tablePageNo} handlePageChange={(_, newPage) => setTablePageNo(newPage)} />
        </div>
      </div>
      {isContentIndexLoading && (
        <div className="project-action-loader start-50 top-50 d-flex position-fixed align-items-center justify-content-center mt-6">
          <CircularProgress sx={{ margin: "auto" }} />
        </div>
      )}
      {isContentLibraryFailed && <ToastMessage severity={TOAST_TYPE.ERROR} isVisible message="Failed to load Content Library indexes" />}
      {apiChangeStatus === "success" && <ToastMessage severity={TOAST_TYPE.SUCCESS} isVisible message="Content Index Deleted" />}
    </div>
  );
};
export default ContenLibraryPage;
