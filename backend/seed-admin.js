const baseUrl = 'http://localhost:5000/api/auth/register';

const adminData = {
    pharmacy_name: 'EasyPharma Principale',
    first_name: 'Admin',
    last_name: 'Principal',
    email: 'admin@easypharma.com',
    password: 'password'
};

async function createAdmin() {
    try {
        console.log(`Création de l'utilisateur ${adminData.email}...`);
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Succès !');
            console.log(data);
        } else {
            console.log(`Échec:`, data);
        }
    } catch (error) {
        console.log(`Erreur: ${error.message}`);
    }
}

createAdmin();
