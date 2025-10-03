<?php
/**
 * Jobs table
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
 * Jobs table
 *
 * @since 1.0.0
 */
class JobsTable extends Database {

	/**
	 * Table name without prefix
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $table_name = 'jobs';

	/**
	 * Abstract function to get table name
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_table_name(): string {
		return $this->table_name;
	}

	/**
	 * Abstract function to get table schema
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_table_schema(): string {
		$schema = "CREATE TABLE {$this->table_name} (
            id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            progress TEXT NOT NULL,
            type VARCHAR(255) NOT NULL,
            status VARCHAR(255) NOT NULL,
            created_by BIGINT UNSIGNED NOT NULL UNIQUE, -- who initiated the job
            created_from ENUM('app', 'terminal') DEFAULT 'app',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_user_id (created_by),
            INDEX idx_job_status (status),
            INDEX idx_created_at (created_at)
        )  ENGINE = INNODB ";
		return $schema;
	}
}
