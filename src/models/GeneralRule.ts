import {DiscountType} from "./DiscountType";

interface GeneralRule {
    value: number;
    discountType: DiscountType;
    min: number;
    max: number;
}

export {GeneralRule};