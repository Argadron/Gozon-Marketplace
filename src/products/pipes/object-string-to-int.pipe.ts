import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ObjectStringToIntPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        for (let i in value) {
            if (i === "filters") continue

            value[i] = Number.parseInt(value[i])
        }

        return value
    }
}