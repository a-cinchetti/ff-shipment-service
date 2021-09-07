import { CatalogueDoc} from "../models/Catalogue";


function copyFields(source: CatalogueDoc, dest: CatalogueDoc): CatalogueDoc {
    dest.departments = source.departments;
    dest.name = source.name;
    dest.available = source.available;

    return dest;
}

function checkRequiredFields(cata: CatalogueDoc): CatalogueDoc {
    if(cata.available === null || cata.available === undefined)
        cata.available = false;
    if(cata.name === null || cata.name === undefined || cata.name == "")
        cata.name = "Catalogo";
    return cata;
}

export { copyFields, checkRequiredFields }
