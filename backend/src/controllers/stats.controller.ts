import { Request, Response } from 'express';
import pool from '../db';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        // 1. Daily Revenue & Sales Count
        const dailyStats = await pool.query(
            `SELECT 
                COALESCE(SUM(total_amount), 0) as daily_revenue,
                COUNT(*) as daily_sales_count
             FROM sales 
             WHERE pharmacy_id = $1 
             AND created_at >= CURRENT_DATE`,
            [pharmacyId]
        );

        // 2. Low Stock Count
        const lowStockStats = await pool.query(
            `SELECT COUNT(*) as low_stock_count
             FROM medications
             WHERE pharmacy_id = $1 
             AND stock_quantity <= min_stock_level`,
            [pharmacyId]
        );

        // 3. Weekly Sales (Last 7 days)
        const weeklySales = await pool.query(
            `SELECT 
                TO_CHAR(date_trunc('day', created_at), 'DD/MM') as sale_date,
                SUM(total_amount) as amount
             FROM sales
             WHERE pharmacy_id = $1
             AND created_at >= CURRENT_DATE - INTERVAL '7 days'
             GROUP BY date_trunc('day', created_at)
             ORDER BY date_trunc('day', created_at) ASC`,
            [pharmacyId]
        );

        // 4. Alerts (Low stock products)
        const stockAlerts = await pool.query(
            `SELECT brand_name, dci, stock_quantity, min_stock_level
             FROM medications
             WHERE pharmacy_id = $1 
             AND stock_quantity <= min_stock_level
             LIMIT 5`,
            [pharmacyId]
        );

        // 5. Expiry Alerts (Expiring in next 30 days)
        const expiryAlerts = await pool.query(
            `SELECT m.brand_name, ib.batch_number, ib.expiration_date
             FROM inventory_batches ib
             JOIN medications m ON ib.medication_id = m.id
             WHERE m.pharmacy_id = $1
             AND ib.expiration_date <= CURRENT_DATE + INTERVAL '30 days'
             AND ib.quantity > 0
             ORDER BY ib.expiration_date ASC
             LIMIT 5`,
            [pharmacyId]
        );

        res.json({
            summary: {
                dailyRevenue: parseFloat(dailyStats.rows[0].daily_revenue),
                dailySalesCount: parseInt(dailyStats.rows[0].daily_sales_count),
                lowStockCount: parseInt(lowStockStats.rows[0].low_stock_count),
                patientsServed: dailyStats.rows[0].daily_sales_count // Proxy for patients
            },
            weeklySales: weeklySales.rows,
            alerts: {
                stock: stockAlerts.rows,
                expiry: expiryAlerts.rows
            }
        });

    } catch (error) {
        console.error('Erreur getDashboardStats:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};
