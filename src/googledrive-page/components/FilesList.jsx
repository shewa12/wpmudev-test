import { Button, Spinner } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";

const FilesList = ({ files, isLoading, error, onRefresh }) => {
    return (
        <div className="sui-box">
            <div className="sui-box-header">
                <h2 className="sui-box-title">
                    {__("Your Drive Files", "wpmudev-plugin-test")}
                </h2>
                <div className="sui-actions-right">
                    <Button
                        variant="secondary"
                        onClick={onRefresh}
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner /> : __("Refresh Files", "wpmudev-plugin-test")}
                    </Button>
                </div>
            </div>
            <div className="sui-box-body">
                {isLoading ? (
                    <div className="drive-loading">
                        <Spinner />
                        <p>{__("Loading files...", "wpmudev-plugin-test")}</p>
                    </div>
                ) : error ? (
                    <div className="drive-error">
                        <p>{__("Error loading files", "wpmudev-plugin-test")}</p>
                    </div>
                ) : files && files.length > 0 ? (
                    <div className="drive-files-grid">
                        {files.map((file) => (
                            <div key={file.id} className="drive-file-item">
                                <div className="file-info">
                                    <strong>{file.name}</strong>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <small>
                                            {__("File type: ", "wpmudev-plugin-test")}
                                            {file.mimeType}
                                        </small>
                                        <small>
                                            {sprintf(
                                                __("File size: %d kb", "wpmudev-plugin-test"),
                                                file.size
                                            )}
                                        </small>
                                        <small>
                                            {file.modifiedTime
                                                ? sprintf(
                                                    __("Created at: %s", "wpmudev-plugin-test"),
                                                    new Date(file.modifiedTime).toLocaleDateString()
                                                )
                                                : __("Unknown date", "wpmudev-plugin-test")}
                                        </small>
                                    </div>
                                </div>
                                <div className="file-actions">
                                    {file.webViewLink && (
                                        <Button
                                            variant="link"
                                            size="small"
                                            href={file.webViewLink}
                                            target="_blank"
                                        >
                                            {__("View in Drive", "wpmudev-plugin-test")}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="sui-box-settings-row">
                        <p>
                            {__(
                                "No files found in your Drive. Upload a file or create a folder to get started.",
                                "wpmudev-plugin-test"
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilesList;
