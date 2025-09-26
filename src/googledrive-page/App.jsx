import {
  useState,
  useEffect,
} from "@wordpress/element";
import { Button, TextControl, Spinner, Notice } from "@wordpress/components";

import "./scss/style.scss";
import CredentialsForm from "./components/CredentialsForm";
import AuthForm from "./components/AuthForm";
import FileUpload from "./components/FileUpload";
import CreateFolder from "./components/CreateFolder";
import useDriveService from "./hooks/useDriveService";
import NoticeMessage from "./components/NoticeMessage";
import FilesList from "./components/FilesList";

const WPMUDEV_DriveTest = () => {
  const {
    saveCredentials,
    authenticate,
    getFiles,
    uploadFile,
    downloadFile,
    createFolder,
  } = useDriveService();
  const [isAuthenticated, setIsAuthenticated] = useState(
    window.wpmudevDriveTest.authStatus || false
  );
  const [hasCredentials, setHasCredentials] = useState(
    window.wpmudevDriveTest.hasCredentials || false
  );

  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const [folderName, setFolderName] = useState("");
  const [notice, setNotice] = useState({ message: "", type: "" });
  const [credentials, setCredentials] = useState({
    clientId: "",
    clientSecret: "",
  });

  useEffect(() => {}, [isAuthenticated]);

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
    setTimeout(() => setNotice({ message: "", type: "" }), 5000);
  };

  const handleSaveCredentials = async () => {};

  const handleAuth = async () => {
    try {
        const res = await authenticate();
        const {success, auth_url} = res;
        if (success) {
            window.location.href = auth_url;
        }
    } catch (error) {
        alert(error.message)
    }
  };

  const loadFiles = async () => {};

  const handleUpload = async () => {
    
  };

  const handleDownload = async (fileId, fileName) => {};

  const handleCreateFolder = async () => {};

  return (
    <>
      <div className="sui-header">
        <h1 className="sui-header-title">Google Drive Test</h1>
        <p className="sui-description">
          Test Google Drive API integration for applicant assessment
        </p>
      </div>

      <NoticeMessage />

      {!hasCredentials ? (
        <CredentialsForm />
      ) : !isAuthenticated ? (
        <AuthForm handleAuth={handleAuth} isLoading={isLoading} />
      ) : (
        <>
          {/* File Upload Section */}
          <FileUpload handleUpload={handleUpload} isLoading={isLoading}/>

          {/* Create Folder Section */}
          <CreateFolder handleCreateFolder={handleCreateFolder} isLoading={isLoading}/>

          {/* Files List Section */}
          <FilesList files={files} loadFiles={loadFiles} isLoading={isLoading}/>
        </>
      )}
    </>
  );
};

export default WPMUDEV_DriveTest;
