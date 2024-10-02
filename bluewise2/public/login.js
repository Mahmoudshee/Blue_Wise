document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const result = await response.json();

            if (response.ok) {
                if (result.success) {
                    if (result.role === 'researcher') {
                        window.location.href = '/researcher-dashboard';
                    } else if (result.role === 'fisherman') {
                        window.location.href = '/fish-dashboard';
                    }
                } else {
                    alert(result.error || 'Login failed, please try again.');
                }
            } else {
                alert('Server error. Please try again later.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('A network error occurred. Please try again later.');
        }
    });
});
