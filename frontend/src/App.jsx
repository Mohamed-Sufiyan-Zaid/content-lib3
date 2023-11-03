import { Backdrop, CircularProgress } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useRef, useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// eslint-disable-next-line import/no-unresolved
import "~bootstrap/dist/css/bootstrap.min.css";
// eslint-disable-next-line import/no-unresolved
import "~bootstrap/dist/js/bootstrap.min";
import "./App.scss";
import Header from "./components/common/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatContext from "./context/ChatContext";
import SidebarContext from "./context/SidebarContext";
import UserContext from "./context/UserContext";
import { AppText } from "./i18n/AppText";
import { chatHistoryContextData } from "./jsonData";
import ContentLibrary from "./pages/ContentLibrary/ContentLibrary";
import CreateNewContentIndexHome from "./pages/CreateContentIndex/CreateNewContentIndexHome";
import EditDocument from "./pages/EditDocument/EditDocument";
import HomePage from "./pages/Home/Home";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import ProjectDocuments from "./pages/ProjectDocuments/ProjectDocuments";
import ProjectTemplates from "./pages/ProjectTemplates/ProjectTemplates";
import PromptAdminDashboard from "./pages/PromptAdminDashboard/PromptAdminDashboard";
import PromptEngineerDashboard from "./pages/PromptEngineerDashboard/PromptEngineerDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
});

const text = {
  heading: AppText.headingText,
  subHeading: AppText.subHeadingText
};

function App() {
  const rootRef = useRef(null);
  const [containerStart, setContainerStart] = useState(99);
  const [sidebarButtons, setSidebarButtons] = useState([]);
  const [sidebarTitle, setSidebarTitle] = useState("Document Authoring");
  const [userInfo, setUserInfo] = useState({ ntId: "", firstName: "", lastName: "" });
  const [pageLoader, setPageLoader] = useState(true);
  const [chatHistory, setChatHistory] = useState([...chatHistoryContextData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (rootRef.current) {
      setContainerStart(window.innerHeight - 16 - rootRef.current.getBoundingClientRect().top);
    }
  });

  const memoisedSidebarState = useMemo(() => ({ setSidebarTitle, sidebarButtons, setSidebarButtons }), [sidebarButtons, setSidebarButtons]);

  const memoisedChatData = useMemo(() => ({ chatHistory, setChatHistory }), [chatHistory, setChatHistory]);

  // The below function simulates user info fetching via an API
  const fetchUserDetails = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ntId: AppText.ntId, firstName: AppText.firstName, lastName: AppText.lastName });
      }, 1);
    });

  // The below function simulates user info fetching via an API
  useEffect(() => {
    const fetchUserInfo = async () => {
      setPageLoader(true);
      const userData = await fetchUserDetails();
      setUserInfo(userData);
      setPageLoader(false);
    };
    fetchUserInfo();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={userInfo}>
        <Router basename="/docauth">
          <Header heading={text.heading} subHeading={text.subHeading} />
          {pageLoader ? (
            <Backdrop open={pageLoader}>
              <CircularProgress />
            </Backdrop>
          ) : (
            <div ref={rootRef} className="root-container d-flex justify-content-center px-2">
              <div className="main-container position-relative d-flex mb-2 mt-2" style={{ height: `${containerStart}px` }}>
                <SidebarContext.Provider value={memoisedSidebarState}>
                  <Sidebar title={sidebarTitle} buttons={sidebarButtons} user={userInfo} />
                  <div className="content-container col-md-10 ml-auto">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/project/:projectId" element={<ProjectDetails />} />
                      <Route path="/project/:projectId/templates" element={<ProjectTemplates />} />
                      <Route path="/project/:projectId/documents" element={<ProjectDocuments />} />
                      <Route path="/prompt/engineer" element={<PromptEngineerDashboard />} />
                      <Route path="/prompt/admin" element={<PromptAdminDashboard />} />
                      <Route path="/project/:id/content" element={<ContentLibrary />} />
                      <Route path="/project/createContent" element={<CreateNewContentIndexHome />} />
                      <Route
                        path="/project/:projectId/document/:documentId"
                        element={
                          <ChatContext.Provider value={memoisedChatData}>
                            <EditDocument />
                          </ChatContext.Provider>
                        }
                      />
                    </Routes>
                  </div>
                </SidebarContext.Provider>
              </div>
            </div>
          )}
        </Router>
      </UserContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
