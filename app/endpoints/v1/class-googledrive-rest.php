<?php
/**
 * Google Drive API endpoints using Google Client Library.
 *
 * @link          https://wpmudev.com/
 * @since         1.0.0
 *
 * @author        WPMUDEV (https://wpmudev.com)
 * @package       WPMUDEV\PluginTest
 *
 * @copyright (c) 2025, Incsub (http://incsub.com)
 */

namespace WPMUDEV\PluginTest\Endpoints\V1;

// Abort if called directly.
defined( 'WPINC' ) || die;

use Exception;
use WPMUDEV\PluginTest\Base;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use Google_Client;
use Google_Service_Drive;
use Google_Service_Drive_DriveFile;
use WP;
use WPMUDEV\PluginTestApp\Traits\RestResponse;

class Drive_API extends Base {

	/**
	 * Option names to tokens
	 *
	 * @since 1.0.0
	 */
	const ACCESS_TOKEN     = 'wpmudev_drive_access_token';
	const REFRESH_TOKEN    = 'wpmudev_drive_refresh_token';
	const TOKEN_EXPIRES_IN = 'wpmudev_drive_token_expires';

	/**
	 * Auth credentials option name
	 */
	const AUTH_CRED = 'wpmudev_plugin_tests_auth';

	use RestResponse;

	/**
	 * Google Client instance.
	 *
	 * @var Google_Client
	 */
	private $client;

	/**
	 * Google Drive service.
	 *
	 * @var Google_Service_Drive
	 */
	private $drive_service;

	/**
	 * OAuth redirect URI.
	 *
	 * @var string
	 */
	private $redirect_uri;

	/**
	 * Google Drive API scopes.
	 *
	 * @var array
	 */
	private $scopes = array(
		Google_Service_Drive::DRIVE_FILE,
		Google_Service_Drive::DRIVE_READONLY,
	);

	/**
	 * Initialize the class.
	 */
	public function init() {
		$this->redirect_uri = home_url( '/wp-json/wpmudev/v1/drive/callback' );
		$this->setup_google_client();

		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Setup Google Client.
	 */
	private function setup_google_client() {
		$auth_creds = get_option( self::AUTH_CRED, array() );

		if ( empty( $auth_creds['client_id'] ) || empty( $auth_creds['client_secret'] ) ) {
			return;
		}

		$client_id     = $this->decrypt( $auth_creds['client_id'] );
		$client_secret = $this->decrypt( $auth_creds['client_secret'] );

		$this->client = new Google_Client();
		$this->client->setClientId( $client_id );
		$this->client->setClientSecret( $client_secret );
		$this->client->setRedirectUri( $this->redirect_uri );
		$this->client->setScopes( $this->scopes );
		$this->client->setAccessType( 'offline' );
		$this->client->setPrompt( 'consent' );

		// Set access token if available.
		$access_token = get_option( self::ACCESS_TOKEN, '' );
		if ( ! empty( $access_token ) ) {
			$this->client->setAccessToken( $access_token );
		}

		$this->drive_service = new Google_Service_Drive( $this->client );
	}

	/**
	 * Register REST API routes.
	 */
	public function register_routes() {
		// Save credentials endpoint.
		register_rest_route(
			'wpmudev/v1/drive',
			'/save-credentials',
			array(
				'methods'  => 'POST',
				'callback' => array( $this, 'save_credentials' ),
			)
		);

		// Authentication endpoint.
		register_rest_route(
			'wpmudev/v1/drive',
			'/auth',
			array(
				'methods'  => 'POST',
				'callback' => array( $this, 'start_auth' ),
			)
		);

		// OAuth callback.
		register_rest_route(
			'wpmudev/v1/drive',
			'/callback',
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'handle_callback' ),
			)
		);

