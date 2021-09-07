import express, { Request, Response } from 'express'
import { Company } from '../models/Company'
import {checkRequiredFields, copyFields} from '../services/companyService'
import {checkJwt} from '../utils/checjJWT';
import jwt_decode from "jwt-decode";

const router = express.Router()

const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

router.get('/api/company', checkJwt, async (req: Request, res: Response) => {
    const company = await Company.find({})
    return res.status(200).send(company)
})

router.post('/api/company', checkJwt, async (req: Request, res: Response) => {
    //create new company
    const { partitaIva, fiscalCode, businessName } = req.body;

    const token = jwt_decode(req.headers?.authorization?.split(" ")[1] || '');
    const userId = ((token as any)['sub'].split('|')[1]) as string;

    let administratorUser = 'userID';
    let users = [administratorUser];

    let companyId = uuidv1();
    const company = Company.build({ companyId, partitaIva, fiscalCode, businessName, users, administratorUser });
    await company.save()
    return res.status(201).send(company)
})

router.put('/api/company/:companyId', checkJwt, async (req: Request, res: Response) => {
    //update company
    const { partitaIva, fiscalCode, businessName, users, administratorUser } = req.body;

    let companyId = req.params.companyId;
    const newCompany = Company.build({ companyId, partitaIva, fiscalCode, businessName, users, administratorUser });

    //TODO: get userID from token
    const userID = 'userID';

    //scommentare se si vuole impedire che un utente si tolga dagli users di una company
    /*if( ! newCompany.users?.includes(userID) )
        return res.status(409 ).send('current user is not included in \'user\' field.');*/

    let company = await Company.findOne({companyId: companyId});

    if(!company)
        return res.status(404).send('companyId not found.');

    if( ! company.users?.includes(userID) )
        return res.status(401).send('yuo are not authorized to update this document');

    company = copyFields(newCompany, company);
    company = checkRequiredFields(company);
    await company.save()

    return res.status(200).send(company)
})

export { router as companyRouter }
