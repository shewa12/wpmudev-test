import CreateFolder from "./CreateFolder";
import FilesList from "./FilesList";
import FileUpload from "./FileUpload";

const FileManagement = () => {
    return (
        <>
            {/* File Upload Section */}
            <FileUpload handleUpload={handleUpload} isLoading={isLoading} />

            {/* Create Folder Section */}
            <CreateFolder handleCreateFolder={handleCreateFolder} isLoading={isLoading} />

            {/* Files List Section */}
            <FilesList />
        </>
    );
}
export default FileManagement;