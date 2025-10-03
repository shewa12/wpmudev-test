import { useState } from '@wordpress/element';
import { Button, Spinner, Notice } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

const PostsMaintenanceApp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [notice, setNotice] = useState(null);

    const handleScan = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(wpmudevPostsMaintenance.restUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': wpmudevPostsMaintenance.nonce,
                },
                body: JSON.stringify({ post_types: ['post', 'page'] }),
            });

            const data = await response.json();

            if (response.ok) {
                setNotice({
                    status: 'success',
                    message: sprintf(
                        __('Queued %d posts for scanning.', 'wpmudev-plugin-test'),
                        data.count
                    ),
                });
            } else {
                setNotice({
                    status: 'error',
                    message: data.message || __('Something went wrong.', 'wpmudev-plugin-test'),
                });
            }
        } catch (err) {
            setNotice({
                status: 'error',
                message: err.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="wpmudev-posts-maintenance">
            <h3>{__('Posts Maintenance', 'wpmudev-plugin-test')}</h3>

            <Button
                onClick={handleScan}
                disabled={isLoading}
            >
                {isLoading ? <Spinner /> : __('Scan Posts', 'wpmudev-plugin-test')}
            </Button>
        </div>
    );
};

export default PostsMaintenanceApp;
