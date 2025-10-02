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

    // Fetch files
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

    // Mutation to refresh files
    const refreshMutation = useMutation({
        mutationFn: async () => {
            const res = await getFiles();
            return res.files;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getFiles"] });
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
            throw new Error(__('Failed to upload file'));
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
            throw new Error(__('Failed to create folder'));
        } finally {
            setIsCreatingFolder(false);
        }
    }

    return (
        <>
            {/* File Upload Section */}
            <FileUpload handleUpload={handleUpload} isUploading={isUploading} />

            {/* Create Folder Section */}
            <CreateFolder handleCreateFolder={handleCreateFolder} isCreatingFolder={isCreatingFolder} />

            {/* Files List Section */}
            <FilesList
                files={files}
                isLoading={isPending || refreshMutation.isPending}
                error={error}
                onRefresh={refreshMutation.mutate}
            />
        </>
    );

};

export default FileManagement;
