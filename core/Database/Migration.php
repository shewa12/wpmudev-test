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
 * The Migrate class creates and drops tables for a database
 */
class Migration {

	/**
	 * The function returns an array of tables
	 *
	 * @since 1.0.0
	 *
	 * @return array of tables
	 */
	public static function tables() {
		$tables = array(
			JobsTable::class,
		);

		return $tables;
	}

	/**
	 * Create all the tables
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function migrate_tables() {
		$tables = self::tables();

		foreach ( $tables as $table ) {
			$table->create_table();
		}
	}

	/**
	 * Drop all the tables
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function drop_tables() {
		global $wpdb;

		$wpdb->query( 'SET foreign_key_checks = 0' );

		$tables = self::tables();

		foreach ( $tables as $table ) {
			$table->drop_table();
		}

		$wpdb->query( 'SET foreign_key_checks = 1' );
	}

	/**
	 * Truncate data from database
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function truncate_tables() {
		global $wpdb;

		$wpdb->query( 'SET foreign_key_checks = 0' );

		$tables = self::tables();

		foreach ( $tables as $table ) {
			$wpdb->query( "DELETE FROM {$table->get_table_name()}" );
		}

		$wpdb->query( 'SET foreign_key_checks = 1' );
	}
}
