import express, { Request, Response } from 'express'
import { Catalogue } from '../models/Catalogue'
import {checkRequiredFields, copyFields} from '../services/catalogueService'
import {checkJwt} from '../utils/checjJWT';

const router = express.Router()

const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

router.get('/api/catalogue', checkJwt, async (req: Request, res: Response) => {
    const catalogue = await Catalogue.find({})
    return res.status(200).send(catalogue)
})

router.post('/api/catalogue', checkJwt, async (req: Request, res: Response) => {
    //create new catalogue
    const { storeId, name } = req.body;

    let catalogueId = uuidv1();
    let available = false;
    const catalogue = Catalogue.build({ catalogueId, storeId, name, available });
    await catalogue.save()
    return res.status(201).send(catalogue)
})

router.put('/api/catalogue/:catalogueId', checkJwt, async (req: Request, res: Response) => {
    //update catalogue
    const { storeId, departments, name, available } = req.body;

    let catalogueId = req.params.catalogueId;
    const newCatalogue = Catalogue.build({ catalogueId, storeId, departments, name, available });

    //TODO: get userID from token
    const userID = 'userID';

    let catalogue = await Catalogue.findOne({catalogueId: catalogueId});

    if(!catalogue)
        return res.status(404).send('catalogueId not found.');

    //TODO: verificare se l'utente può modificare questo catalogo
    //if( ! catalogue.users?.includes(userID) )
    //    return res.status(401).send('yuo are not authorized to update this document');

    catalogue = copyFields(newCatalogue, catalogue);
    catalogue = checkRequiredFields(catalogue);
    await catalogue.save()

    return res.status(200).send(catalogue)
})

export { router as catalogueRouter }
