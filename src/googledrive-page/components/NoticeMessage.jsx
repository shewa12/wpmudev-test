import { Notice } from '@wordpress/components';

const NoticeMessage = ({ message, type, onRemove }) => {
    if (!message) return null;

    return (
        <Notice status={type} isDismissible onRemove={onRemove}>
            {message}
        </Notice>
    );
};

export default NoticeMessage;
