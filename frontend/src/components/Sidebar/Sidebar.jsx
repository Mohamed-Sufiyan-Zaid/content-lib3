import "./Sidebar.scss";

export default function Sidebar({ title = "Document Authoring", user = { firstName: "", lastName: "" } }) {
  return (
    <div className="sidebar-container col-md-2">
      <h2 className="heading text-center mt-3">{title}</h2>
      <div className="user-profile-container">
        <div className="user-thumbnail d-flex align-items-center">
          <span className="d-flex align-items-center justify-content-center">
            {user.firstName ? user.firstName.slice(0, 1) : ""}
            {user.lastName ? user.lastName.slice(0, 1) : ""}
          </span>
          <span className="user-name">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>
    </div>
  );
}
