import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useDriveService from "../hooks/useDriveService";
import { __ } from "@wordpress/i18n";

import CreateFolder from "./CreateFolder";
import FilesList from "./FilesList";
import FileUpload from "./FileUpload";
import { useState } from "react";

const FileManagement = () => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { getFiles, createFolder, uploadFile } = useDriveService();
  const queryClient = useQueryClient();

  const [pageSize, setPageSize] = useState(20);
  const [query, setQuery] = useState("trashed=false");

  const {
    isPending,
    error,
    data: files,
  } = useQuery({
    queryKey: ["getFiles", pageSize, query],
    queryFn: async ({ queryKey }) => {
      const [_key, pageSize, query] = queryKey;
      const res = await getFiles({ pageSize, query });
      return res.files;
    },
  });

  const refreshMutation = useMutation({
    mutationFn: async ({ pageSize, query }) => {
      const res = await getFiles({ pageSize, query });
      return res.files;
    },
    onSuccess: (data, variables) => {
      // Update cache directly so UI reflects new results
      queryClient.setQueryData(
        ["getFiles", variables.pageSize, variables.query],
        data
      );
    },
  });

  const handleUpload = async (file) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.set("file", file);
      await uploadFile(formData);
      refreshMutation.mutate();
    } catch (error) {
      throw new Error(__("Failed to upload file"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async (folderName) => {
    try {
      setIsCreatingFolder(true);
      await createFolder({ name: folderName });
      refreshMutation.mutate();
    } catch (error) {
      throw new Error(__("Failed to create folder"));
    } finally {
      setIsCreatingFolder(false);
    }
  };

  return (
    <>
      {/* File Upload Section */}
      <FileUpload handleUpload={handleUpload} isUploading={isUploading} />

      {/* Create Folder Section */}
      <CreateFolder
        handleCreateFolder={handleCreateFolder}
        isCreatingFolder={isCreatingFolder}
      />

      {/* Files List Section */}
      <FilesList
        files={files}
        isLoading={isPending || refreshMutation.isPending}
        error={error}
        pageSize={pageSize}
        setPageSize={setPageSize}
        fileType={query}
        setFileType={setQuery}
        onRefresh={() => refreshMutation.mutate({ pageSize, query })}
      />
    </>
  );
};

export default FileManagement;
