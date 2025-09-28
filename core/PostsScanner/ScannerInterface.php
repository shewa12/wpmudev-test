<?php
/**
 * PostScanner interface
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

interface ScannerInterface {

	/**
	 * Scan the given path.
	 *
	 * @param array $args Arguments.
	 *
	 * @since 1.0.0
	 */
	public function scan( array $args );
}

