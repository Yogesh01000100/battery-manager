import { Router } from 'express';
import { createBatteryData, getBatteryData, getBatteryFieldData } from '../controllers/manager';

const router = Router();

router.post('/data', createBatteryData);
router.get('/:id', getBatteryData);
router.get('/:id/:field', getBatteryFieldData);

export default router;
