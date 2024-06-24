import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class StringToArrayPipe implements PipeTransform {
    private ExecludePlants: string[] = [];
    private IncludePlants: string[] = [];

    transform(value: any, metadata: ArgumentMetadata) {
        for (let i in value) {
            if (this.ExecludePlants.includes(i)) continue

            if (this.IncludePlants.includes(i)) {
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