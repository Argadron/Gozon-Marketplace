import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class OptionalValidatorPipe implements PipeTransform {
    private plants: string[] = [];

    transform(value: any, metadata: ArgumentMetadata) {
        if (this.plants.length < 2) throw new Error("Optional Validator: Must 2 plants to use pipe")

        let check = false;

        for (let i in value) {
            if (value[i] === "") continue

            if (this.plants.includes(i)) check = true
        }

        if (!check && !value["role"]) throw new BadRequestException("One of optional plants must be writed")

        return value
    }

    public check(plants: string[]) {
        this.plants = plants
        return this
    }
}