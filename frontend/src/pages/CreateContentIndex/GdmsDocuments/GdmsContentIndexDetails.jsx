import { useState } from "react";

import "./GdmsDocuments.scss";
import { GdmsContentText } from "../../../i18n/GdmsContentIndexDetailsText";

function GdmsContentIndexDetails({ onFieldChange }) {
  const [formData, setFormData] = useState({
    nameOfIndex: "",
    relatedTags: "",
    description: ""
  });

  const handleTextFieldChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
    onFieldChange(updatedFormData);
  };

  return (
    <div className="gdms-content-index-details">
      <div className="left-side">
        <div className="input-group">
          <label htmlFor="nameOfIndex">{GdmsContentText.indexLabel}</label>
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
        <div className="input-group" style={{ paddingTop: "10px" }}>
          <label htmlFor="relatedTags">{GdmsContentText.tagsLabel}</label>
          <textarea
            id="relatedTags"
            name="relatedTags"
            placeholder="Add tags"
            value={formData.relatedTags}
            onChange={handleTextFieldChange}
            // rows={4}
            style={{ height: "6.2em" }}
          />
        </div>
      </div>
      <div className="right-side">
        <div className="input-group">
          <label htmlFor="description">{GdmsContentText.descriptionLabel}</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter a description"
            value={formData.description}
            onChange={handleTextFieldChange}
            rows={7}
          />
        </div>
      </div>
    </div>
  );
}

export default GdmsContentIndexDetails;
