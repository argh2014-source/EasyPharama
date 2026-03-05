const baseUrl = 'http://localhost:5000/api';
const email = 'admin@easypharma.com';
const passwords = ['admin', 'admin123', 'password', 'easypharma', '12345678', 'admin2026'];

async function testLogins() {
    for (const password of passwords) {
        try {
            console.log(`Trying ${email} / ${password}...`);
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('SUCCESS!');
                console.log('User:', JSON.stringify(data.user, null, 2));
                console.log('Token:', data.token);
                return;
            } else {
                console.log(`Failed: ${data.error || response.statusText}`);
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }
    console.log('No common passwords worked.');
}

testLogins();
