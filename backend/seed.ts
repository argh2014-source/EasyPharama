import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/(\?|&)sslmode=require/i, '') : undefined;

const pool = new Pool(
    connectionString
        ? {
              connectionString,
              ssl: { rejectUnauthorized: false }
          }
        : {
              user: process.env.DB_USER,
              host: process.env.DB_HOST,
              database: process.env.DB_NAME,
              password: process.env.DB_PASSWORD,
              port: parseInt(process.env.DB_PORT || '5432', 10),
              ssl: { rejectUnauthorized: false }
          }
);

const sample = <T>(arr: T[]): T | null => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const suppliersData = [
    { name: 'Laborex Sénégal', phone: '+221 77 123 45 67', email: 'contact@laborex.sn', address: 'Dakar, Sénégal' },
    { name: 'Sodic', phone: '+221 76 987 65 43', email: 'info@sodic.sn', address: 'Pikine, Sénégal' },
    { name: 'Copharma', phone: '+221 70 456 12 30', email: 'commandes@copharma.sn', address: 'Rufisque, Sénégal' },
    { name: 'UBIPHARM', phone: '+221 78 555 11 22', email: 'contact@ubipharm.sn', address: 'Dakar, Sénégal' },
];

const insurancesData = [
    { company_name: 'NSIA', coverage_rate: 80 },
    { company_name: 'Allianz', coverage_rate: 100 },
    { company_name: 'AXA', coverage_rate: 80 },
    { company_name: 'Sanlam', coverage_rate: 50 },
    { company_name: 'Wafa Assurance', coverage_rate: 80 },
];

const medicationsData = [
    { name: 'Paracétamol 500mg', dci: 'Paracétamol', category: 'Antalgique', selling_price: 500, purchase_price: 200, dosage_form: 'Comprimé', dosage: '500mg' },
    { name: 'Amoxicilline 1g', dci: 'Amoxicilline', category: 'Antibiotique', selling_price: 2000, purchase_price: 1200, dosage_form: 'Gélule', dosage: '1g' },
    { name: 'Ibuprofène 400mg', dci: 'Ibuprofène', category: 'Anti-inflammatoire', selling_price: 1500, purchase_price: 800, dosage_form: 'Gélule', dosage: '400mg' },
    { name: 'Doliprane 1000mg', dci: 'Paracétamol', category: 'Antalgique', selling_price: 1200, purchase_price: 500, dosage_form: 'Comprimé', dosage: '1000mg' },
    { name: 'Smecta', dci: 'Diosmectite', category: 'Gastro-entérologie', selling_price: 3000, purchase_price: 1800, dosage_form: 'Sachet', dosage: '3g' },
    { name: 'Efferalgan 500mg', dci: 'Paracétamol', category: 'Antalgique', selling_price: 1000, purchase_price: 400, dosage_form: 'Comprimé effervescent', dosage: '500mg' },
    { name: 'Meteospasmyl', dci: 'Alvérine', category: 'Antispasmodique', selling_price: 3500, purchase_price: 2000, dosage_form: 'Capsule', dosage: '60mg' },
    { name: 'Fervex', dci: 'Paracétamol composé', category: 'Antirhume', selling_price: 2500, purchase_price: 1300, dosage_form: 'Sachet', dosage: 'Adulte' },
    { name: 'Gaviscon', dci: 'Alginate de sodium', category: 'Anti-acide', selling_price: 4000, purchase_price: 2500, dosage_form: 'Sirop', dosage: 'Flacon 250ml' },
    { name: 'Aspirine 500mg', dci: 'Acide acétylsalicylique', category: 'Antalgique', selling_price: 800, purchase_price: 300, dosage_form: 'Comprimé', dosage: '500mg' },
    { name: 'Clamoxyl 500mg', dci: 'Amoxicilline', category: 'Antibiotique', selling_price: 1800, purchase_price: 900, dosage_form: 'Gélule', dosage: '500mg' },
    { name: 'Spasfon', dci: 'Phloroglucinol', category: 'Antispasmodique', selling_price: 2200, purchase_price: 1100, dosage_form: 'Comprimé', dosage: '80mg' },
    { name: 'Vogalène', dci: 'Métopimazine', category: 'Antiémétique', selling_price: 2800, purchase_price: 1500, dosage_form: 'Lyophilisat', dosage: '7.5mg' },
    { name: 'Aerius', dci: 'Desloratadine', category: 'Antihistaminique', selling_price: 4500, purchase_price: 2800, dosage_form: 'Comprimé', dosage: '5mg' },
    { name: 'Maxilase', dci: 'Alpha-amylase', category: 'Anti-inflammatoire ORL', selling_price: 3200, purchase_price: 1800, dosage_form: 'Sirop', dosage: '20000 U.CEIP' },
    { name: 'Ciprofloxacine 500mg', dci: 'Ciprofloxacine', category: 'Antibiotique', selling_price: 3500, purchase_price: 1600, dosage_form: 'Comprimé', dosage: '500mg' },
    { name: 'Coartem', dci: 'Artéméther + Luméfantrine', category: 'Antipaludéen', selling_price: 1500, purchase_price: 500, dosage_form: 'Comprimé', dosage: '20/120' },
    { name: 'Mebendazole', dci: 'Mebendazole', category: 'Antiparasitaire', selling_price: 500, purchase_price: 150, dosage_form: 'Comprimé', dosage: '100mg' },
    { name: 'Bétadine Jaune', dci: 'Povidone iodée', category: 'Antiseptique', selling_price: 2000, purchase_price: 1000, dosage_form: 'Solution', dosage: '10%' },
];

