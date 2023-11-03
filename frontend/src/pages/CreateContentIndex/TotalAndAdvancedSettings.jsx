function TotalAndAdvancedSettings({ total }) {
  return (
    <div>
      <div className="d-flex justify-content-end align-items-center pr-3 pl-3" style={{ padding: "3px" }}>
        <span>
          Total Data Sources Selected: <b>{total}</b>&nbsp;&nbsp;
        </span>
      </div>
    </div>
  );
}

export default TotalAndAdvancedSettings;
