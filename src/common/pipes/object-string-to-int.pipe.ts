import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

/**
 * This method parse request body string object to int object
 * Example: { id: "1", password: "123" } => { id: 1, password: 123 }
 */
@Injectable()
export class ObjectStringToIntPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        for (let i in value) {
            if (Number.isNaN(value[i]*50)) continue

            value[i] = Number.parseInt(value[i])
        }

        return value
    }
}