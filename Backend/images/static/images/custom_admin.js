/* Custom JS for MediWound AI Admin */

document.addEventListener('DOMContentLoaded', function () {
    // Target the "Add User" form specifically
    if (window.location.pathname.includes('/admin/auth/user/add/')) {
        const usernameInput = document.getElementById('id_username');
        const password1Input = document.getElementById('id_password1');
        const password2Input = document.getElementById('id_password2');

        if (usernameInput) {
            usernameInput.setAttribute('placeholder', 'e.g. dr.jason_smith');
        }
        if (password1Input) {
            password1Input.setAttribute('placeholder', 'Enter a strong password');
        }
        if (password2Input) {
            password2Input.setAttribute('placeholder', 'Confirm your password');
        }
    }
});
