export const contentLibrary = [
  {
    label: "Home",
    path: "/"
  },
  {
    label: "Content Library"
  }
];

export const createContentIndex = [
  {
    label: "Home",
    path: "/"
  },
  {
    label: "Content Library",
    path: "/project/{ID}/content"
  },
  {
    label: "New Content Index"
  }
];

export const breadcrumbsData = {
  mainMenu: [
    {
      label: "Home",
      path: "/"
    },
    {
      label: "Menu",
      path: "/project/{ID}"
    }
  ],
  managePrompLibEngineer: [
    {
      label: "Home",
      path: "/"
    },
    {
      label: "Prompts(Engineer)",
      path: "/prompt/engineer"
    }
  ],
  managePrompLibAdmin: [
    {
      label: "Home",
      path: "/"
    },
    {
      label: "Prompts(Admin)",
      path: "/prompt/admin"
    }
  ],
  manageDocuments: [
    {
      label: "Home",
      path: "/"
    },
    {
      label: "Menu",
      path: "/project/{ID}"
    },
    {
      label: "Documents",
      path: "/project/{ID}/documents"
    },
    {
      label: "Edit"
    }
  ],
  documentList: [
    {
      label: "Home",
      path: "/"
    },
    {
      label: "Menu",
      path: "/project/{ID}"
    },
    {
      label: "Documents",
      path: "/project/{ID}/documents"
    }
  ],
  manageTemplates: [
    {
      label: "Home",
      path: "/"
    },
    {
      label: "Menu",
      path: "/project/{ID}"
    },
    {
      label: "Templates",
      path: "/project/{ID}/Templates"
    }
  ],
  createContentIndex: [
    {
      label: "Home",
      path: "/"
    },
    {
      label: "Content Library",
      path: "/project/{ID}/content"
    },
    {
      label: "New"
    }
  ]
};

export function returnBreadCrumb(data, pid) {
  const path = window.location.pathname;
  let level = (path.match(/\//g) || []).length;

  // this code is added as project ID is not part of the URL in these doc authoring page URLs
  if (["managePrompLibEngineer", "createContentIndex", "managePrompLibAdmin"].indexOf(data) > -1) {
    level += 1;
  }
  const curBreadCrumbData = breadcrumbsData[data].slice(0, level);
  const BREAD_CRUMBS = curBreadCrumbData.map((item, index) => ({
    ...item,
    path: index === level ? "" : item.path && item.path.replace("{ID}", pid)
  }));
  return BREAD_CRUMBS;
}
