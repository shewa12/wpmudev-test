<?php
/**
 * Scan post
 *
 * @link    https://wpmudev.com/
 * @since   1.0.0
 *
 * @author  WPMUDEV (https://wpmudev.com)
 * @package WPMUDEV_PluginTest
 *
 * @copyright (c) 2025, Incsub (http://incsub.com)
 */

namespace WPMUDEV\PluginTestCore\PostsScanner;

use WPMUDEV\PluginTest\BackgroundJobProcessor;

defined( 'ABSPATH' ) || exit;

/**
 * Class QuizAttemptMigrator
 *
 * @since 1.0.0
 */
class PostsScanner extends BackgroundJobProcessor implements ScannerInterface {

	/**
	 * Name of the process
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $name = 'Post Scan';

	/**
	 * Job arguments
	 *
	 * @var array
	 */
	protected $args;

	/**
	 * Action
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $action = 'wpmudev_plugin_test_post_scan';

	/**
	 * Batch size
	 *
	 * @since 1.0.0
	 *
	 * @var integer
	 */
	protected $batch_size = 10;

	/**
	 * Schedule interval.
	 *
	 * @since 1.0.0
	 *
	 * @var integer
	 */
	protected $schedule_interval = 1;

	/**
	 * Start scanning
	 *
	 * @since 1.0.0
	 *
	 * @param array $args Arguments.
	 *
	 * @return void
	 */
	public function scan( array $args ) {
		$this->args = $args;
		$this->schedule();
	}

	/**
	 * Get total unprocessed result.
	 *
	 * @since 1.0.0
	 * @param array $args arguments.
	 *
	 * @return int
	 */
	protected function get_total_items( $args ): int {
		$args = array(
			'post_type'      => $args['post_type'],
			'post_status'    => 'publish',
			'posts_per_page' => -1, // Get all.
			'fields'         => 'ids',
			'no_found_rows'  => true,
		);

		$post_ids = get_posts( $args );

		return count( $post_ids );
	}

	/**
	 * Get items to batch process.
	 *
	 * @since 1.0.0
	 *
	 * @param int   $offset offset.
	 * @param int   $limit limit.
	 * @param array $args arguments.
	 *
	 * @return array
	 */
	protected function get_items( $offset, $limit, $args ) : array {
		$args = array(
			'post_type'      => $args['post_type'],
			'post_status'    => 'publish',
			'posts_per_page' => $limit,
			'offset'         => $offset,
			'no_found_rows'  => true,
		);

		return get_posts( $args );
	}

	/**
	 * Process each quiz attempt record to prepare result.
	 *
	 * @since 1.0.0
	 *
	 * @throws \Exception If there is an error during processing.
	 *
	 * @param object $item item.
	 *
	 * @return void
	 */
	public function process_item( $item ) : void {

	}

	/**
	 * On migration complete event.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	protected function on_complete() {
		error_log( 'Post scan completed!' );
	}

	/**
	 * Get item id
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Post $item WP_Post object.
	 *
	 * @return int
	 */
	public function get_item_id( $item ) {
		return $item->ID;
	}
}
