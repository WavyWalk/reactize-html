import {ReactChildren, ReactComponentElement} from "react";
import {HandlerResult} from "./HandlerResult";

export class ConversionOptions {

    blackListedAttributes: { [key: string]: boolean } = {}
    hasBalckListedAttributes: boolean = false
    whiteListedAttributes: { [key: string]: boolean } = {}
    hasWhiteListedAttributes: boolean = false

    userDefinedHandler: (
        (
            params: { [p: string]: any },
            children: (Array<React.ReactComponentElement<any>> | React.ReactComponentElement<any> | null)
        ) => HandlerResult | void
        ) | null = null
}