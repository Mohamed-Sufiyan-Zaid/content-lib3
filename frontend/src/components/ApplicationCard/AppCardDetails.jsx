import "./AppCardDetails.scss";

const AppCardDetails = ({ detailsList }) => (
  <div className="d-flex flex-column app-card-details mt-3">
    {detailsList.map((details, index) => (
      <div key={index} className="d-flex flex-row">
        <p className="app-card-details-title">{details.title}</p>
        <p className="app-card-details-value ms-1">{details.value}</p>
      </div>
    ))}
  </div>
);

export default AppCardDetails;
