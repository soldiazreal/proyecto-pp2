import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json([
    {
      id: 'M1',
      numero: 1,
      capacidad: 4
    },
    {
      id: 'M2',
      numero: 2,
      capacidad: 2
    }
  ]);
});

export default router;