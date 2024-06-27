import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class EmptyStringDeletorPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        for (let i in value) {
            if (value[i] === "") delete value[i]
        }

        return value
    }
}