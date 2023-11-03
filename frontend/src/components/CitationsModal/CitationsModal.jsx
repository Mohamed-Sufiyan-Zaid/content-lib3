import ConfirmationBox from "../common/ConfirmationBox/ConfirmationBox";
import "./CitationsModal.scss";

const CitationsModal = ({ replydata, citationsContent, openModal, setOpenModal }) => {
  const getContent = (data) => {
    let content = data.documentName;
    if (data?.page && data?.section) {
      content = `${data.documentName} | ${data.page} | ${data.section}`;
    }
    return content;
  };
  return (
    <ConfirmationBox
      title="Citations"
      agreeText="OK"
      isOpen={openModal}
      handleAccept={() => setOpenModal(false)}
      handleClose={() => setOpenModal(false)}
      isAgreeDisabled={false}
    >
      <div className="citations-modal-container">
        <p className="mt-2">
          <b>Recomended Generated Text</b>
        </p>
        <p className="mb-2 gen-data">{replydata}</p>
        {Array.isArray(citationsContent) && citationsContent.length > 0 && (
          <div className="citations">
            {citationsContent.map((citation, index) => (
              <div className="individual-citation" key={index}>
                {citation?.documentName && getContent(citation)}
              </div>
            ))}
          </div>
        )}
        {!Array.isArray(citationsContent) && citationsContent.length > 0 && <p>{citationsContent}</p>}
      </div>
    </ConfirmationBox>
  );
};
export default CitationsModal;
