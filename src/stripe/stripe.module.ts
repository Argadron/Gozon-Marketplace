import { DynamicModule, Module, Provider } from "@nestjs/common";
import { STRIPE_CLIENT } from "./constants";
import { Stripe } from "stripe";

@Module({})
export class StripeModule {
    static forRoot(apiKey: string, stripeConfig: Stripe.StripeConfig): DynamicModule {
        const stripe = new Stripe(apiKey, stripeConfig)

        const stripeProvider: Provider =  {
            provide: STRIPE_CLIENT,
            useValue: stripe
        }
        
        return {
            module: StripeModule,
            providers: [stripeProvider],
            exports: [stripeProvider],
            global: true
        }
    }
}