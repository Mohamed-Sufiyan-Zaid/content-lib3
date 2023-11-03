import DeleteIcon from "../assets/images/delete-icon.svg";
import deleteIcon from "../assets/images/delete.svg";
import EditIcon from "../assets/images/edit.svg";
import ViewIcon from "../assets/images/view-icon.svg";
import {
  ManageTemplatesCardText,
  AuthorDocumentCardText,
  ManagePromptLibraryCardText,
  ManageContentLibraryCardText
} from "../i18n/ApplicationCardText";

export const ApiEndpoints = Object.freeze({
  templates: "/templates",
  stats: "/document/stats",
  projectsList: "/project/mine",
  projectOperations: "/project",
  getDomains: "/domains",
  getSubDomains: "/sub-domains",
  dashboardStats: "/dashboard/count",
  getTemplates: "/template/all",
  templateDetails: "/template",
  templateNewOrUpdate: "/template",
  documentList: "/get-document-by-project-id",
  document: "/document",
  documentDetails: "get-document-by-id",
  updateDocument: "/update-document",
  chatHistory: "/chat-history",
  adminConfig: "/admin-config"
});

export const PromptLibraryApiEndpoints = Object.freeze({
  promptsListByGroupId: "/prompts",
  pendingPrompts: "/pending-prompts",
  createPrompt: "/prompt",
  promptConfigsList: "/admin-config",
  approveOrRejectPrompts: "/prompt/approve",
  groupsList: "/group-names",
  createConfig: "/admin-config",
  promptSuggestions: "/prompt/lookup"
});

export const ContentLibraryApiEndpoints = Object.freeze({
  enums: "/enums",
  contentIndex: "/content",
  defaultFilters: "/content/default_filters",
  contentByIndex: "/content_by_index",
  uploadDocument: "/document/upload",
  documentByContextId: "/document",
  documentChunkMetadata: "/content/document/",
  llm: "/result/conversation"
});

export const PromptQueryKeys = Object.freeze({
  promptsListByGroupId: "promptsListByGroupId",
  promptConfigsList: "promptConfigsList",
  pendingPrompts: "pendingPrompts",
  groupsList: "groupsList",
  promptSuggestions: "promptSuggestions",
  prompts: "prompts"
});

export const ContentQueryKeys = Object.freeze({
  contentLibraryIndex: "contentLibraryIndex",
  uploadDocuments: "uploadDocuments",
  contentByIndex: "contentByIndex",
  enumsModel: "enumModel",
  documentByContentId: "documentByContentId",
  documentContentChunkData: "documentContentChunkData",
  enumLength: "enumLength",
  defaultFilters: "defaultFilters",
  content: "content"
});

export const QueryKeys = Object.freeze({
  templates: "allTemplates",
  templateDetails: "templateDetails",
  createTemplate: "createTemplate",
  editTemplate: "editTemplate",
  deleteTemplate: "deleteTemplate",
  stats: "stats",
  projectsList: "projectsList",
  createProject: "createProject",
  editProject: "editProject",
  deleteProject: "deleteProject",
  getDomains: "getDomains",
  getSubDomains: "getSubDomains",
  dashboardStats: "dashboardStats",
  documentsList: "/document/all",
  documentDetails: "documentDetails",
  chatHistory: "chatHistory",
  projectDetails: "projectDetails"
});

export const HTTPMethods = Object.freeze({
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete"
});

export const ContentType = Object.freeze({
  MULTIPART_FORM_DATA: "multipart/form-data"
});

export const DashboardStatsCards = [
  { label: "Total Projects", variableName: "totalProjects" },
  { label: "Total Groups", variableName: "totalGroups" },
  { label: "Total Domains", variableName: "totalDomains" }
];

export const DefaultFilterSelection = {
  name: "All",
  id: -1
};

export const ProjectTableHeaders = ["Project Name", "Domain", "Last Updated Date", "Owner", ""];

export const DocumentTableHeaders = ["Document Name", "Created by", "Created on", "", ""];

export const CLHeaders = ["Index Name", "Status", "No. of Documents", "Date Last Modified", "Tags", ""];

export const CreatedTemplateTableHeaders = ["Template Name", "Created by", "Created on", "", ""];

export const UploadedTemplateTableHeaders = ["Template Name", "Uploaded by", "Uploaded on", "", ""];

export const TemplateType = {
  CREATED: "Created",
  UPLOADED: "Uploaded"
};

export const TemplateState = {
  EDITED: "edit",
  READONLY: "readonly",
  CREATED: "create",
  DELETE: "delete"
};

export const CLTabsType = {
  PRIVATE: "Private",
  SHARED: "Shared"
};

