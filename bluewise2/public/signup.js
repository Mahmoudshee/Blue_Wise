document.addEventListener('DOMContentLoaded', function() {
    const signupButton = document.querySelector('.btn');
    
    signupButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.querySelector('input[name="role"]:checked');

        console.log(username);
        console.log(email);
        console.log(password);

        if (!role) {
            alert('Please select a role.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, role: role.value })
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Signup successful! You will be redirected to the login page.');
                window.location.href = 'http://127.0.0.1:3000/login.html';
            } else {
                alert(result.error || 'An error occurred during signup.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('A network error occurred. Please try again later.');
        }
    });
});
