import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";

import { SelectText } from "../../../i18n/SelectText";
import "./Select.scss";

export default function Select({
  isOptionsArrayOfObjects = false,
  displayValueKey = "name",
  actualValueKey = "id",
  value = "",
  onChange = () => {},
  label = "",
  placeholder = label,
  options = [],
  margin = "",
  padding = "",
  isDisabled = false,
  isLoading = false,
  loadingText = SelectText.loadingText,
  isError = false,
  errorText = SelectText.errorText
}) {
  const customRenderValue = (val) => {
    if (val != null && val !== "") {
      if (!isOptionsArrayOfObjects) return val;
      const selectedOption = options.find((option) => (!isOptionsArrayOfObjects ? option : option[actualValueKey] === val));
      return selectedOption ? selectedOption[displayValueKey] : val;
    }
    return <div className="select-placeholder">{placeholder}</div>;
  };

  const mapArrayOfString = () =>
    options.map((item, index) => (
      <MenuItem key={index} value={item}>
        <div className={`custom-select-menu-item ${index === options.length - 1 ? "last" : ""}`}>{item}</div>
      </MenuItem>
    ));

  const mapArrayOfObjects = () =>
    options.map((item, index) => (
      <MenuItem key={item[actualValueKey]} value={item[actualValueKey]}>
        <div className={`custom-select-menu-item ${index === options.length - 1 ? "last" : ""}`}>{item[displayValueKey]}</div>
      </MenuItem>
    ));

  return (
    <FormControl className="mui-custom-select" sx={{ margin, padding }} fullWidth>
      {label && <FormLabel className="mb-2">{label}</FormLabel>}
      <MuiSelect
        MenuProps={{ maxWidth: "100%" }}
        disabled={isDisabled}
        value={value}
        displayEmpty
        onChange={onChange}
        label=""
        renderValue={customRenderValue}
      >
        {isLoading ? (
          <MenuItem disabled>
            <div className="custom-select-menu-item last">{loadingText}</div>
          </MenuItem>
        ) : isError ? (
          <MenuItem disabled>
            <div className="custom-select-menu-item last">{errorText}</div>
          </MenuItem>
        ) : !isOptionsArrayOfObjects ? (
          mapArrayOfString()
        ) : (
          mapArrayOfObjects()
        )}
      </MuiSelect>
    </FormControl>
  );
}
