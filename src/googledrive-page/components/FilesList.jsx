import { Button, Spinner } from "@wordpress/components";
import { useMutation, useQuery } from "@tanstack/react-query";
import useDriveService from "../hooks/useDriveService";
import { __, sprintf } from "@wordpress/i18n";
import { useState } from "react";

const FilesList = () => {
  const { getFiles } = useDriveService();
  const [isLoading, setIsLoading] = useState(false);
  const {
    isPending,
    error,
    data: files,
  } = useQuery({
    queryKey: ["getFiles"],
    queryFn: async () => {
      const res = await getFiles();
      return res.files;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const res = await getFiles();
      setIsLoading(false);
      return res.files;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["getFiles"] });
    },
  });

  return (
    <>
      <div className="sui-box">
        <div className="sui-box-header">
          <h2 className="sui-box-title">
            {__("Your Drive Files", "wpmudev-plugin-test")}
          </h2>
          <div className="sui-actions-right">
            <Button
              variant="secondary"
              onClick={() => {
                mutation.mutate();
              }}
              disabled={isPending || isLoading}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                __("Refresh Files", "wpmudev-plugin-test")
              )}
            </Button>
          </div>
        </div>
        <div className="sui-box-body">
          {isPending || isLoading ? (
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
                          : "Unknown date"}
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
    </>
  );
};
export default FilesList;
