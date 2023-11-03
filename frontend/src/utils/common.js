export const getApiEndpointByProject = (project) => {
  switch (project) {
    case "docAuth":
      return import.meta.env.VITE_API_ENDPOINT_URL_DOC_AUTH;
    case "contentLib":
      return import.meta.env.VITE_API_ENDPOINT_URL_CONTENT_LIBRARY;
    case "promptLib":
      return import.meta.env.VITE_API_ENDPOINT_URL_PROMPT_LIBRARY;
    default:
      return "";
  }
};
export const hasSpacesCapsSpecialChars = (str) => {
  const pattern = /[A-Z\s!@#$%^&*()+={}[\]:;"'<>,.?\\|/]/;
  return pattern.test(str);
};
