import { Button, TextControl, Spinner } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';
import { useForm } from 'react-hook-form';

const CredentialsForm = ({ isLoading, onSave }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <div className="sui-box">
            <div className="sui-box-header">
                <h2 className="sui-box-title">Set Google Drive Credentials</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="sui-box-body">
                    <div className="sui-box-settings-row">
                        <TextControl
                            label="Client ID"
                            help={createInterpolateElement(
                                'You can get Client ID from <a>Google Cloud Console</a>. Make sure to enable Google Drive API.',
                                {
                                    a: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" />,
                                }
                            )}
                            {...register("clientId", { required: "Client ID is required" })}
                        />
                        {errors.clientId && <p className="form-error">{errors.clientId.message}</p>}
                    </div>

                    <div className="sui-box-settings-row">
                        <TextControl
                            label="Client Secret"
                            type="password"
                            help={createInterpolateElement(
                                'You can get Client Secret from <a>Google Cloud Console</a>.',
                                {
                                    a: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" />,
                                }
                            )}
                            {...register("clientSecret", { required: "Client Secret is required" })}
                        />
                        {errors.clientSecret && <p className="form-error">{errors.clientSecret.message}</p>}
                    </div>

                    <div className="sui-box-settings-row">
                        <span>Please use this URL <em>{window.wpmudevDriveTest.redirectUri}</em> in your Google API’s <strong>Authorized redirect URIs</strong> field.</span>
                    </div>
                </div>
                <div className="sui-box-footer">
                    <div className="sui-actions-right">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner /> : 'Save Credentials'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CredentialsForm;
