import { Button, Spinner } from '@wordpress/components';
const AuthForm = ({ handleAuth, isLoading }) => {
  const handleClick = () => {
    handleAuth();
  };
  return (
    <>
      <div className="sui-box">
        <div className="sui-box-header">
          <h2 className="sui-box-title">Authenticate with Google Drive</h2>
        </div>
        <div className="sui-box-body">
          <div className="sui-box-settings-row">
            <p>
              Please authenticate with Google Drive to proceed with the test.
            </p>
            <p>
              <strong>This test will require the following permissions:</strong>
            </p>
            <ul>
              <li>View and manage Google Drive files</li>
              <li>Upload new files to Drive</li>
              <li>Create folders in Drive</li>
            </ul>
          </div>
        </div>
        <div className="sui-box-footer">
          <div className="sui-actions-left">
            <Button
              variant="secondary"
              onClick={() => setShowCredentials(true)}
            >
              Change Credentials
            </Button>
          </div>
          <div className="sui-actions-right">
            <Button variant="primary" onClick={handleClick} disabled={false}>
              {isLoading ? <Spinner /> : "Authenticate with Google Drive"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default AuthForm;
