import { createRoot, render, StrictMode } from '@wordpress/element';
import PostsMaintenanceApp from './app';

const domElement = document.getElementById(wpmudevPostsMaintenance.pageId);
if (createRoot) {
    createRoot(domElement).render(<StrictMode><PostsMaintenanceApp /></StrictMode>);
} else {
    render(<StrictMode><PostsMaintenanceApp /></StrictMode>, domElement);
}