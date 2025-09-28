<?php
/**
 * Class to background job
 *
 * This abstract class can be used to do the background job
 *
 * @link    https://wpmudev.com/
 * @since   1.0.0
 *
 * @author  WPMUDEV (https://wpmudev.com)
 * @package WPMUDEV_PluginTest
 *
 * @copyright (c) 2025, Incsub (http://incsub.com)
 */

namespace WPMUDEV\PluginTest;

/**
 * Class background job processor
 *
 * @since 1.0.0
 */
abstract class BackgroundJobProcessor extends Singleton {

	/**
	 * Unique job id
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */

	private $job_id;

	/**
	 * Job arguments
	 *
	 * @var array
	 */
	protected $args;

	/**
	 * Batch size.
	 *
	 * @since 1.0.0
	 *
	 * @var int
	 */
	protected $batch_size;

	/**
	 * Schedule interval
	 *
	 * @since 1.0.0
	 *
	 * @var int
	 */
	protected $schedule_interval;

	/**
	 * Progress option name to keep track of each process status.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $progress_option;

	/**
	 * Action name to invoke wp-cron.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $action;

	/**
	 * Readable Name of the process.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $name;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @throws \Exception If action is not set.
	 */
	protected function __construct() {
		parent::__construct();
	}

	/**
	 * Get items to process.
	 * Must be implemented in child class.
	 *
	 * @since 1.0.0
	 *
	 * @param int   $offset offset.
	 * @param int   $limit limit.
	 * @param array $args arguments.
	 *
	 * @return array
	 */
	abstract protected function get_items( $offset, $limit, $args ) : array;

	/**
	 * Get total items to process.
	 * Must be implemented in child class.
	 *
	 * @param array $args arguments.
	 *
	 * @since 1.0.0
	 *
	 * @return int
	 */
	abstract protected function get_total_items( array $args ) : int;

	/**
	 * Process a single item.
	 * Must be implemented in child class.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $item item.
	 *
	 * @throws \Exception If failed to process.
	 *
	 * @return void
	 */
	abstract protected function process_item( $item) : void;

	/**
	 * Schedule the batch processing.
	 *
	 * This method checks if the action is already scheduled, and if not, it schedules a single event
	 * to trigger the batch processing after the specified interval.
	 *
	 * @since 1.0.0
	 *
	 * @throws \Exception If action or job id not set.
	 *
	 * @return void
	 */
	public function schedule() {
		$this->job_id = uniqid();
		$args         = $this->args;

		if ( empty( $this->action ) || empty( $this->job_id ) ) {
			throw new \Exception( 'Action & job id property must be defined in the subclass.' );
		}

		if ( ! is_array( $args ) ) {
			throw new \Exception( 'Args must be an array.' );
		}

		$args['job_id'] = $this->job_id;

		$hook = $this->get_job_name( $this->job_id );
		add_action( $hook, array( $this, 'process_job' ) );

		if ( ! wp_next_scheduled( $hook ) ) {
			wp_schedule_single_event( time() + $this->schedule_interval, $hook, array( $args ) );
		}
	}

	/**
	 * Process a job of items.
	 *
	 * This method retrieves a batch of items based on the current offset and batch size,
	 * processes each item, updates the progress, and schedules the next batch processing.
	 *
	 * @since 1.0.0
	 *
	 * @param array $args Arguments.
	 *
	 * @return void
	 */
	public function process_job( array $args ) {
		$job_id = $args['job_id'] ?? null;
		if ( ! $job_id ) {
			return;
		}

		$job = $this->get_job_schema( $job_id );

		if ( $job['completed'] ) {
			return;
		}

		// Set total_items and total_batch if not already set.
		if ( is_null( $job['total_items'] ) ) {
			$total_items = $this->get_total_items( $args );
			if ( ! $total_items ) {
				$job['feedback_msg'] = __( 'No items available to process', 'wpmudev-plugin-test' );
				$job['completed']    = 1;
				update_option( $this->get_job_name( $job_id ), $job );
				return;
			}

			$job['total_items'] = $total_items;
		}

		$items = $this->get_items( $job['processed_items'], $this->batch_size, $args );

		foreach ( $items as $item ) {
			try {
				$this->process_item( $item );
			} catch ( \Throwable $th ) {
				$job['error_log'][]  = array(
					'message' => $th->getMessage(),
					'item'    => $item,
				);
				$job['failed_ids'][] = $item->get_item_id( $item );
			} finally {
				$job['processed_items']++;
			}
		}

		update_option( $this->get_job_name( $job_id ), $job );

		$job['progress'] = (int) ceil( $job['processed_items'] / $job['total_items'] * 100 );

		if ( $job['progress'] >= 100 ) {
			$job['completed']    = 1;
			$job['completed_at'] = gmdate( 'Y-m-d H:i:s' );
			$job['feedback_msg'] = __( 'Completed', 'wpmudev-plugin-test' );
			update_option( $this->get_job_name( $job_id ), $job );

			$this->on_complete();
			return;
		}

		$hook = $this->get_job_name( $job_id );
		wp_schedule_single_event( time() + $this->schedule_interval, $hook, array( $args ) );
	}

	/**
	 * Optional method to override in child classes to perform actions when the batch processing is complete.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	protected function on_complete() {}

	/**
	 * Get the progress option name.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_progress_option_name() {
		return $this->progress_option;
	}

	/**
	 * Reset the progress option.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $job_id Job id.
	 *
	 * @return void
	 */
	public function reset( $job_id ) {
		delete_option( $this->get_job_name( $job_id ) );
	}

	/**
	 * Get item id
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $item Item to fetch id.
	 *
	 * @return int
	 */
	abstract public function get_item_id( $item );

	/**
	 * Get job schema
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $job_id Job id.
	 *
	 * @return array
	 */
	private function get_job_schema( $job_id ) {
		$job = get_option( $this->get_job_name( $job_id ) );
		if ( $job ) {
			return $job;
		}

		$job = get_option(
			$this->get_job_name( $job_id ),
			array(
				'name'            => $this->name,
				'started_at'      => gmdate( 'Y-m-d H:i:s' ),
				'completed_at'    => null,
				'completed'       => 0,
				'total_items'     => null,
				'processed_items' => 0,
				'progress'        => 0,
				'per_batch'       => $this->batch_size,
				'feedback_msg'    => '',
				'failed_ids'      => array(),
				'error_log'       => array(),
			)
		);

		return $job;
	}

	/**
	 * Get job name
	 *
	 * @param mixed $job_id Job id.
	 *
	 * @return string
	 */
	private function get_job_name( $job_id ) {
		$job_name = $this->action . '_' . $job_id;

		return $job_name;
	}
}
