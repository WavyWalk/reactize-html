import {ConversionOptions} from "./ConversionOptions";
import {ReactComponentElement} from "react";
import {HandlerResult} from "./HandlerResult";

export class ConvertOptionsBuilder {

    convertOptions: ConversionOptions = new ConversionOptions()


    blackListAttibutes(...attributes: Array<string>) {
        for (let attribute of attributes) {
            this.convertOptions.blackListedAttributes[attribute] = true
        }
        return this
    }

    whiteListAttributes(...attributeNames: Array<string>) {
        for (let attributeName of attributeNames) {
            this.convertOptions.whiteListedAttributes[attributeName] = true
        }
        return this
    }

    applyHandler(proc: (params: { [key: string]: any }, children: (Array<ReactComponentElement<any>> | ReactComponentElement<any> | null)) => HandlerResult | void) {
        this.convertOptions.userDefinedHandler = proc
        return this
    }

    get() {
        return this.convertOptions
    }

}


