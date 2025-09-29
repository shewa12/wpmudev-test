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

use WPMUDEV\PluginTest\Base;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use WPMUDEV\PluginTestApp\Traits\RestResponse;
use WPMUDEV\PluginTestCore\PostsScanner\PostsScanCommand;
use WPMUDEV\PluginTestCore\PostsScanner\PostsScanner;

/**
 * Post scanner REST API
 *
 * @since 1.0.0
 */
class Post_Scanner_API extends Base {

	use RestResponse;

	/**
	 * Initialize the class.
	 */
	public function init() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST API routes.
	 *
	 * @since 1.0.0
	 */
	public function register_routes() {
		register_rest_route(
			'wpmudev/v1/post-scanner',
			'/scan',
			array(
				'methods'  => 'POST',
				'callback' => array( $this, 'scan_posts' ),
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
	 * @return WP_REST_Response|WP_Error
	 */
	public function scan_posts( WP_REST_Request $request ) {
		$args = $request->get_param( 'args' );

		if ( empty( $args ) ) {
			return new WP_Error( 400, __( 'Bad request', 'wpmudev-plugin-test' ) );
		}

		$scanner = PostsScanner::instance();
		$command = new PostsScanCommand( $scanner );

		$args = array(
			'post_type' => $args,
		);

		$command->execute( $args );
	}
}
