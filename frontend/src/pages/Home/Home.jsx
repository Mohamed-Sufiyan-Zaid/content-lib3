import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.scss";
import Plus from "../../assets/icons/plus.svg";
import CountsCard from "../../components/common/CountsCard/CountsCard";
import KebabMenu from "../../components/common/KebabMenu/KebabMenu";
import Table from "../../components/common/Table/Table";
import ToastMessage from "../../components/common/ToastMessage/ToastMessage";
import CreateEditDeleteProject from "../../components/CreateEditProjectForm/CreateEditDeleteProject";
import { defaultProjectData } from "../../components/CreateEditProjectForm/pageConstants";
import SidebarContext from "../../context/SidebarContext";
import UserContext from "../../context/UserContext";
import { useFetcher } from "../../hooks/useReactQuery";
import { commonText } from "../../i18n/Common";
import { homeText } from "../../i18n/HomeText";
import { TOAST_TYPE } from "../../models/components/enums";
import { ApiResponseKeys } from "../../utils/apiKeysMap";
import { ProjectTableHeaders, ProjectListKebabMenuOptions, ApiEndpoints, QueryKeys, DashboardStatsCards } from "../../utils/constants";
import { getFullDateFormatted } from "../../utils/dateUtils";
import GetSvgIcon from "../../utils/GetSvgIcon";

export default function HomePage() {
  const [tableRows, setTableRows] = useState([]);
  const [tablePageNo, setTablePageNo] = useState(0);
  const [openModal, setOpenModal] = useState(false); // [create|edit|delete] to open
  const [selectedProject, setSelectedProject] = useState({ ...defaultProjectData });
  const [actionType, setActionType] = useState("");
  const [dashboardStats, setDashboardStats] = useState(DashboardStatsCards.map((keys) => ({ label: keys.label, value: "-" })));
  const { ntId } = useContext(UserContext);
  const { setSidebarButtons, setSidebarTitle } = useContext(SidebarContext);
  const [toastInfo, setToastInfo] = useState({
    message: "",
    severity: TOAST_TYPE.SUCCESS
  });
  const navigate = useNavigate();
  const [openToast, setOpenToast] = useState(false);

  useEffect(() => {
    setSidebarButtons([]);
    setSidebarTitle("Document Authoring");
    return () => {
      setSidebarButtons([]);
      setSidebarTitle("Document Authoring");
    };
  }, []);

  const showToast = ({ message, severity }) => {
    setToastInfo({
      message,
      severity
    });
    setOpenToast(true);
  };

  const buttons = [
    {
      text: "Create Project",
      onClick: () => {
        setSelectedProject({ ...defaultProjectData });
        setActionType("create");
        setOpenModal(true);
      },
      icon: Plus
    }
  ];

  const handleKebabMenuItemClick = (optionIndex, selectionFor = null, data = {}) => {
    setSelectedProject(data.filter((item) => item.projectId === selectionFor)[0]);
    setActionType(ProjectListKebabMenuOptions[optionIndex].key);
    setOpenModal(true);
  };

  const generateTableContent = (data = []) => {
    const newTableData = data.map((project, index) => [
      project.projectName,
      project.projectDomain,
      getFullDateFormatted(project.lastUpdatedDate),
      project.ntId,
      <div key={index} className="d-flex">
        <Button
          variant="text"
          sx={{ textDecoration: "underline" }}
          onClick={() => navigate(`/project/${project.projectId}`, { state: { projectName: project.projectName } })}
        >
          {commonText.viewDetails}
        </Button>
        <KebabMenu
          handleMenuItemClick={(optionIndex) => handleKebabMenuItemClick(optionIndex, project.projectId, data)}
          menuOptions={ProjectListKebabMenuOptions}
          closeOnSelect
        />
      </div>
    ]);
    setTableRows(newTableData);
  };

  const mapProjectsListRows = (data) =>
    data.map((project) => ({
      projectName: project[ApiResponseKeys.projectName],
      projectId: project[ApiResponseKeys.projectId],
      projectDomain: project[ApiResponseKeys.projectDomain],
      projectSubDomain: project[ApiResponseKeys.projectSubDomain],
      projectGroup: project[ApiResponseKeys.projectGroup],
      lastUpdatedDate: project[ApiResponseKeys.lastUpdatedDate],
      version: project[ApiResponseKeys.version],
      ntId: project[ApiResponseKeys.ntId]
    }));

  const {
    data: rawProjectsList = [],
    isSuccess,
    status: projectsListStatus = ""
  } = useFetcher({ url: ApiEndpoints.projectsList, queryKey: [QueryKeys.projectsList], params: { [ApiResponseKeys.ntId]: ntId }, enableQuery: true });

  const { data: dashboardStatsData = {}, isSuccess: fetchedDashboardStats } = useFetcher({
    url: ApiEndpoints.dashboardStats,
    queryKey: [QueryKeys.projectsList, QueryKeys.dashboardStats],
    enableQuery: true
  });

  useEffect(() => {
    if (isSuccess) {
      const updatedList = mapProjectsListRows(rawProjectsList);
      generateTableContent(updatedList);
    }
  }, [rawProjectsList, isSuccess]);

  useEffect(() => {
    if (fetchedDashboardStats) {
      const currentStats = DashboardStatsCards.map((stat) => ({
        label: stat.label,
        value: dashboardStatsData[ApiResponseKeys[stat.variableName]]
      }));
      setDashboardStats(currentStats);
    }
  }, [fetchedDashboardStats, dashboardStatsData]);

  return (
    <div className="home-container">
      <ToastMessage isVisible={openToast} hideToast={setOpenToast} message={toastInfo.message} severity={toastInfo.severity} />
      <div className="d-flex home-header mt-2 mb-2">
        <h1 className="heading mt-0 mb-0">{homeText.overview}</h1>
        <div className="d-flex">
          {buttons.map((button, key) => (
            <Button key={key} variant="contained" color="primary" onClick={button.onClick} startIcon={<GetSvgIcon icon={button.icon} />}>
              {button.text}
            </Button>
          ))}
        </div>
      </div>

      <div className="cards-container d-flex">
        {dashboardStats.map((stat, index) => (
          <CountsCard key={index} title={stat.label} count={`${stat.value < 10 ? `0${stat.value}` : stat.value}`} />
        ))}
      </div>
      <h1 className="heading mt-5 mb-3">{homeText.allProjects}</h1>
      {projectsListStatus === "success" ? (
        <Table
          rows={tableRows}
          headers={ProjectTableHeaders}
          isPaginated
          pageNo={tablePageNo}
          handlePageChange={(_, newPage) => setTablePageNo(newPage)}
        />
      ) : projectsListStatus === "loading" ? (
        <div className="d-flex align-items-center justify-content-center mt-6">
          <CircularProgress sx={{ margin: "auto" }} />
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-center table-error">
          <div>{homeText.projectWarningText}</div>
        </div>
      )}
      <CreateEditDeleteProject
        openModal={openModal}
        setOpenModal={setOpenModal}
        actionType={actionType}
        projectData={selectedProject}
        setToastInfo={showToast}
      />
    </div>
  );
}
