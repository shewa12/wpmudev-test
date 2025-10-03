<?php
/**
 * Database abstract class for migrating database
 * Base abstract class to be inherited by other classes
 *
 * @link    https://wpmudev.com/
 * @since   1.0.0
 *
 * @author  WPMUDEV (https://wpmudev.com)
 * @package WPMUDEV_PluginTest
 *
 * @copyright (c) 2025, Incsub (http://incsub.com)
 */

namespace WPMUDEV\PluginTestCore\Database;

defined( 'ABSPATH' ) || exit;

/**
 * Class Database
 */
abstract class Database {

	/**
	 * Resolve table name
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		global $wpdb;
		$this->table_name = $wpdb->prefix . $this->get_table_name();
	}

	/**
	 * Abstract function to get table name
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	abstract public function get_table_name(): string;

	/**
	 * Abstract function to get table schema
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	abstract public function get_table_schema(): string;

	/**
	 * Create the table
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function create_table() {
		do_action( 'wpmudev_plugin_test_before_create_table' );
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();
		$sql             = $this->get_table_schema() . $charset_collate;

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		dbDelta( $sql );

		do_action( 'wpmudev_plugin_test_after_create_table' );
	}

	/**
	 * Drop the table
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function drop_table() {
		global $wpdb;

		do_action( 'wpmudev_plugin_test_before_drop_table' );

		$wpdb->query( 'DROP TABLE IF EXISTS ' . $this->get_table_name() ); //phpcs:ignore

		do_action( 'wpmudev_plugin_test_after_drop_table' );
	}
}
