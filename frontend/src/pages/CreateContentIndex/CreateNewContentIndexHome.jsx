import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";

import { ContentIndexDetails } from "./tabs/ContentIndexDetails";
import SelectDataSource from "./tabs/SelectDataSource";

import NavHeader from "../../components/common/NavHeader/NavHeader";
import ToastMessage from "../../components/common/ToastMessage/ToastMessage";
import SidebarContext from "../../context/SidebarContext";
import { TOAST_TYPE } from "../../models/components/enums";
import { returnBreadCrumb } from "../../utils/breadCrumbMapper";
import "./CreateNewContentIndex.scss";

export default function CreateNewContentIndexHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [contentIndexId, setContentIndexId] = useState(0);
  const [completed] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const contentIndexDetailsRef = useRef();
  const [contentIndexCreationStatus, setContentIndexCreationStatus] = useState("");
  const [contentIndexMessage, setContentIndexMessage] = useState("");
  const { setSidebarTitle } = useContext(SidebarContext);
  const steps = ["Content index details", "Select Data Sources"];

  const handleNext = () => {
    if (activeStep !== steps.length - 1) {
      contentIndexDetailsRef.current.submitIndexData();
    }
  };

  useEffect(() => {
    if (contentIndexCreationStatus === "success") {
      setActiveStep(activeStep + 1);
    }
  }, [contentIndexCreationStatus]);

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  useEffect(() => {
    setSidebarTitle("Content Library");
    return () => {
      setSidebarTitle("Document Authoring");
    };
  }, []);

  return (
    <div className="create-content-container">
      <NavHeader breadcrumbData={returnBreadCrumb("createContentIndex", location.state?.id)} />
      <div className="header-style">
        <h4 className="h4">Create New Content Index</h4>
        <div className="header-link">
          {/* <Button variant="text" endIcon={<HelpOutlinedIcon />}>
            How to create an index
          </Button> */}
        </div>
      </div>
      <hr />
      <Box sx={{ width: "50%" }}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit">{label}</StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>
      {activeStep === 0 ? (
        <ContentIndexDetails
          setContentIndexCreationStatus={setContentIndexCreationStatus}
          setContentIndexMessage={setContentIndexMessage}
          setOpenToast={setOpenToast}
          onContentIndexSuccess={setContentIndexId}
          onIsFormValidChange={setIsFormValid}
          ref={contentIndexDetailsRef}
        />
      ) : (
        <SelectDataSource
          contentIndexId={contentIndexId}
          setContentIndexCreationStatus={setContentIndexCreationStatus}
          setOpenToast={setOpenToast}
          setContentIndexMessage={setContentIndexMessage}
        />
      )}
      <Box className="fixed-ctas" sx={{ display: "flex", justifyContent: "space-between", flexDirection: "row", pt: 2 }}>
        <div>
          {/* {activeStep > 0 && (
            <Button onClick={handleBack} variant="outlined" sx={{ mr: 1 }}>
              Previous
            </Button>
          )} */}
          <Button className="cancel" variant="text" onClick={() => navigate(`/project/${location.state.id}/content`)} sx={{ mr: 1 }}>
            Cancel
          </Button>
        </div>
        <div className="action-buttons">
          {activeStep === 0 ? (
            <Button onClick={handleNext} variant="contained" sx={{ mr: 1 }} disabled={!isFormValid}>
              Create Index
            </Button>
          ) : (
            <Button onClick={() => navigate(`/project/${location.state.id}/content`)} variant="contained" sx={{ mr: 1 }}>
              Finish
            </Button>
          )}
        </div>
      </Box>
      {contentIndexCreationStatus === "error" && (
        <ToastMessage isVisible={openToast} hideToast={setOpenToast} severity={TOAST_TYPE.ERROR} message={contentIndexMessage} />
      )}
      {contentIndexCreationStatus === "success" && (
        <ToastMessage isVisible={openToast} hideToast={setOpenToast} severity={TOAST_TYPE.SUCCESS} message={contentIndexMessage} />
      )}
    </div>
  );
}
