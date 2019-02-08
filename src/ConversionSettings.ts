import {ReactComponentElement} from "react";

export class ConversionSettings {

    convertOptions: {[key:string]:Array<ConvertOptionsBuilder>}

    constructor(options: {[key:string]:Array<ConvertOptionsBuilder>}) {
        this.convertOptions = options
    }
}

interface ITransformator {
    [key: string]: {
        shouldRemove: (node: Node)=>boolean
    }
}

// this is supposed to be a fluent builder of filters, and transformators of
// rootNode and elements parsed from a raw HTML string.
// it adds specific for each type
// basically want some api like
// {
//     div: (new ConvertOptionsBuilder())
//         .blackListTags("p")
//         .whitelistTags("div", "h1")
//         .ifHasId("someId")
//         .ifHasClassName("className")
//         .addChildren([...])
//         .addParams({foo: bar})
//         .blackListAttibutes("foo")
//         .addClassName("joe")
//         .ignoreNode()
//         etc
//
// }
class ConvertOptionsBuilder {

    nodeBeingProcessed!: Node
    paramsBeingProcessed: any
    childrenBeingProcessed!: Array<ReactComponentElement<any, any>>

    transformations: Array<any>

    blackListedTags: {[key: string]: boolean} = {}
    whiteListedTags: {[key:string]: boolean} = {}

    blackListedAttributes: {[key: string]: boolean} = {}
    whiteListedAttributes: {[key: string]: boolean} = {}

    blacklistIfConditions: ((params: any, node: Node, children: any)=>boolean) | null = null

    applyTransformationsConditions: Array<any>


    private attributesToRemove: {[key: string]: boolean} | null = null
    private removeByTag: {[key: string]: boolean} | null = null

    constructor(){
        this.applyTransformationsConditions = []
        this.transformations = []
    }

    blackListIfTags(...tagNames: Array<string>) {
        for (let tagName in tagNames) {
            this.blackListedTags[tagName] = true
        }
        return this
    }

    blackListAttibutes(...attributes: Array<string>) {
        for (let attribute of attributes) {
            this.blackListedAttributes[attribute] = true
        }
        return this
    }

    whiteListTags(...tagNames: Array<string>) {
        for (let tagName of tagNames) {
            this.whiteListedTags[tagName] = true
        }
        return this
    }

    whiteListAttributes(...attributeNames: Array<string>) {
        for (let attributeName of attributeNames) {
            this.whiteListedAttributes[attributeName] = true
        }
        return this
    }



}

export class ReactTagNameFromNodeExtractor {
    private static reactSpecificTags: {[key:string]: string} = {
        '#text': 'span'
    }

    static extract(node: Node) {
        var nodeName = node.nodeName
        if (this.isCanonicalTagName(nodeName)) {
            nodeName = nodeName.toLowerCase()
        }
        return this.reactSpecificTags[nodeName] || nodeName
    }

    private static isCanonicalTagName(nodeName: string): boolean {
        return nodeName === nodeName.toUpperCase()
    }
}

export class ReactParamsFromNodeExtractor {
    private static reactSpecificAttributes: {[key:string]:string} = {
        "class": "className",
        "tabindex": "tabIndex"
    }

    static extract(node: Node | Element): {[key: string]: any} {
        let paramsToReturn:{[key:string]:string} = {}
        let attributes = (node as Element).attributes
        if (attributes === undefined || attributes.length === 0) {
            return paramsToReturn
        }
        for (let attr of attributes as any as Array<Attr>) {
            let key = this.transformAttributeNameToReactSpecific(attr.name)
            if (this.shouldBeSkipped(key)) {
                continue
            }
            let value = attr.value
            paramsToReturn[key] = value
        }
        return paramsToReturn
    }

    private static transformAttributeNameToReactSpecific(name: string): string {
        return this.reactSpecificAttributes[name] || name
    }

    private static shouldBeSkipped(attributeName: string): boolean {
        if (attributeName === 'style') {
            return true
        }
        return false;
    }
}