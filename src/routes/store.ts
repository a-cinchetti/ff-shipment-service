import express, { Request, Response } from 'express'
import { Store } from '../models/Store'
import {checkJwt} from '../utils/checjJWT';

const router = express.Router()

router.get('/api/store', checkJwt, async (req: Request, res: Response) => {
    const store = await Store.find({})
    return res.status(200).send(store)
})

router.post('/api/store', async (req: Request, res: Response) => {
    const { storeId, shopSign, companyId, stato, regione, provincia, comune, via, civico, cap, latitudine, longitudine, deliveryOpt } = req.body;

    const store = Store.build({ storeId, shopSign, companyId, stato, regione, provincia, comune, via, civico, cap, latitudine, longitudine, deliveryOpt })
    await store.save()
    return res.status(201).send(store)
})

export { router as storeRouter }
