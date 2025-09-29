import { createRoot, render, StrictMode } from '@wordpress/element';
import WPMUDEV_DriveTest from './app';

const domElement = document.getElementById( window.wpmudevDriveTest.dom_element_id );
if ( createRoot ) {
    createRoot( domElement ).render(<StrictMode><WPMUDEV_DriveTest/></StrictMode>);
} else {
    render( <StrictMode><WPMUDEV_DriveTest/></StrictMode>, domElement );
}