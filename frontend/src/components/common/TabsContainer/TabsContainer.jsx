import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import "./TabsContainer.scss";

function a11yProps(index) {
  return {
    "aria-controls": `tabpanel-${index}`
  };
}

export default function TabsContainer({ tabLabels, tabsAriaLabel, activeTabIndex, tabsClass, handleChange, isSticky }) {
  return (
    <Tabs
      value={activeTabIndex}
      onChange={handleChange}
      aria-label={tabsAriaLabel}
      variant="scrollable"
      classes={{
        flexContainer: "tabsContainer"
      }}
      className={`w-100 ${isSticky ? "sticky-top sticky-tab" : tabsClass}`}
    >
      {tabLabels.map((tabLabel, index) => (
        <Tab
          classes={{
            root: "tabRoot",
            selected: "selected"
          }}
          key={tabLabel}
          label={tabLabel}
          {...a11yProps(index)}
        />
      ))}
    </Tabs>
  );
}
