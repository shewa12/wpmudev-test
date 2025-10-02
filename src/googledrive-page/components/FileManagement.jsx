import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@wordpress/components";
import useDriveService from "../hooks/useDriveService";
import { __ } from "@wordpress/i18n";

import CreateFolder from "./CreateFolder";
import FilesList from "./FilesList";
import FileUpload from "./FileUpload";
import { useState } from "react";

const FileManagement = () => {
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const { getFiles, createFolder } = useDriveService();
    const queryClient = useQueryClient();
    const [notice, setNotice] = useState({ message: "", type: "" });

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
        // Upload logic here
        // After successful upload, refresh list
        queryClient.invalidateQueries({ queryKey: ["getFiles"] });
    };

    const handleCreateFolder = async (folderName) => {
        try {
            setIsCreatingFolder(true);
            const res = await createFolder({ name: folderName });
            setNotice({ message: __('Folder created successfully'), type: 'success' })
            refreshMutation.mutate();
        } catch (error) {
            setNotice({ message: __('Failed to create folder'), type: 'error' })
        } finally {
            setIsCreatingFolder(false);
        }
    }

    return (
        <>
            {/* File Upload Section */}
            <FileUpload handleUpload={handleUpload} isLoading={isPending} />

            {/* Create Folder Section */}
            <CreateFolder handleCreateFolder={handleCreateFolder} isCreatingFolder={isCreatingFolder} notice={notice} />

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
