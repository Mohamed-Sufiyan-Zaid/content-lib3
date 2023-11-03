import HumanIcon from "../assets/icons/humanIcon.png";
import Plus from "../assets/icons/plus.svg";

export { Plus, HumanIcon };

export default function GetSvgIcon({ icon, altText = "" }) {
  return <img src={icon} alt={altText} />;
}
