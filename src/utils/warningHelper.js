import Swal from "sweetalert2";

/**
 * Handles user logout with a SweetAlert notification.
 * @param {string} redirectUrl - The URL to redirect after logout (default: "/login").
 */
export const handleNotification = (redirectUrl = "/login", title, message) => {
  Swal.fire({
    title: title,
    text: message,
    icon: "info",
    timer: 2000, // Display for 2 seconds
    showConfirmButton: false, // No button
    allowOutsideClick: false, // Prevent outside clicks
    didClose: () => {
      window.location.href = redirectUrl;
    },
  });
};
