const getStorage = () => {
    try {
        return window.localStorage;
    } catch (error) {
        console.warn('Browser storage is unavailable:', error);
        return null;
    }
};

export const getStoredItem = (key) => {
    const storage = getStorage();
    if (!storage) return null;

    try {
        return storage.getItem(key);
    } catch (error) {
        console.warn(`Unable to read "${key}" from browser storage:`, error);
        return null;
    }
};

export const setStoredItem = (key, value) => {
    const storage = getStorage();
    if (!storage) return;

    try {
        storage.setItem(key, value);
    } catch (error) {
        console.warn(`Unable to save "${key}" to browser storage:`, error);
    }
};

export const removeStoredItem = (key) => {
    const storage = getStorage();
    if (!storage) return;

    try {
        storage.removeItem(key);
    } catch (error) {
        console.warn(`Unable to remove "${key}" from browser storage:`, error);
    }
};
