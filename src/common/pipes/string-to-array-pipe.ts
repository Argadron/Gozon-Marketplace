import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

/**
 * This pipe parse query string to array.
 * Example: "test=["hello!", "world"]" => ["hello", "world"]
 * Include - plants need to transform
 * Execlude - skip this plants 
 * Use: new StringToArrayPipe().Include(["test"])
 */
@Injectable()
export class StringToArrayPipe implements PipeTransform {
    private ExecludePlants: string[] = [];
    private IncludePlants: string[] = [];

    transform(value: any, metadata: ArgumentMetadata) {
        for (let i in value) {
            if (this.ExecludePlants.includes(i)) continue

            if (this.IncludePlants.includes(i)) {
                if (!value[i]?.split) continue

                value[i] = value[i].split(",")
            }
        }
        
        return value
    }

    public Execlude(data: string[]=[]) {
        this.ExecludePlants = data
        return this
    }

    public Include(data: string[]=[]) {
        this.IncludePlants = data 
        return this
    }
}