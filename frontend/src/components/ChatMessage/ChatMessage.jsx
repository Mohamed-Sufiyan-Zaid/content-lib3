/* eslint-disable eqeqeq */
import "./ChatMessage.scss";
import Button from "@mui/material/Button";
import { useState } from "react";

import pfizerAvatar from "../../assets/images/pfizer-chat.svg";
import userAvatar from "../../assets/images/user-avatar.svg";
import { chatMessageText } from "../../i18n/Components";
import CitationsModal from "../CitationsModal/CitationsModal";

function ChatMessage({ textMessage, botMessage, setEditedContent, selectedPlaceHolderId, citationsContent, isReply = false }) {
  const [openModal, setOpenModal] = useState(false);
  const handleOnClick = () => {
    setEditedContent((prev) => {
      if (!prev.length) {
        return [{ id: selectedPlaceHolderId, content: botMessage }];
      }
      const placeHolder = prev.find((item) => item.id == selectedPlaceHolderId);
      if (!placeHolder) {
        return [...prev, { id: selectedPlaceHolderId, content: botMessage }];
      }
      const newEditedContent = prev.map((item) => {
        if (item.id == selectedPlaceHolderId) {
          return { ...item, content: botMessage };
        }
        return item;
      });
      return newEditedContent;
    });
  };
  return (
    <div className="message">
      {textMessage && (
        <>
          <div className="default-message">
            <div className="message-tile">
              <img src={userAvatar} alt="user-avatar" />
              <div className="text-message">
                <p>{textMessage}</p>
              </div>
            </div>
          </div>
          {isReply && (
            <div className="reply-message">
              <div className="message-tile">
                <img src={pfizerAvatar} alt="user-avatar" />
                <div className="text-message">
                  <p>{botMessage}</p>
                </div>
              </div>
              <div className="reply-panel d-flex mb-2">
                <div className="d-flex flex-column align-items-start citations-container">
                  <p role="presentation" className="citations" onClick={() => setOpenModal(true)}>
                    {chatMessageText.citations}
                  </p>
                </div>
                <Button variant="outlined" sx={{ fontSize: "14px" }} onClick={handleOnClick}>
                  {chatMessageText.replaceTextBtn}
                </Button>
              </div>
            </div>
          )}
          <CitationsModal replydata={botMessage} citationsContent={citationsContent} openModal={openModal} setOpenModal={setOpenModal} />
        </>
      )}
    </div>
  );
}

export default ChatMessage;
