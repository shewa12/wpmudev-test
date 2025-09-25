
import { StrictMode, useState } from '@wordpress/element';
import CredentialsForm from './components/CredentialsForm';
import NoticeMessage from './components/NoticeMessage';

const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [notice, setNotice] = useState({ message: '', type: '' });
    const [hasCredentials, setHasCredentials] = useState(window.wpmudevDriveTest.hasCredentials || false);

    const showNotice = (message, type = 'success') => {
        setNotice({ message, type });
        setTimeout(() => setNotice({ message: '', type: '' }), 5000);
    };

    const handleSaveCredentials = async (data) => {
        try {
            setIsLoading(true);

            const response = await fetch(window.wpmudevDriveTest.restUrl + 'save-credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.wpmudevDriveTest.nonce,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save credentials');
            }

            showNotice('Credentials saved successfully');
            setHasCredentials(true);
        } catch (err) {
            showNotice(err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="sui-header">
                <h1 className="sui-header-title">Google Drive Test</h1>
                <p className="sui-description">Test Google Drive API integration for applicant assessment</p>
            </div>

            <NoticeMessage
                message={notice.message}
                type={notice.type}
                onRemove={() => setNotice({ message: '', type: '' })}
            />

            {!hasCredentials ? (
                <CredentialsForm
                    isLoading={isLoading}
                    onSave={handleSaveCredentials}
                />
            ) : (
                <p>✅ Credentials already saved. (Next steps: Auth, Upload, Files UI...)</p>
            )}
        </>
    );
};

export default App;
