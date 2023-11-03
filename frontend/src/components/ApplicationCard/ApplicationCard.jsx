import { Card, CardContent, Divider, Button } from "@mui/material";
import "./ApplicationCard.scss"; // Import your SCSS file

const ApplicationCard = ({
  title,
  description,
  folderChildren,
  detailedChildren,
  btnText,
  isBtnDisabled,
  className,
  handleBtnClick,
  btnTwoText,
  isBtnTwoDisabled,
  handleBtnClickForBtnTwo
}) => (
  // TODO: css needs to be fixed, it got misaligned after some global css change
  <Card
    className={`app-card ${className}`}
    sx={{
      "backgroundColor": "#fff",
      "height": "22.5rem",
      "maxWidth": "26.5rem",
      "borderRadius": "0.375rem",
      "boxShadow": "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      "border": "1px solid #C9C9C9",
      "&.MuiCardContent-root": {
        "&.last-child": {
          padding: "0"
        }
      }
    }}
  >
    <CardContent className="d-flex flex-column justify-content-between align-items-center">
      <p className="app-card-title text-center">{title}</p>
      <p className={`mt-2 mb-2 text-center app-card-desc ${isBtnDisabled ? "disabled-app-card" : ""}`}>{description}</p>
      {!isBtnDisabled && (
        <div className="app-card-data d-flex flex-row justify-content-center align-items-center mb-2">
          {folderChildren && folderChildren}
          {detailedChildren && (
            <div className="d-flex flex-row ms-3">
              <Divider orientation="vertical" flexItem className="app-card-divider" />
              <div className="d-flex flex-column ms-2 justify-content-center align-items-center">{detailedChildren}</div>
            </div>
          )}
        </div>
      )}
      <div className="app-btns d-flex flex-column">
        <Button variant="contained" color="primary" onClick={handleBtnClick} disabled={isBtnDisabled} sx={{ borderRadius: "2rem" }}>
          {btnText}
        </Button>
        {btnTwoText && (
          <Button variant="contained" color="primary" onClick={handleBtnClickForBtnTwo} disabled={isBtnTwoDisabled} sx={{ borderRadius: "2rem" }}>
            {btnTwoText}
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default ApplicationCard;
