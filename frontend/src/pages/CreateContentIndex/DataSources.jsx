import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { List, ListItemIcon, ListItemText, ListItemButton } from "@mui/material";
import { useState } from "react";

function DataSources() {
  const dataSources = [
    { name: "Upload Documents", icon: <UploadOutlinedIcon /> },
    { name: "GDMS Documents", icon: <SecurityOutlinedIcon />, disabled: true },
    { name: "Import From URL", icon: <LanguageOutlinedIcon />, disabled: true }
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <div>
      <div className="card-container">
        <div className="left-portion">
          <p className="data-source-label">Data Sources</p>
          <List>
            {dataSources.map(({ name, icon, disabled }, index) => (
              <ListItemButton
                key={index}
                disabled={disabled}
                selected={selectedIndex === index}
                onClick={() => handleListItemClick(index)}
                className="custom-list-item"
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
}

export default DataSources;