export const TemplateTabHeaders = [TemplateType.CREATED, TemplateType.UPLOADED];

export const CLTabHeaders = [CLTabsType.PRIVATE, CLTabsType.SHARED];

export const AssitantText = {
  ASSISTANT: "Assistant",
  ADVANCEDFILTERS: "Advanced Filters",
  AssistantAria: "Assistant and Advanced Filter Tabs"
};

export const AssistantTabHeaders = [AssitantText.ASSISTANT, AssitantText.ADVANCEDFILTERS];

export const PromptListHeader = {
  promptUsed: "Prompt Used",
  originalText: "Original Text",
  presentText: "Present Text"
};

export const DocumentTableKebabMenuOptions = [
  {
    key: "delete",
    label: "Delete",
    icon: deleteIcon
  }
];

export const ProjectListKebabMenuOptions = [
  {
    key: "edit",
    label: "Edit",
    icon: EditIcon
  },
  {
    key: "delete",
    label: "Delete",
    icon: DeleteIcon
  }
];

export const CreatedTemplateKebabMenuOptions = [
  {
    key: "view",
    label: "View",
    icon: ViewIcon
  },
  {
    key: "edit",
    label: "Edit",
    icon: EditIcon
  },
  {
    key: "delete",
    label: "Delete",
    icon: deleteIcon
  }
];

export const UploadedTemplateKebabMenuOptions = [
  {
    key: "edit",
    label: "Edit",
    icon: EditIcon
  },
  {
    key: "delete",
    label: "Delete",
    icon: deleteIcon
  }
];

export const ApplicationCards = [ManageTemplatesCardText, AuthorDocumentCardText, ManagePromptLibraryCardText, ManageContentLibraryCardText];

export const htmlString = `
<p>{Generated Text Placeholder - ID 1}</p>
<h2>Text dhuihc</h2>
<p>cdgbcjkdnkcnke</p>
<p>sxdcfgvhbnj</p>
<h2>dcfvghbjn</h2>
<p>{Generated Text Placeholder - ID 2}</p>
<h1>fgvhbj</h1>
<p>{Generated Text Placeholder - ID 3}</p>
<p>{Generated Text Placeholder - ID 4}</p>
<h1>fgvhbj</h1>
<p>{Generated Text Placeholder - ID 5}</p>
<p>{Generated Text Placeholder - ID 6}</p>
<h1>fgvhbj</h1>
<p>{Generated Text Placeholder - ID 7}</p>
<p>{Generated Text Placeholder - ID 8}</p>
<h1>fgvhbj</h1>
<p>{Generated Text Placeholder - ID 9}</p>
<p>{Generated Text Placeholder - ID 10}</p>
<p>dcdvfdvf</p>`;

export const DefaultPromptData = {
  id: null,
  ogText: "None",
  presentText: "None",
  prompt: "None"
};

export const PromptData = [
  {
    id: 1,
    ogText: "Test OG 3",
    presentText: "TEST PResent",
    prompt: "Test prompt"
  },
  {
    id: 2,
    ogText: "Test OG 4",
    presentText: "TEST PResent 2",
    prompt: "Test prompt 2"
  }
];
export const MyPromptsTableHeaders = ["Prompt Text", "Domain", "Prompt Type", "Status", ""];

export const placeHolderRegex = /{Generated Text Placeholder - ID ([0-9a-fA-F-]+)}/;
export const placeHolderRegexGlobal = /{Generated Text Placeholder - ID ([0-9a-fA-F-])+}/g;
export const emTagsRegex = /<em[^>]*>([^<]*)<\/em>/g;
export const htmlTagsRegexGlobal = /<html[^>]*><head><\/head><body>|<\/body><\/html>/g;
export const generatedPlaceholderConstant = "{Generated Text Placeholder}";

export const PromptEngineerPromptDetails = [
  { label: "Domain", variableName: "domain" },
  { label: "Sub-Domain", variableName: "subDomain" },
  { label: "Category", variableName: "category" },
  { label: "Annotation", variableName: "annotation" },
  { label: "Prompt Type", variableName: "promptType" },
  { label: "Use Case Type", variableName: "usecaseType" }
];

export const PromptAdminPromptDetails = [
  { label: "Request Type", variableName: "requestType" },
  { label: "Group", variableName: "groupName" },
  { label: "Domain", variableName: "domain" },
  { label: "Sub-Domain", variableName: "subDomain" },
  { label: "Category", variableName: "category" },
  { label: "Annotation", variableName: "annotation" },
  { label: "Prompt Type", variableName: "promptType" },
  { label: "Submitted By", variableName: "submittedBy" },
  { label: "Use Case Type", variableName: "usecaseType" }
];
