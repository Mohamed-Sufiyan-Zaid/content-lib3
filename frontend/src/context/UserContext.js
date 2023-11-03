import { createContext } from "react";

const UserContext = createContext({ ntId: "", firstName: "", lastName: "", userGroup: "USR_ADMIN" });

export default UserContext;
