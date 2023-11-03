import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import { useState, useEffect, useContext, useRef } from "react";
import "./ProjectTemplates.scss";
import { useNavigate, useParams } from "react-router-dom";

import { Plus } from "../../assets";
import { Upload } from "../../assets/images";
import KebabMenu from "../../components/common/KebabMenu/KebabMenu";
import ProjectDetailsHeader from "../../components/common/ProjectDetailsHeader/ProjectDetailsHeader";
import Table from "../../components/common/Table/Table";
import TabsContainer from "../../components/common/TabsContainer/TabsContainer";
// eslint-disable-next-line import/extensions
import UserContext from "../../context/UserContext";
import { useFetcher } from "../../hooks/useReactQuery";
import { returnBreadCrumb } from "../../utils/breadCrumbMapper";
import {
  CreatedTemplateTableHeaders,
  UploadedTemplateTableHeaders,
  TemplateTabHeaders,
  TemplateType,
  CreatedTemplateKebabMenuOptions,
  UploadedTemplateKebabMenuOptions,
  ApiEndpoints,
  QueryKeys,
  TemplateState
} from "../../utils/constants";
import { filterByTemplateType } from "../../utils/ProjectTemplates";
import CreateEditViewDeleteTemplate from "../CreateEditViewDeleteTemplate/CreateEditViewDeleteTemplate";
import UploadTemplate from "../UploadTemplate/UploadTemplate";

export default function ProjectTemplates() {
  const [tablePageNo, setTablePageNo] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [openModal, setOpenModal] = useState(""); // to open view/edit/delete modals
  const [tableRows, setTableRows] = useState({
    created: [],
    uploaded: []
  });
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const selectedTemplateRef = useRef({});
  const { ntId } = useContext(UserContext);

  const buttons = [
    {
      text: "Create Template",
      onClick: () => setOpenModal("create"),
      icon: Plus,
      state: "create"
    },
    {
      text: "Upload Template",
      onClick: () => setOpenModal("upload"),
      icon: Upload,
      state: "upload"
    }
  ];

  // TODO: Check with BE team whether it should be templates/projectId/ntid as per word doc or all-templates?project_id=1&ntid=ns9000 as per swagger
  const {
    data: rawTemplatesList,
    isFetching,
    isLoading,
    isError,
    isSuccess
  } = useFetcher({
    url: `${ApiEndpoints.getTemplates}/${projectId}/${ntId}`,
    queryKey: [QueryKeys.templates],
    enableQuery: true
  });

  const handleMenuItemClick = (optionIndex, templateData) => {
    const kebabMenuOptions = activeTabIndex === 0 ? CreatedTemplateKebabMenuOptions : UploadedTemplateKebabMenuOptions;
    selectedTemplateRef.current = templateData;
    setOpenModal(kebabMenuOptions[optionIndex].key);
  };

  const generateTableContent = (templateType, templateData) => {
    const newTableData = [...(templateType === TemplateType.CREATED ? tableRows.created : tableRows.uploaded)];
    // the first array will define the table Rows and the next array inside newTableData (newTableData[index+1]) defines tabular data
    templateData.forEach((template, index) => {
      newTableData[index + 1] = [
        template.template_name,
        template.created_by || "dummy",
        moment(template.created_date || template.updated_date).format("MMM DD, YYYY"),
        <div key={index} className="d-flex">
          <Button variant="text" sx={{ textDecoration: "underline" }} onClick={() => navigate(`/project/${projectId}/document/1`)}>
            Use
          </Button>
          <KebabMenu
            handleMenuItemClick={(optionIndex) => handleMenuItemClick(optionIndex, template)}
            menuOptions={templateType === TemplateType.CREATED ? CreatedTemplateKebabMenuOptions : UploadedTemplateKebabMenuOptions}
            closeOnSelect
          />
        </div>
      ];
    });

    return newTableData;
  };

  const handleTabChange = (_event, newValue) => {
    setActiveTabIndex(newValue);
  };

  useEffect(() => {
    if (rawTemplatesList) {
      const { createdTableRows, uploadedTableRows } = filterByTemplateType(rawTemplatesList.data);
      setTableRows({
        ...tableRows,
        created: [[...generateTableContent(TemplateType.CREATED, createdTableRows)]],
        uploaded: [[...generateTableContent(TemplateType.UPLOADED, uploadedTableRows)]]
      });
    }
  }, [rawTemplatesList]);

  // TODO: Integrate the API of all-templates/project-id/nt-id
  // TODO: Make sure this API is called only if the API data from ProjectDetailsPage is not cached

  const getTemplateComponent = () => {
    const viewTemplateModal = ["create", "edit", "view"];
    if (viewTemplateModal.includes(openModal)) {
      const templateStateMapping = {
        create: TemplateState.CREATED,
        edit: TemplateState.EDITED,
        view: TemplateState.READONLY
      };

      const templateState = templateStateMapping[openModal];

      return (
        <CreateEditViewDeleteTemplate
          templateData={selectedTemplateRef.current}
          open
          setOpen={setOpenModal}
          templateState={templateState}
          templateName={openModal === "create" ? "" : "Test"}
        />
      );
    }
    return <div />;
  };

  return (
    <div className="home-container project-templates">
      <div className="d-flex content-header">
        <ProjectDetailsHeader navProps={returnBreadCrumb("manageTemplates", projectId)} buttons={buttons} setOpen={setOpenModal} />
      </div>

      <h1 className="heading">Templates</h1>
      <TabsContainer
        tabLabels={TemplateTabHeaders}
        tabsAriaLabel="Create and Upload Tabs"
        activeTabIndex={activeTabIndex}
        handleChange={handleTabChange}
      />
      {isSuccess && (
        <Table
          rows={activeTabIndex === 0 ? tableRows.created : tableRows.uploaded}
          headers={activeTabIndex === 0 ? CreatedTemplateTableHeaders : UploadedTemplateTableHeaders}
          isPaginated
          pageNo={tablePageNo}
          handlePageChange={(_, newPage) => setTablePageNo(newPage)}
        />
      )}
      {(isFetching || isLoading) && (
        <div className="d-flex align-items-center justify-content-center mt-6">
          <CircularProgress sx={{ margin: "auto" }} />
        </div>
      )}
      {isError && (
        <div className="d-flex align-items-center justify-content-center table-error">
          <div>Something went wrong fetching list of templates!</div>
        </div>
      )}
      {getTemplateComponent()}
      <UploadTemplate open={openModal === "upload"} setOpen={setOpenModal} />
    </div>
  );
}
