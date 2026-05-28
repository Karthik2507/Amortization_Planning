function logoutUser() {

    // Clear browser history state
    window.history.pushState(null, "", window.location.href);

    // Redirect to Flask logout route
    window.location.href = "/logout";
}


// Prevent browser back after logout
window.addEventListener("pageshow", function (event) {

    if (event.persisted) {
        window.location.reload();
    }

});