const patientsData = [
    { first_name: 'Awa', last_name: 'Diallo', phone: '771234567', address: 'Dakar Plateau' },
    { first_name: 'Moussa', last_name: 'Faye', phone: '769876543', address: 'Guediawaye' },
    { first_name: 'Khadija', last_name: 'Sy', phone: '704561230', address: 'Saint-Louis' },
    { first_name: 'Cheikh', last_name: 'Bâ', phone: '785551122', address: 'Thiès' },
    { first_name: 'Aminata', last_name: 'Touré', phone: '773334455', address: 'Mermoz' },
    { first_name: 'Ousmane', last_name: 'Sonko', phone: '764445566', address: 'Ziguinchor' },
    { first_name: 'Mariama', last_name: 'Sow', phone: '701112233', address: 'Dakar' },
    { first_name: 'Abdoulaye', last_name: 'Fall', phone: '775556677', address: 'Dakar' },
];

async function seed() {
    console.log('🌱 Starting database seed for EasyPharma...');
    try {
        const pharmacyRes = await pool.query('SELECT id FROM pharmacies LIMIT 1');
        if (pharmacyRes.rows.length === 0) {
            console.error('❌ No pharmacy found.');
            process.exit(1);
        }
        const pharmacyId = pharmacyRes.rows[0].id;

        const usersRes = await pool.query('SELECT id, role FROM users WHERE pharmacy_id = $1', [pharmacyId]);
        const cashier = usersRes.rows.find(u => u.role === 'CASHIER') || usersRes.rows[0];

        // 1. Suppliers
        console.log('📦 Inserting suppliers...');
        const suppliers: any[] = [];
        for (const s of suppliersData) {
            const res = await pool.query(
                `INSERT INTO suppliers (pharmacy_id, name, phone, email, address) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [pharmacyId, s.name, s.phone, s.email, s.address]
            );
            suppliers.push(res.rows[0]);
        }

        // 2. Insurances
        console.log('🛡️ Inserting insurances...');
        const insurances: any[] = [];
        for (const i of insurancesData) {
            const res = await pool.query(
                `INSERT INTO insurances (pharmacy_id, company_name, coverage_rate) 
                 VALUES ($1, $2, $3) RETURNING id`,
                [pharmacyId, i.company_name, i.coverage_rate]
            );
            insurances.push(res.rows[0]);
        }

        // 3. Medications
        console.log('💊 Inserting medications...');
        const meds: any[] = [];
        for (const m of medicationsData) {
            const supplierId = (sample(suppliers) as any).id;
            const stockQty = randomInt(50, 400);
            const res = await pool.query(
                `INSERT INTO medications (pharmacy_id, name, dci, category, dosage_form, dosage, purchase_price, selling_price, stock_quantity, supplier_id) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, selling_price`,
                [pharmacyId, m.name, m.dci, m.category, m.dosage_form, m.dosage, m.purchase_price, m.selling_price, stockQty, supplierId]
            );
            meds.push(res.rows[0]);
        }

        // 4. Patients
        console.log('🏥 Inserting patients...');
        const patients: any[] = [];
        for (const p of patientsData) {
            const insuranceId = Math.random() > 0.4 ? (sample(insurances) as any).id : null;
            const res = await pool.query(
                `INSERT INTO patients (pharmacy_id, first_name, last_name, phone, address, insurance_id) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                [pharmacyId, p.first_name, p.last_name, p.phone, p.address, insuranceId]
            );
            patients.push(res.rows[0]);
        }

        // 5. Sales
        console.log('💰 Generating 100 sales over the last 30 days...');
        const now = new Date();
        for (let i = 0; i < 100; i++) {
            const saleDate = new Date(now.getTime() - randomInt(0, 30) * 24 * 60 * 60 * 1000);
            const patientId = Math.random() > 0.5 ? (sample(patients) as any).id : null;
            const paymentMethod = sample(['CASH', 'MOBILE_MONEY', 'CARDS']) || 'CASH';
            
            // Random items
            const numItems = randomInt(1, 4);
            let totalAmount = 0;
            const items = [];
            for (let j = 0; j < numItems; j++) {
                const med = sample(meds) as any;
                const qty = randomInt(1, 3);
                const subtotal = qty * parseFloat(med.selling_price);
                totalAmount += subtotal;
                items.push({ medId: med.id, qty, price: med.selling_price, subtotal });
            }

            const saleRes = await pool.query(
                `INSERT INTO sales (pharmacy_id, user_id, patient_id, total_amount, payment_method, created_at) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                [pharmacyId, cashier.id, patientId, totalAmount, paymentMethod, saleDate]
            );
            const saleId = saleRes.rows[0].id;

            for (const item of items) {
                await pool.query(
                    `INSERT INTO sale_items (sale_id, medication_id, quantity, unit_price, subtotal) 
                     VALUES ($1, $2, $3, $4, $5)`,
                    [saleId, item.medId, item.qty, item.price, item.subtotal]
                );
            }
        }

        console.log('✅ Base de données initialisée avec succès !');
    } catch (err) {
        console.error('❌ Error during seeding:', err);
    } finally {
        await pool.end();
    }
}

seed();
