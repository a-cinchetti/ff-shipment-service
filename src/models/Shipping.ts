import mongoose from 'mongoose';
import {GeneralRule} from "./GeneralRule";
import {HourRule} from "./HourRule";
import {DiscountType} from "./DiscountType";

interface IShipping {
    shippingId: string;
    storeId: string;
    comune: string;
    available: boolean;
    free: boolean;
    pricingRules?: GeneralRule[];
    weightRules?: GeneralRule[];
    volumeRules?: GeneralRule[];
    hourRules?: HourRule[];

}

interface shippingModelInterface extends mongoose.Model<ShippingDoc> {
    build(attr: IShipping): ShippingDoc
}

interface ShippingDoc extends mongoose.Document {
    shippingId: string;
    storeId: string;
    comune: string;
    available: boolean;
    free: boolean;
    pricingRules?: GeneralRule[];
    weightRules?: GeneralRule[];
    volumeRules?: GeneralRule[];
    hourRules?: HourRule[];
}

const shippingSchema = new mongoose.Schema({
    shippingId: {
        type: String,
        required: true,
        unique: true,
    },
    storeId: {
        type: String,
        required: true,
        unique: false,
    },
    comune: {
        type: String,
        required: true,
        unique: false,
    },
    available: {
        type: Boolean,
        required: true,
        unique: false,
    },
    free: {
        type: Boolean,
        required: true,
        unique: false,
    },
    pricingRules: {
        type: Array,
        required: false,
        unique: false
    },
    weightRules: {
        type: Array,
        required: false,
        unique: false
    },
    volumeRules: {
        type: Array,
        required: false,
        unique: false
    },
    hourRules: {
        type: Array,
        required: false,
        unique: false
    }
})

shippingSchema.statics.build = (attr: IShipping) => {
    return new Shipping(attr)
}

const Shipping = mongoose.model<ShippingDoc, shippingModelInterface>('Shipping', shippingSchema, 'shippings')

Shipping.build({
    shippingId: 'a1b2c3',
    storeId: '1234567',
    comune: 'Casazza',
    available: true,
    free: false,
    pricingRules: [
        {
            value: 100,
            discountType: DiscountType.Absolute,
            min: 20,
            max: 30
        }
    ]
})

export { Shipping, IShipping, ShippingDoc }
