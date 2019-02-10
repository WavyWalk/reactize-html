import {ConversionOptions} from "./ConversionOptions";
import {element} from "prop-types";


 interface IConvertOptionsObject {
    [id:string]: ConversionOptions | Array<string> | {[key:string]:boolean} | undefined
    blacklistedTags?: Array<string> | ConversionOptions | {[key:string]:boolean}
    whitelistedTags?: Array<string> | ConversionOptions | {[key:string]:boolean}
}

export class ConversionConfiguration {

    readonly convertOptions: IConvertOptionsObject

    constructor(convertOptions: IConvertOptionsObject) {
        if (convertOptions.blacklistedTags && Array.isArray(convertOptions.blacklistedTags)) {
            convertOptions.blacklistedTags = this.mapToObect(convertOptions.blacklistedTags)
        }
        if (convertOptions.whitelistedTags && Array.isArray(convertOptions.whitelistedTags)) {
            convertOptions.whitelistedTags = this.mapToObect(convertOptions.whitelistedTags)
        }
        this.convertOptions = convertOptions
    }

    private mapToObect(ary: Array<string>): {[key:string]:boolean} {
        let object:{[key:string]:boolean} = {}
        for (const element of ary) {
            object[element] = true
        }
        return object
    }
}



