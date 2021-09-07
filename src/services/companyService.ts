import { CompanyDoc} from "../models/Company";


function copyFields(source: CompanyDoc, dest: CompanyDoc): CompanyDoc {
    dest.businessName = source.businessName;
    dest.fiscalCode = source.fiscalCode;
    dest.partitaIva = source.partitaIva;
    dest.users = source.users;

    return dest;
}

function checkRequiredFields(comp: CompanyDoc): CompanyDoc {
    if(comp.users == null)
        comp.users = [];
    if(!comp.users.includes(comp.administratorUser))
        comp.users.push(comp.administratorUser);
    return comp;
}

export { copyFields, checkRequiredFields }
