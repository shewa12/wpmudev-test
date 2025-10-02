import { useState } from 'react';
import { Button, Spinner, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import NoticeMessage from './NoticeMessage';

const CreateFolder = ({ handleCreateFolder, isCreatingFolder }) => {
    const [folderName, setFolderName] = useState("");
    const [showNotice, setShowNotice] = useState(true);
    const [notice, setNotice] = useState({ type: '', message: '' });
    const createFolder = async () => {
        try {
            await handleCreateFolder(folderName);
            setFolderName('');
            setNotice({ type: 'success', message: __('Folder created successfully', 'wpmudev-plugin-test') });
            setShowNotice(true);
        } catch (error) {
            setNotice({ type: 'error', message: error.message });
            setShowNotice(true);
        }
    }

    return (
        <>
            <div className="sui-box">
                {
                    showNotice && notice && notice.message &&
                    <div className='sui-box'>
                        <NoticeMessage {...notice} onRemove={() => { setShowNotice(false) }} />
                    </div>
                }
                <div className="sui-box-header">
                    <h2 className="sui-box-title">
                        {__('Create New Folder', 'wpmudev-plugin-test')}
                    </h2>
                </div>
                <div className="sui-box-body">
                    <div className="sui-box-settings-row">
                        <TextControl
                            label="Folder Name"
                            value={folderName}
                            onChange={setFolderName}
                            placeholder={__('Enter folder name', 'wpmudev-plugin-test')}
                        />
                    </div>
                </div>
                <div className="sui-box-footer">
                    <div className="sui-actions-right">
                        <Button
                            variant="secondary"
                            onClick={createFolder}
                            disabled={isCreatingFolder || !folderName.trim()}
                        >
                            {isCreatingFolder ? <Spinner /> : __("Create Folder", 'wpmudev-plugin-test')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateFolder;
