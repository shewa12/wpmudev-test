import { useRef, useState } from 'react';
import { Button, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import NoticeMessage from './NoticeMessage';

const FileUpload = ({ handleUpload, isUploading }) => {
    const [file, setFile] = useState(null);
    const inputRef = useRef();
    const [showNotice, setShowNotice] = useState(true);
    const [notice, setNotice] = useState({ type: '', message: '' });
    const uploaFile = async () => {
        try {
            await handleUpload(file);
            setNotice({ type: 'success', message: __('File uploaded successfully.', 'wpmudev-plugin-test') });
            setShowNotice(true);
            setFile(null);
            inputRef.current.value = '';
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
                        {__('Upload File to Drive', 'wpmudev-plugin-test')}
                    </h2>
                </div>
                <div className="sui-box-body">
                    <div className="sui-box-settings-row">
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="drive-file-input"
                            ref={inputRef}
                        />
                        {file && (
                            <p>
                                <strong>{__("Selected file", 'wpmudev-plugin-test')}:</strong> {file.name} (
                                {Math.round(file.size / 1024)} KB)
                            </p>
                        )}
                    </div>
                </div>
                <div className="sui-box-footer">
                    <div className="sui-actions-right">
                        <Button
                            variant="secondary"
                            onClick={uploaFile}
                            disabled={isUploading || !file}
                        >
                            {isUploading ? <Spinner /> : __("Upload to Drive", 'wpmudev-plugin-test')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default FileUpload;
