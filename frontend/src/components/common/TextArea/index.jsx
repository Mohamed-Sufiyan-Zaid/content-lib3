import sendIcon from "../../../assets/images/send.svg";
import { commonText } from "../../../i18n/Common";
import { TextAreaText } from "../../../i18n/TextAreaText";

const TextArea = ({ value, onChange, rows, handleOnClick, handleOnKeyPress }) => (
  <div style={{ display: "flex", alignItems: "center", position: "relative", width: "100%" }}>
    <textarea
      className="form-control"
      value={value}
      onChange={onChange}
      onKeyDown={handleOnKeyPress}
      rows={rows}
      style={{
        width: "100%",
        minHeight: "40px",
        border: "1px solid #e6e6e6",
        background: "#fff",
        paddingLeft: "1em",
        paddingRight: "48px",
        resize: "none",
        overflow: "hidden"
      }}
      placeholder={TextAreaText.placeHolderText}
    />
    <img
      src={sendIcon}
      role="presentation"
      onClick={handleOnClick}
      alt={commonText.send}
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        width: "15px"
      }}
    />
  </div>
);

export default TextArea;
