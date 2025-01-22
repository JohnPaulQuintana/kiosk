import Swal from "sweetalert2";

/**
 * Handles user logout with a SweetAlert notification.
 * @param {string} redirectUrl - The URL to redirect after logout (default: "/login").
 */
export const handleLogoutNotification = (redirectUrl = "/login") => {
  Swal.fire({
    title: "Logging out...",
    text: "You will be redirected shortly.",
    icon: "info",
    timer: 2000, // Display for 2 seconds
    showConfirmButton: false, // No button
    allowOutsideClick: false, // Prevent outside clicks
    didClose: () => {
      // Clear token and redirect after notification
      localStorage.removeItem("authToken");
      window.location.href = redirectUrl;
    },
  });
};
