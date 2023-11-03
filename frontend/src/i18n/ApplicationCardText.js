export const ManageTemplatesCardText = {
  title: "Manage Templates",
  description: "This contains all your created and uploaded templates and you can manage your existing templates or add new ones.",
  folderTitle: "Total",
  btnText: "View",
  isBtnDisabled: false
};

export const AuthorDocumentCardText = {
  title: "Author Documents",
  description: "This contains all your created documents. You can create new or modify old ones.",
  folderTitle: "Total",
  detailsList: [],
  btnText: "View",
  isBtnDisabled: false
};

export const ManagePromptLibraryCardText = {
  title: "Manage Prompt Library",
  description: "All your approvals can be managed through here. You can also create new prompts here.",
  folder: {
    type: "circular",
    value: 60
  },
  detailsList: [
    {
      title: "Pending Approvals: ",
      value: 6
    }
  ],
  // if we are expecting more btns we can put btn related attributes in a array
  btnText: "Admin dashboard",
  isBtnDisabled: false,
  className: "mt-3",
  navPath: "content",
  btnTwoText: "Engineer dashboard",
  isBtnTwoDisabled: false,
  navPathTwo: "admin"
};
export const ManageContentLibraryCardText = {
  title: "Content Library Manager",
  folderTitle: "Total",
  description: "Knowledge banks containing historical documents used as reference can be created here",
  btnText: "View",
  isBtnDisabled: false
};
