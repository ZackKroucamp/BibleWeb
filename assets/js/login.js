document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById('username-input').value.trim();
        const password = document.getElementById('password-input').value;

        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }

        try {
            const response = await fetch('/bibleweb/api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (result.success) {
                location.reload(); // Reload to show main UI
            } else {
                alert(result.message || 'Invalid credentials.');
            }
        } catch (error) {
            console.error(error);
            alert('Server error. Please try again later.');
        }
    });
});