		// List files.
		register_rest_route(
			'wpmudev/v1/drive',
			'/files',
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'list_files' ),
			)
		);

		// Upload file.
		register_rest_route(
			'wpmudev/v1/drive',
			'/upload',
			array(
				'methods'  => 'POST',
				'callback' => array( $this, 'upload_file' ),
			)
		);

		// Download file.
		register_rest_route(
			'wpmudev/v1/drive',
			'/download',
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'download_file' ),
			)
		);

		// Create folder.
		register_rest_route(
			'wpmudev/v1/drive',
			'/create-folder',
			array(
				'methods'  => 'POST',
				'callback' => array( $this, 'create_folder' ),
			)
		);
	}

	/**
	 * Save Google OAuth credentials.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Response
	 */
	public function save_credentials( WP_REST_Request $request ) {
		$client_id     = sanitize_text_field( $request->get_param( 'client_id' ) );
		$client_secret = sanitize_text_field( $request->get_param( 'client_secret' ) );

		if ( empty( $client_id ) || empty( $client_secret ) ) {
			return $this->send_response(
				array(
					'success' => false,
					'message' => 'Client ID and Client Secret are required',
				),
				400
			);
		}

		$credentials = array(
			'client_id'     => $this->encrypt( $client_id ),
			'client_secret' => $this->encrypt( $client_secret ),
		);

		update_option( self::AUTH_CRED, $credentials, false );

		// Reinitialize client.
		$this->setup_google_client();

		return $this->send_response(
			array(
				'success' => true,
				'message' => 'Credentials saved successfully.',
			)
		);
	}


	/**
	 * Start Google OAuth flow.
	 *
	 * @since 1.0.0
	 *
	 * @return WP_REST_Response
	 */
	public function start_auth() {
		$this->setup_google_client();

		if ( ! $this->client ) {
			return $this->send_response(
				array(
					'success' => false,
					'message' => 'Google OAuth credentials not configured',
				)
			);
		}

		$auth_url = $this->client->createAuthUrl();

		return $this->send_response(
			array(
				'success'  => true,
				'auth_url' => $auth_url,
			),
		);
	}

	/**
	 * Handle OAuth callback.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return void
	 */
	public function handle_callback( WP_REST_Request $request ) {
		$code = $request->get_param( 'code' );

		if ( empty( $code ) ) {
			wp_die( 'Authorization code not received' );
		}

		try {
			$access_token  = $this->client->fetchAccessTokenWithAuthCode( $code );
			$expires_in    = $access_token['expires_in'] ?? 0;
			$refresh_token = $access_token['refresh_token'] ?? '';

			if ( isset( $access_token['error'] ) ) {
				wp_die( 'Failed to get access token: ' . esc_html( $access_token['error'] ) );
			}

			// Store access & refresh tokens.
			update_option( self::ACCESS_TOKEN, $access_token );
			update_option( self::TOKEN_EXPIRES_IN, time() + $expires_in );
			if ( $refresh_token ) {
				update_option( self::REFRESH_TOKEN, $refresh_token );
			}

			// Redirect to admin page.
			wp_safe_redirect( admin_url( 'admin.php?page=wpmudev_plugintest_drive&auth=success' ) );
			exit;

		} catch ( \Exception $e ) {
			wp_die( 'Failed to get access token: ' . esc_html( $e->getMessage() ) );
		}
	}

	/**
	 * Ensure we have a valid access token.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	private function ensure_valid_token() {
		$this->setup_google_client();

		if ( ! $this->client ) {
			return false;
		}

		// Check if token is expired and refresh if needed.
		if ( $this->client->isAccessTokenExpired() ) {
			$refresh_token = get_option( self::REFRESH_TOKEN );

			if ( empty( $refresh_token ) ) {
				return false;
			}

			try {
				$new_token = $this->client->fetchAccessTokenWithRefreshToken( $refresh_token );

				if ( array_key_exists( 'error', $new_token ) ) {
					return false;
				}

				update_option( self::ACCESS_TOKEN, $new_token['access_token'] );
				update_option( self::TOKEN_EXPIRES_IN, $new_token['expires_in'] );

				return true;
			} catch ( \Exception $e ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * List files in Google Drive.
	 *
	 * @since 1.0.0
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function list_files( WP_REST_Request $request ) {
		if ( ! $this->ensure_valid_token() ) {
			return new WP_Error( 'no_access_token', 'Not authenticated with Google Drive', array( 'status' => 401 ) );
		}

		$page_size = (int) $request->get_param( 'pageSize' );
		$query     = sanitize_text_field( $request->get_param( 'q' ) );

		if ( ! $page_size ) {
			$page_size = 20;
		}
		if ( ! $query ) {
			$query = 'trashed=false';
		}

		try {
			$options = array(
				'pageSize' => $page_size,
				'q'        => $query,
				'fields'   => 'files(id,name,mimeType,size,modifiedTime,webViewLink)',
			);

			$results = $this->drive_service->files->listFiles( $options );
			$files   = $results->getFiles();

			$file_list = array();
			foreach ( $files as $file ) {
				$file_list[] = array(
					'id'           => $file->getId(),
					'name'         => $file->getName(),
					'mimeType'     => $file->getMimeType(),
					'size'         => $file->getSize(),
					'modifiedTime' => $file->getModifiedTime(),
					'webViewLink'  => $file->getWebViewLink(),
				);
			}

			return $this->send_response(
				array(
					'success' => true,
					'files'   => $file_list,
				)
			);
		} catch ( Exception $e ) {
			return new WP_Error( 'api_error', $e->getMessage(), array( 'status' => 500 ) );
		}
	}

	/**
	 * Upload file to Google Drive.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Request
	 */
	public function upload_file( WP_REST_Request $request ) {
		if ( ! $this->ensure_valid_token() ) {
			return new WP_Error( 'no_access_token', __( 'Not authenticated with Google Drive', 'wpmudev-plugin-test' ), array( 'status' => 401 ) );
		}

		$files = $request->get_file_params();

		if ( empty( $files['file'] ) ) {
			return new WP_Error( 'no_file', __( 'No file provided', 'wpmudev-plugin-test' ), array( 'status' => 400 ) );
		}

		$file = $files['file'];

		if ( $file['error'] !== UPLOAD_ERR_OK ) {
			return new WP_Error( 'upload_error', __( 'File upload error', 'wpmudev-plugin-test' ), array( 'status' => 400 ) );
		}

		try {
			// Create file metadata.
			$drive_file = new Google_Service_Drive_DriveFile();
			$drive_file->setName( $file['name'] );

			// Upload file.
			$result = $this->drive_service->files->create(
				$drive_file,
				array(
					'data'       => file_get_contents( $file['tmp_name'] ),
					'mimeType'   => $file['type'],
					'uploadType' => 'multipart',
					'fields'     => 'id,name,mimeType,size,webViewLink',
				)
			);

			return $this->send_response(
				array(
					'success' => true,
					'file'    => array(
						'id'          => $result->getId(),
						'name'        => $result->getName(),
						'mimeType'    => $result->getMimeType(),
						'size'        => $result->getSize(),
						'webViewLink' => $result->getWebViewLink(),
					),
				)
			);

		} catch ( Exception $e ) {
			return new WP_Error( 'upload_failed', $e->getMessage(), array( 'status' => 500 ) );
		}
	}

	/**
	 * Download file from Google Drive.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Request
	 */
	public function download_file( WP_REST_Request $request ) {
		if ( ! $this->ensure_valid_token() ) {
			return new WP_Error( 'no_access_token', 'Not authenticated with Google Drive', array( 'status' => 401 ) );
		}

		$file_id = $request->get_param( 'file_id' );

		if ( empty( $file_id ) ) {
			return new WP_Error( 'missing_file_id', 'File ID is required', array( 'status' => 400 ) );
		}

		try {
			// Get file metadata.
			$file = $this->drive_service->files->get(
				$file_id,
				array(
					'fields' => 'id,name,mimeType,size',
				)
			);

			// Download file content.
			$response = $this->drive_service->files->get(
				$file_id,
				array(
					'alt' => 'media',
				)
			);

			$content = $response->getBody()->getContents();

			// Return file content as base64 for JSON response.
			return $this->send_response(
				array(
					'success'  => true,
					'content'  => base64_encode( $content ),
					'filename' => $file->getName(),
					'mimeType' => $file->getMimeType(),
				)
			);

		} catch ( Exception $e ) {
			return new WP_Error( 'download_failed', $e->getMessage(), array( 'status' => 500 ) );
		}
	}

	/**
	 * Create folder in Google Drive.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Request|WP_Error
	 */
	public function create_folder( WP_REST_Request $request ) {
		if ( ! $this->ensure_valid_token() ) {
			return new WP_Error( 'no_access_token', 'Not authenticated with Google Drive', array( 'status' => 401 ) );
		}

		$name = $request->get_param( 'name' );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Folder name is required', array( 'status' => 400 ) );
		}

		try {
			$folder = new Google_Service_Drive_DriveFile();
			$folder->setName( sanitize_text_field( $name ) );
			$folder->setMimeType( 'application/vnd.google-apps.folder' );

			$result = $this->drive_service->files->create(
				$folder,
				array(
					'fields' => 'id,name,mimeType,webViewLink',
				)
			);

			return $this->send_response(
				array(
					'success' => true,
					'folder'  => array(
						'id'          => $result->getId(),
						'name'        => $result->getName(),
						'mimeType'    => $result->getMimeType(),
						'webViewLink' => $result->getWebViewLink(),
					),
				)
			);
		} catch ( Exception $e ) {
			return new WP_Error( 'create_failed', $e->getMessage(), array( 'status' => 500 ) );
		}
	}

	/**
	 * Encrypt string
	 *
	 * @since 1.0.0
	 *
	 * @param string $string String to encrypt.
	 * @param string $key Extra key.
	 *
	 * @return string
	 */
	public function encrypt( string $string, string $key = 'wpmudev' ): string {
		$cipher    = 'AES-256-CBC';
		$iv_length = openssl_cipher_iv_length( $cipher );
		$iv        = openssl_random_pseudo_bytes( $iv_length );

		$encrypted = openssl_encrypt( $string, $cipher, $key, 0, $iv );
		return base64_encode( $iv . $encrypted );
	}

	/**
	 * Decrypt string
	 *
	 * @since 1.0.0
	 *
	 * @param string $string String to decrypt.
	 * @param string $key Extra key.
	 *
	 * @return string
	 */
	public function decrypt( string $string, string $key = 'wpmudev' ): string {
		$cipher    = 'AES-256-CBC';
		$iv_length = openssl_cipher_iv_length( $cipher );

		$decoded = base64_decode( $string );

		$iv        = substr( $decoded, 0, $iv_length );
		$encrypted = substr( $decoded, $iv_length );

		$decrypted = openssl_decrypt( $encrypted, $cipher, $key, 0, $iv );

		return $decrypted;
	}
}
