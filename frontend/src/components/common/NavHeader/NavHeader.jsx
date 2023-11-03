import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import "./NavHeader.scss";

const NavHeader = ({ breadcrumbData, separator = ">" }) => (
  <Stack spacing={2}>
    <Breadcrumbs separator={separator} aria-label="breadcrumb">
      {breadcrumbData?.map(({ label, path }, index) => (
        <div key={index} className="nav-path">
          {path && index !== breadcrumbData.length - 1 ? (
            <Link to={path}>{label}</Link>
          ) : (
            <Typography key="3" color="text.primary">
              {label}
            </Typography>
          )}
        </div>
      ))}
    </Breadcrumbs>
  </Stack>
);
export default NavHeader;
