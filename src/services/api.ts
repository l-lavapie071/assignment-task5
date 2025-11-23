import axios, { AxiosResponse } from 'axios';

// Axios instance configuration
const api = axios.create({
    // Base URL for API requests.
    // For local development with json-server:
    // 1. Find your computer's IP address.
    // 2. Run json-server with your IP:
    //    npx json-server --watch db.json --port 3333 --host your_ip_address_here
    // 3. Update baseURL to `http://your_ip_address_here:3333`
    //
    // For online mock server using GitHub (json-server):
    // 1. Push db.json to a GitHub repo.
    // 2. Set baseURL to:
    //    https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>
    //
    // Make sure your db.json file is at the repo root when using `my-json-server`.

    baseURL: 'http://172.16.35.3:3333', // Replace with your local IP or online endpoint
});

// Authenticate user
// Sends a POST request to /login with email and password
// Returns a Promise of AxiosResponse
export const authenticateUser = (email: string, password: string): Promise<AxiosResponse> => {
    return api.post(`/login`, { email, password });
};
