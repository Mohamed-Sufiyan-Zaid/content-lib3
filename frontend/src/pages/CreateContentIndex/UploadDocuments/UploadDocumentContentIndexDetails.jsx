import { Typography, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { useState } from "react";
import "./UploadDocuments.scss";

import { UsersData } from "../../../jsonData/contentLibData";
import UserTagCard from "../UserTag/UserTagCard";

function UploadDocumentContentIndexDetails() {
  const [formData, setFormData] = useState({
    nameOfIndex: "",
    relatedTags: "",
    description: "",
    indexType: "shared",
    memberName: ""
  });

  const handleTextFieldChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      indexType: value
    });
  };

  const handleSearch = () => {};

  const handleTagClose = () => {
    // Implement logic to remove the user with userId from the list of displayed users
  };

  return (
    <div className="gdms-content-index-details-custom">
      <div className="left-side-custom">
        <Typography variant="subtitle1" style={{ fontSize: "16px", fontWeight: "bold" }}>
          Basic Details
        </Typography>
        <div className="input-group-custom">
          <label htmlFor="nameOfIndex">Name of the index</label>
          <input
            type="text"
            id="nameOfIndex"
            name="nameOfIndex"
            placeholder="Select a model"
            value={formData.nameOfIndex}
            onChange={handleTextFieldChange}
            style={{ width: "100%" }}
          />
        </div>
        <div className="input-group-custom" style={{ paddingTop: "10px" }}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter a description"
            value={formData.description}
            onChange={handleTextFieldChange}
            rows={6}
          />
        </div>
        <div className="input-group-custom" style={{ paddingTop: "10px" }}>
          <label htmlFor="relatedTags">Related tags</label>
          <input
            type="text"
            id="relatedTags"
            name="relatedTags"
            placeholder="Add tags"
            value={formData.relatedTags}
            onChange={handleTextFieldChange}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      {/* <div className="column-divider"></div> */}
      <div className="right-side-custom">
        <Typography variant="subtitle1" style={{ fontSize: "16px", fontWeight: "bold" }}>
          Index Type
        </Typography>
        <RadioGroup
          aria-label="indexType"
          name="indexType"
          value={formData.indexType}
          onChange={handleRadioChange}
          className="radio-group-custom"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <FormControlLabel value="private" control={<Radio className="radio-button-custom" />} label="Private" />
          <FormControlLabel value="shared" control={<Radio className="radio-button-custom" />} label="Shared" />
        </RadioGroup>
        <div className="input-group-custom" style={{ paddingTop: "10px" }}>
          <input
            type="text"
            id="memberName"
            name="memberName"
            placeholder="Enter a team or member's name"
            value={formData.memberName}
            onChange={handleSearch}
            style={{ width: "90%" }}
          />
        </div>

        <div>
          {UsersData.map((user) => (
            <UserTagCard key={user.id} user={user} onClose={handleTagClose} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UploadDocumentContentIndexDetails;
