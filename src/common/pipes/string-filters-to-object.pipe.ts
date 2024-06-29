import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectTypeParser } from "../../helpers/objectTypeParser";

@Injectable()
export class StringFiltersToObject implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value.filters) return 
 
        const array = value.filters.split("+")
        value.filter = {}

        for (let i in array) {
            const elem = array[i]

            const key = elem.split("=")[0]
            const elemValue = elem.split("=")[1]

            value.filter[`${key}`] = ObjectTypeParser(key, elemValue)
        }

        return value
    }
}