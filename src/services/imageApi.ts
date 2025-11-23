import axios, { AxiosResponse } from 'axios';
import { getEnvironentVariable } from '../utils';

// Image upload API configuration
// We are using ImgBB as the image hosting service: https://api.imgbb.com/
//
// Steps to use ImgBB:
// 1. Sign up for free at https://imgbb.com/signup
// 2. Obtain your API key
// 3. Add it to your .env file in the project root as IMGBB_API_KEY
//
// Local environment usage:
// IMGBB_API_KEY="your_api_key_here" npx expo start
//
// For production builds with Expo Application Services (EAS):
// Run `eas secret:push` to securely upload your API key to the build environment.

const imageApi = axios.create({
    baseURL: 'https://api.imgbb.com/1', // ImgBB API base URL
    headers: { 'Content-Type': 'multipart/form-data' }, // Required for file uploads
    params: { key: getEnvironentVariable('IMGBB_API_KEY') }, // API key from environment
});

// Upload an image
// Accepts a Base64-encoded image string and uploads it to ImgBB
// Returns a Promise resolving to the AxiosResponse containing the uploaded image URL
export const uploadImage = (imageBase64: string): Promise<AxiosResponse> => {
    const data = new FormData();

    // Append the Base64 string as 'image' field in the form data
    data.append('image', imageBase64);

    // Send POST request to /upload endpoint
    return imageApi.post('/upload', data);
};
