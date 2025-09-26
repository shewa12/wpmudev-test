import { useCallback } from "react";

const {baseUrl, nonce, restEndpointAuth} = window.wpmudevDriveTest;

export default function useDriveService() {


    // Common request handler
    const request = useCallback(async (endpoint, options = {}) => {
        const url = `${baseUrl}${endpoint}`;

        const defaultHeaders = {
            "X-WP-Nonce": nonce,
            ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        };

        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...(options.headers || {}),
            },
        });

        let result;
        try {
            result = await response.json();
        } catch (err) {
            throw new Error("Invalid server response");
        }

        if (!response.ok) {
            throw new Error(result.message || "Request failed");
        }

        return result;
    }, [baseUrl, nonce]);

    // ---- Drive API methods ---- //
    const saveCredentials = useCallback((data) => {
        return request(window.wpmudevDriveTest.restEndpointSave, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }, [request]);

    const authenticate = useCallback(() => {
        return request(restEndpointAuth, { method: "POST" });
    }, [request]);

    const getFiles = useCallback(() => {
        return request(window.wpmudevDriveTest.restEndpointFiles, { method: "GET" });
    }, [request]);

    const uploadFile = useCallback((formData) => {
        return request(window.wpmudevDriveTest.restEndpointUpload, {
            method: "POST",
            body: formData,
            headers: { "X-WP-Nonce": nonce }, // let fetch handle multipart
        });
    }, [request, nonce]);

    const downloadFile = useCallback((fileId) => {
        return request(`${window.wpmudevDriveTest.restEndpointDownload}?id=${encodeURIComponent(fileId)}`, {
            method: "GET",
        });
    }, [request]);

    const createFolder = useCallback((data) => {
        return request(window.wpmudevDriveTest.restEndpointCreate, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }, [request]);

    return {
        saveCredentials,
        authenticate,
        getFiles,
        uploadFile,
        downloadFile,
        createFolder,
    };
}
