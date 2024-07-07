import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ExcessPlantsValidatorPipe implements PipeTransform {
    private type: any = {};

    transform(value: any, metadata: ArgumentMetadata) {
        if (!this.type || typeof(value) !== "object" || value["role"]) return value; 
    
        const keys = Object.keys(plainToInstance(this.type, {}))
       
        Object.keys(value).forEach(elem => {
            if (!keys.includes(elem)) throw new BadRequestException(`Plant ${elem} is not in dto`)
        }) 

        return value
    }

    public setType<T>(type: T) {
        this.type = type 
        return this
    }
}