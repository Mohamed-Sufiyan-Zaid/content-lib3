import Button from "@mui/material/Button";

import { commonText } from "../../../i18n/Common";
import GetSvgIcon from "../../../utils/GetSvgIcon";
import NavHeader from "../NavHeader/NavHeader";

import "./ProjectDetailsHeader.scss";

const ProjectDetailsHeader = ({ projectName, createdDate, createdBy, navProps, buttons = [], setOpen = () => {} }) => {
  const handleBtnClick = (state) => {
    setOpen(state);
  };
  return (
    <div className="project-details-header">
      <NavHeader breadcrumbData={navProps} />
      <div className="content-header d-flex mt-3 mb-3">
        <h1 className="doc-heading mb-0 mt-0">{projectName}</h1>
        <div className="d-flex">
          {buttons.map((button, key) => (
            <Button
              key={key}
              variant="contained"
              color="primary"
              onClick={() => {
                handleBtnClick(button.state);
              }}
              startIcon={<GetSvgIcon icon={button.icon} />}
            >
              {button.text}
            </Button>
          ))}
        </div>
      </div>
      <p className="doc-created">
        {commonText.createdOn} <span>{createdDate}</span> {commonText.by} <span>{createdBy}</span>
      </p>
    </div>
  );
};
export default ProjectDetailsHeader;

// TODO: Remove these defaultProps and pass all the props via useNavigate
// const navigate = useNavigate();
// navigate('project/id/documents', { state: { projectName: name, createdDate: 'August 23, 2023', createdBy: "John Doe" } });

// const {state} = useLocation();
// const { projectName, createdDate,  createdBy} = state; // Read values passed on state

ProjectDetailsHeader.defaultProps = {
  projectName: "Project Drug Trial",
  createdDate: "August 23, 2023",
  createdBy: "John Doe"
};
