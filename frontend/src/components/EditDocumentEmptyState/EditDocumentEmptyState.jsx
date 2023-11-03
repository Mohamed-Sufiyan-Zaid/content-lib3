import emptyFlag from "../../assets/images/flag.svg";
import "./EditDocumentEmptyState.scss";
import { EditDocumentEmptyStateText } from "../../i18n/EditDocumentEmptyStateText";

const EditDocumentEmptyState = ({ header, subHeader }) => (
  <div className="d-flex justify-content-center align-items-center flex-column edit-doc-empty">
    <img src={emptyFlag} alt={EditDocumentEmptyStateText.altText} />
    <p className="empty-doc-header">{header}</p>
    <p className="empty-doc-subheader">{subHeader}</p>
  </div>
);

export default EditDocumentEmptyState;
