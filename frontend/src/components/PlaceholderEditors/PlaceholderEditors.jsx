/* eslint-disable eqeqeq */
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useState, useRef, useEffect } from "react";

import "./PlaceholderEditor.scss";
import { PlaceholderEditorsText } from "../../i18n/PlaceHolderEditorsText";

const PlaceholderEditors = ({
  placeholderId,
  editedContent,
  setEditedContent,
  documentSectionRef,
  content,
  setIsAssitantDisabled,
  setSelectedPlaceHolderId
}) => {
  const [show, setShow] = useState(false);
  const textAreaRef = useRef(null);
  const placeholderRef = useRef(null);

  const getPlaceholderValueToDisplay = () => editedContent.find((item) => item.id == placeholderId)?.content || "";

  const handleOnChange = (textMessage) => {
    setEditedContent((prev) => {
      if (!prev.length) {
        return [{ id: placeholderId, content: textMessage }];
      }
      const placeHolder = prev.find((item) => item.id == placeholderId);
      if (!placeHolder) {
        return [...prev, { id: placeholderId, content: textMessage }];
      }
      const newEditedContent = prev.map((item) => {
        if (item.id == placeholderId) {
          return { ...item, content: textMessage };
        }
        return item;
      });
      return newEditedContent;
    });
  };

  useEffect(() => {
    const placeHolderElement = document.getElementById(`${placeholderId}`);
    const dataTestIdValue = placeHolderElement?.getAttribute("data-testid") ?? "";
    handleOnChange(dataTestIdValue || "");
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (textAreaRef.current && documentSectionRef.current.contains(event.target) && !textAreaRef.current.contains(event.target)) {
        setShow(false);
        setIsAssitantDisabled(true);
      }
      if (placeholderRef.current.contains(event.target)) {
        setIsAssitantDisabled(false);
      }
    }
    // Attach the click event listener when the text area is shown otherwise remove it
    if (show) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [show]);

  const handleClick = () => {
    setSelectedPlaceHolderId(placeholderId);
    setShow(!show);
    setIsAssitantDisabled(false);
    // show form assistant or not
  };

  return (
    <div className="d-flex flex-column placeholder-editor" ref={textAreaRef}>
      <div className="d-flex flex-row placeholder-editor-content justify-content-start align-items-center">
        {content}
        <IconButton onClick={handleClick} className="placeholder-editor-btn" ref={placeholderRef}>
          <EditOutlinedIcon />
        </IconButton>
      </div>
      {show && (
        <TextField
          placeholder={PlaceholderEditorsText.placeHolderText}
          multiline
          minRows={2}
          sx={{ marginBottom: "1rem" }}
          value={getPlaceholderValueToDisplay()}
          onChange={(e) => handleOnChange(e.target.value)}
        />
      )}
      {!show && editedContent && <div id={`placeholder-${placeholderId}`}>{getPlaceholderValueToDisplay()}</div>}
    </div>
  );
};

export default PlaceholderEditors;
