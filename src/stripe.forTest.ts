import config from '@config/constants'
import Stripe from "stripe";

const constants = config()

let stripe: Stripe;

export default () => {
    return stripe ? stripe : new Stripe(constants.STRIPE_API_KEY, { apiVersion: "2024-06-20" })
}