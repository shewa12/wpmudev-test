import { useState, useEffect, createInterpolateElement } from '@wordpress/element';
import { Button, TextControl, Spinner, Notice } from '@wordpress/components';

import "./scss/style.scss";
import CredentialsForm from './components/CredentialsForm';
import AuthForm from './components/AuthForm';
import FileUpload from './components/FileUpload';
import CreateFolder from './components/CreateFolder';

const WPMUDEV_DriveTest = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(window.wpmudevDriveTest.authStatus || false);
    const [hasCredentials, setHasCredentials] = useState(window.wpmudevDriveTest.hasCredentials || false);

    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploadFile, setUploadFile] = useState(null);
    const [folderName, setFolderName] = useState('');
    const [notice, setNotice] = useState({ message: '', type: '' });
    const [credentials, setCredentials] = useState({
        clientId: '',
        clientSecret: ''
    });

    useEffect(() => {
    }, [isAuthenticated]);

    const showNotice = (message, type = 'success') => {
        setNotice({ message, type });
        setTimeout(() => setNotice({ message: '', type: '' }), 5000);
    };

    const handleSaveCredentials = async () => {
    };

    const handleAuth = async () => {
    };

    const loadFiles = async () => {

    };

    const handleUpload = async () => {
    };

    const handleDownload = async (fileId, fileName) => {
    };

    const handleCreateFolder = async () => {
    };

    return (
        <>
            <div className="sui-header">
                <h1 className="sui-header-title">
                    Google Drive Test
                </h1>
                <p className="sui-description">Test Google Drive API integration for applicant assessment</p>
            </div>

            {notice.message && (
                <Notice status={notice.type} isDismissible onRemove=''>
                    {notice.message}
                </Notice>
            )}

            {!hasCredentials ? (
                <CredentialsForm />
            ) : !isAuthenticated ? (
                <AuthForm />
            ) : (
                <>
                    {/* File Upload Section */}
                    <FileUpload />

                    {/* Create Folder Section */}
                    <CreateFolder />

                    {/* Files List Section */}
                    <FileList />
                </>
            )}
        </>
    );
}

export default WPMUDEV_DriveTest;