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
import { __ } from "@wordpress/i18n";

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
  const [showCredentials, setShowCredentials] = useState( !hasCredentials);

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

  const handleSaveCredentials = async (credentials) => {
    try {
      setIsLoading(true);
      const res = await saveCredentials(credentials);
      const { success, message } = res;
      if (success) {
        showNotice(message);
        handleAuth();
      } else {
        showNotice(message, "error");
      }
    } catch (error) {
      showNotice(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleUpload = async (file) => {
    setIsLoading(true);
    if (!file) {
      showNotice()
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      // call uploadFile (this uses your backend route: restEndpointUpload)
      const response = await uploadFile(formData);
        const {success, file} = response
      if (success) {
        showNotice(__('File uploaded successfully', 'wpmudev-plugin-test'));
      } else {
        showNotice(__('File upload failed'), "error");
      }
    } catch (error) {
      showNotice(__('File upload failed', 'wpmudev-plugin-test'), "error");
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {};

  const handleCreateFolder = async () => {};

  return (
    <>
      <div className="sui-header">
        <h1 className="sui-header-title">Google Drive Test</h1>
        <p className="sui-description">
          {__('Test Google Drive API integration for applicant assessment', 'wpmudev-plugin-test')}
        </p>
      </div>

      <NoticeMessage message={notice.message} type={notice.type} onRemove={() => {
        showNotice("", "success")
      }}/>

      {!hasCredentials || showCredentials? (
        <CredentialsForm isLoading={isLoading} onSave={handleSaveCredentials}/>
      ) : !isAuthenticated ? (
        <AuthForm handleAuth={handleAuth} isLoading={isLoading} setShowCredentials={setShowCredentials}/>
      ) : (
        <>
          {/* File Upload Section */}
          <FileUpload handleUpload={handleUpload} isLoading={isLoading}/>

          {/* Create Folder Section */}
          <CreateFolder handleCreateFolder={handleCreateFolder} isLoading={isLoading}/>

          {/* Files List Section */}
          <FilesList />
        </>
      )}
    </>
  );
};

export default WPMUDEV_DriveTest;
