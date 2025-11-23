import AsyncStorage from '@react-native-async-storage/async-storage';


// Get data from network first, fallback to cache
export const getFromNetworkFirst = async <T>(key: string, request: Promise<T>): Promise<T> => {
    try {
        // Try to fetch data from network
        const response = await request;

        // Save response to cache for future use
        setInCache(key, response);

        // Return network response
        return response;
    } catch (e) {
        // If network request fails, return cached value
        return getFromCache<T>(key);
    }
};

// Save data to cache
export const setInCache = (key: string, value: any) => {
    // Convert value to JSON string
    const jsonValue = JSON.stringify(value);

    // Save JSON string to AsyncStorage
    return AsyncStorage.setItem(key, jsonValue);
};


// Retrieve data from cache
export const getFromCache = async <T>(key: string): Promise<T> => {
    // Get JSON string from AsyncStorage
    const json = await AsyncStorage.getItem(key);

    // If value exists, parse JSON and return
    // Otherwise, reject promise with error
    return await (json != null
        ? Promise.resolve(JSON.parse(json))
        : Promise.reject(`Key "${key}" not in cache`));
};
