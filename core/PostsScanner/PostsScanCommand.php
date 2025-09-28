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

defined( 'ABSPATH' ) || exit;

/**
 * Command to handle post scan.
 *
 * @since 1.0.0
 */
class PostsScanCommand {

	/**
	 * Scanner instance
	 *
	 * @since 1.0.0
	 *
	 * @var ScannerInterface
	 */
	protected $scanner;

	/**
	 * Resolve dependencies.
	 *
	 * @since 1.0.0
	 *
	 * @param ScannerInterface $scanner Scanner instance.
	 */
	public function __construct( ScannerInterface $scanner ) {
		$this->scanner = $scanner;
	}

	/**
	 * Execute the command.
	 *
	 * @since 1.0.0
	 *
	 * @param array $post_types Post types to scan.
	 *
	 * @return void
	 */
	public function execute( $post_types = array( 'post', 'page' ) ) {
		try {
			$this->scanner->scan( $post_types );
		} catch ( \Exception $e ) {
			// Log the error.
			error_log( $e->getMessage() );
		}
	}
}
