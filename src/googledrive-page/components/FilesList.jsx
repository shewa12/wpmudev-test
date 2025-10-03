import { Button, Spinner, SelectControl } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { useState } from "react";

const FilesList = ({
  files,
  isLoading,
  error,
  pageSize,
  setPageSize,
  fileType,
  setFileType,
  onRefresh,
}) => {
  return (
    <div className="sui-box">
      <div className="sui-box-header">
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <h2 className="sui-box-title">
              {__("Your Drive Files", "wpmudev-plugin-test")}
            </h2>
            {/* Page Size */}
            <SelectControl
              label={__("Page Size", "wpmudev-plugin-test")}
              value={pageSize}
              options={[
                { label: "10", value: 10 },
                { label: "20", value: 20 },
                { label: "100", value: 100 },
                { label: "500", value: 500 },
              ]}
              onChange={(val) => {
                setPageSize(Number(val));
                onRefresh({ pageSize: Number(val), query: fileType });
              }}
            />

            {/* File Type */}
            <SelectControl
              label={__("Type", "wpmudev-plugin-test")}
              value={fileType}
              options={[
                { label: __("All", "wpmudev-plugin-test"), value: "" },
                {
                  label: __("Folders", "wpmudev-plugin-test"),
                  value: "folders",
                },
                {
                  label: __("Documents", "wpmudev-plugin-test"),
                  value: "documents",
                },
                {
                  label: __("Spreadsheets", "wpmudev-plugin-test"),
                  value: "spreadsheets",
                },
                {
                  label: __("Presentations", "wpmudev-plugin-test"),
                  value: "presentations",
                },
                { label: __("Forms", "wpmudev-plugin-test"), value: "forms" },
                {
                  label: __("Photos & Images", "wpmudev-plugin-test"),
                  value: "photos",
                },
                { label: __("Vids", "wpmudev-plugin-test"), value: "vids" },
              ]}
              onChange={(val) => {
                setFileType(val);
                onRefresh({ pageSize, query: val });
              }}
            />
          </div>
          {/* Refresh Button */}
          <div>
            <Button
              variant="secondary"
              onClick={() => onRefresh({ pageSize, query: fileType })}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                __("Refresh Files", "wpmudev-plugin-test")
              )}
            </Button>
          </div>
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
                    {file.size && (
                      <small>
                        {sprintf(
                          __("File size: %d kb", "wpmudev-plugin-test"),
                          file.size
                        )}
                      </small>
                    )}
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
                  <Button variant="link" size="small" href={file.webViewLink}>
                    {__("Download", "wpmudev-plugin-test")}
                  </Button>
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
