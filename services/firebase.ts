
// Firebase integration has been disabled.
// The share feature now uses local state or serverless URL generation if needed.

export const saveSharedList = async (profile: any, gifts: any[]): Promise<string> => {
    console.warn("Firebase is disabled.");
    return "";
};

export const getSharedList = async (id: string): Promise<any | null> => {
    console.warn("Firebase is disabled.");
    return null;
};
