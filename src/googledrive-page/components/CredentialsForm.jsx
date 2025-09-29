import { Button, TextControl, Spinner } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';
import { useForm } from 'react-hook-form';
import { __ } from '@wordpress/i18n';

const CredentialsForm = ({ isLoading, onSave }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <div className="sui-box">
            <div className="sui-box-header">
                <h2 className="sui-box-title">
                    {__('Set Google Drive Credentials', 'wpmudev-plugin-test')}
                </h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="sui-box-body">
                    <div className="sui-box-settings-row">
                        <TextControl
                            label={__('Client ID', 'wpmudev-plugin-test')}
                            help={createInterpolateElement(
                                __(
                                    'You can get Client ID from <a>Google Cloud Console</a>. Make sure to enable Google Drive API.',
                                    'wpmudev-plugin-test'
                                ),
                                {
                                    a: (
                                        <a
                                            href="https://console.cloud.google.com/apis/credentials"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    ),
                                }
                            )}
                            {...register('clientId', {
                                required: __(
                                    'Client ID is required',
                                    'wpmudev-plugin-test'
                                ),
                            })}
                        />
                        {errors.clientId && (
                            <p className="form-error">{errors.clientId.message}</p>
                        )}
                    </div>

                    <div className="sui-box-settings-row">
                        <TextControl
                            label={__('Client Secret', 'wpmudev-plugin-test')}
                            type="password"
                            help={createInterpolateElement(
                                __(
                                    'You can get Client Secret from <a>Google Cloud Console</a>.',
                                    'wpmudev-plugin-test'
                                ),
                                {
                                    a: (
                                        <a
                                            href="https://console.cloud.google.com/apis/credentials"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    ),
                                }
                            )}
                            {...register('clientSecret', {
                                required: __(
                                    'Client Secret is required',
                                    'wpmudev-plugin-test'
                                ),
                            })}
                        />
                        {errors.clientSecret && (
                            <p className="form-error">
                                {errors.clientSecret.message}
                            </p>
                        )}
                    </div>

                    <div className="sui-box-settings-row">
                        <span>
                            {createInterpolateElement(
                                __(
                                    'Please use this URL <em>{{url}}</em> in your Google API’s <strong>Authorized redirect URIs</strong> field.',
                                    'wpmudev-plugin-test'
                                ),
                                {
                                    em: <em>{window.wpmudevDriveTest.redirectUri}</em>,
                                    strong: <strong />,
                                }
                            )}
                        </span>
                    </div>
                </div>
                <div className="sui-box-footer">
                    <div className="sui-actions-right">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Spinner />
                            ) : (
                                __('Save Credentials', 'wpmudev-plugin-test')
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CredentialsForm;
