import * as React from 'react'
import {ReactChild, ReactElement, ReactDOM, ReactChildren} from "react";
import {NodeTypesEnum} from "./NodeTypesEnum";
import {ChildNodesFromStringExtractor} from "./ChildNodesFromStringExtractor";
import {ConversionConfiguration} from "./ConversionConfiguration";
import {ReactTagNameFromNodeExtractor} from "./ReactTagNameFromNodeExtractor";
import {ReactParamsFromNodeExtractor} from "./ReactParamsFromNodeExtractor";
import {ConversionConfigurationQueryObject} from "./ConversionConfigurationQueryObject";

export class HtmlToReactComponentsConverter {

    private readonly rootNode: Node | null = null
    private readonly conversionConfihuration: ConversionConfiguration
    private readonly conversionConfigurationQueryObject: ConversionConfigurationQueryObject

    private currentKey = 0

    private nextKey() {
        return `parsed${this.currentKey+=1}`
    }

    private constructor(rawHtml: string, conversionConfiguration: ConversionConfiguration | null = null) {
        this.rootNode = ChildNodesFromStringExtractor.extract(rawHtml)
        this.conversionConfihuration = conversionConfiguration || new ConversionConfiguration({})
        this.conversionConfigurationQueryObject = new ConversionConfigurationQueryObject(this.conversionConfihuration)
    }

    static convert(rawHtml: string, conversionSettings: ConversionConfiguration | null = null) {
        let converter = new HtmlToReactComponentsConverter(rawHtml, conversionSettings)
        if (converter.rootNode === null) {
            return null
        }
        return converter.createChildren(converter.rootNode)
    }

    private createChildren(node: Node): Array<ReactChild> | ReactChild | null {
        console.log('--------create-------children')
        console.dir(node)
        // is #text node
        if (this.isChildNodesEmpty(node)) {
            return node.nodeValue!
        }
        // e.g <p>foo</p>
        if (this.hasOnlyOneTextNode(node)) {
            return node.childNodes[0].nodeValue!
        }
        // in case if contains list of more than one children
        // will return a list of components
        let children = []
        for (let childNode of (node.childNodes as any as Array<Node>)) {
            let child = this.createReactComponent(childNode)
            if (child !== null) {
                children.push(child)
            }
        }
        return children
    }

    private isChildNodesEmpty(node: Node): boolean {
        return (node.childNodes.length === 0)
    }

    private createReactComponent(node: Node): ReactElement<any, any> | null {
        if (this.isEmptyTextNode(node)) {
            return null
        }

        let tagName = ReactTagNameFromNodeExtractor.extract(node)

        if (this.conversionConfigurationQueryObject.shouldBeIgnored(tagName)) {
            return null
        }

        let children = this.createChildren(node)
        let params = ReactParamsFromNodeExtractor.extract(node, tagName, this.conversionConfigurationQueryObject)

        params.key = this.nextKey()

        if (this.conversionConfigurationQueryObject.shouldUserDefinedHandlerBeApplied(tagName)) {
            let handlerResult = this.conversionConfigurationQueryObject.applyUserDefinedHandler(tagName, params, children as any)
            if (handlerResult.shouldIgnore) {
                return null
            } else if (handlerResult.paramsToReplaceWith) {
                params = handlerResult.paramsToReplaceWith
            } else if(handlerResult.componentToReplaceWith) {
                return handlerResult.componentToReplaceWith
            }
        }

        if (Array.isArray(children)) {
            return React.createElement(tagName, params, ...children)
        }
        return React.createElement(tagName, params, children)
    }


    private isEmptyTextNode(node: Node) {
        if (node.nodeType !== NodeTypesEnum.TEXT_NODE) {
            return false
        }
        if (node.nodeValue === null || node.nodeValue === '\n' || node.nodeValue === '\n ') {
            return true
        }
        return false
    }

    private hasOnlyOneTextNode(node: Node): boolean {
        if (node.childNodes.length !== 1) {
            return false
        }
        let childNode = node.childNodes[0]
        return (childNode.nodeType === NodeTypesEnum.TEXT_NODE)
    }
}

