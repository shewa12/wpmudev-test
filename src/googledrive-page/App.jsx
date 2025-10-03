import {
    useState,
    useEffect,
} from "@wordpress/element";

import "./scss/style.scss";
import CredentialsForm from "./components/CredentialsForm";
import AuthForm from "./components/AuthForm";
import useDriveService from "./hooks/useDriveService";
import NoticeMessage from "./components/NoticeMessage";
import { __ } from "@wordpress/i18n";
import FileManagement from "./components/FileManagement";

const WPMUDEV_DriveTest = () => {
    const {
        saveCredentials,
        authenticate,
    } = useDriveService();

    const [isAuthenticated, setIsAuthenticated] = useState(
        window.wpmudevDriveTest.authStatus || false
    );
    const [hasCredentials, setHasCredentials] = useState(
        window.wpmudevDriveTest.hasCredentials || false
    );
    const [showCredentials, setShowCredentials] = useState(!hasCredentials);

    const [isLoading, setIsLoading] = useState(false);
    const [notice, setNotice] = useState({ message: "", type: "" });

    useEffect(() => { }, [isAuthenticated]);

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
            const { success, auth_url } = res;
            if (success) {
                window.location.href = auth_url;
            }
        } catch (error) {
            alert(error.message)
        }
    };

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
            }} />

            {!hasCredentials || showCredentials ? (
                <CredentialsForm isLoading={isLoading} onSave={handleSaveCredentials} />
            ) : !isAuthenticated ? (
                <AuthForm handleAuth={handleAuth} isLoading={isLoading} setShowCredentials={setShowCredentials} />
            ) : (
                <>
                    <FileManagement />
                </>
            )}
        </>
    );
};

export default WPMUDEV_DriveTest;
