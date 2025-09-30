import { createRoot, render, StrictMode } from '@wordpress/element';
import WPMUDEV_DriveTest from './app';

const domElement = document.getElementById( window.wpmudevDriveTest.dom_element_id );
const queryClient = new QueryClient();
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
if ( createRoot ) {
    createRoot( domElement ).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <WPMUDEV_DriveTest/>
        </QueryClientProvider>
    </StrictMode>);
} else {
    render( <StrictMode>
        <QueryClientProvider client={queryClient}>
            <WPMUDEV_DriveTest/>
        </QueryClientProvider>
    </StrictMode>, domElement );
}