<?php
/**
 * Rest response handler
 *
 * @link          https://wpmudev.com/
 * @since         1.0.0
 *
 * @author        WPMUDEV (https://wpmudev.com)
 * @package       WPMUDEV\PluginTest
 *
 * @copyright (c) 2025, Incsub (http://incsub.com)
 */

namespace WPMUDEV\PluginTestApp\Traits;

use WP_REST_Response;

trait RestResponse {

	/**
	 * Send the response
	 *
	 * @since 1.0.0
	 *
	 * @param array $data   The response data.
	 * @param int   $status The response status code.
	 *
	 * @return WP_REST_Response
	 */
	public function send_response( $data = array(), $status = 200 ) {
		// Send the response.
		return new WP_REST_Response(
			$data,
			$status
		);
	}
}
