import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
    const resultado = await query('SELECT NOW() AS hora');
    res.json({status: 'ok', baseDeDatos: 'conectada', hora:resultado.rows[0].hora});
});

export default router;
