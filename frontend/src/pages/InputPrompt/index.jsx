import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import "./InputPrompt.scss";

import ChatMessagesExample from "../../components/examples/ChatMessagesExample";
import PromptSuggestion from "../../components/PromptSuggestions/PromptSuggestion";

function InputPrompt({ title }) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button disableElevation variant="contained" onClick={() => setOpen(true)}>
        {title}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title" className="InputPrompt">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 1rem" }}>
          {title && <DialogTitle>{title}</DialogTitle>}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <div className="dialog-content-container">
            <div className="chat-messages-container">
              <ChatMessagesExample />
            </div>
            <PromptSuggestion />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InputPrompt;
