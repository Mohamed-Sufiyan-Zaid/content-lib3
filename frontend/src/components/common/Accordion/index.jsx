import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionMaterial from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

const Accordion = ({ summary, details, onClick }) => (
  <AccordionMaterial>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
      <Typography variant="base">{summary}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography onClick={onClick} style={{ cursor: "pointer" }} variant="base">
        {details}
      </Typography>
    </AccordionDetails>
  </AccordionMaterial>
);

export default Accordion;
