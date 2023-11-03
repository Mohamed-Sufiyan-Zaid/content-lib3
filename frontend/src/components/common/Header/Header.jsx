import { useNavigate } from "react-router-dom";

import { Logo } from "../../../assets";
import "./Header.scss";

const Header = ({ heading = "Document Authoring" }) => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <div className="header-contents d-flex align-items-center justify-content-start">
        <img role="presentation" alt="Pfizer logo" src={Logo} className="logo" onClick={() => navigate("/")} />
        <div className="divider px-3" />
        <div role="presentation" onClick={() => navigate("/")} className="header-title">
          <h2 className="px-3  main-heading">{heading}</h2>
        </div>
      </div>
    </div>
  );
};

export default Header;
