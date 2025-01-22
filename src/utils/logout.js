// src/utils/logout.js

export const logout = async (apiEndpoint, token) => {
    try {
        if (token) {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("User logged out successfully from server");
            } else {
                const errorData = await response.json();
                console.error("Logout failed:", errorData.message || "Unknown error");
            }
        } else {
            console.warn("No token found in localStorage");
        }
    } catch (error) {
        console.error("Logout error:", error.message);
    } finally {
        // Clear token and redirect logic is handled separately
        return true; // Return a flag to indicate token cleanup
    }
};
