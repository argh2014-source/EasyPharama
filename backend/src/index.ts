import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import medicationRoutes from './routes/medication.routes';
import inventoryRoutes from './routes/inventory.routes';
import saleRoutes from './routes/sale.routes';
import patientRoutes from './routes/patient.routes';
import supplierRoutes from './routes/supplier.routes';

dotenv.config();

// Vérification stricte des variables d'environnement cruciales
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter(envVar => !process.env[envVar]);

if (missingEnv.length > 0) {
    console.error(`❌ ERREUR CRITIQUE: Les variables d'environnement suivantes sont manquantes : ${missingEnv.join(', ')}`);
    console.error(`ℹ️ Assurez-vous de les ajouter dans Vercel (Settings > Environment Variables) ou dans votre fichier .env local.`);
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/suppliers', supplierRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'EasyPharma API is running' });
});

// Pour fonctionner en tant que fonction Serverless sur Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
