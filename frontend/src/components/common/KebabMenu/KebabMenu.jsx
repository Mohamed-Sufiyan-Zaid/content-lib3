import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useState } from "react";

import KebabMenuIcon from "../../../assets/images/kebab-menu.svg";
import "./KebabMenu.scss";
import GetSvgIcon from "../../../utils/GetSvgIcon";

export default function KebabMenu({ handleMenuItemClick, menuOptions = [], icon = KebabMenuIcon, closeOnSelect = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleSelect = (index) => {
    if (closeOnSelect) {
      setAnchorEl(null);
    }
    handleMenuItemClick(index);
  };
  return (
    <div className="d-flex flex-row kebab-menu">
      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
        <GetSvgIcon icon={icon} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "kebab-menu-btn"
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuList sx={{ padding: 0 }}>
          {menuOptions.map((option, index) => (
            <MenuItem key={option.key} value={option.key} onClick={() => handleSelect(index)}>
              <div className={`d-flex w-100 align-items-center single-menu-item ${index === menuOptions.length - 1 ? "last" : ""}`}>
                {option?.icon && <img src={option.icon} alt={option.label} />}
                <p className="option-label">{option.label}</p>
              </div>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
}
