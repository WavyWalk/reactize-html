import * as React from 'react'
import {NodeFilters} from "./NodeFilters";
import {ReactComponentElement, ReactDOM} from "react";
import {NodeTypesEnum} from "./NodeTypesEnum";
import {ChildNodesFromStringExtractor} from "./ChildNodesFromStringExtractor";
import {ConversionSettings, ReactParamsFromNodeExtractor, ReactTagNameFromNodeExtractor} from "./ConversionSettings";

export class HtmlToReactComponentsConverter {

    private readonly rootNode: Node | null = null
    private readonly conversionSettings: ConversionSettings | null

    private currentKey = 0

    private nextKey() {
        return `parsed${this.currentKey+=1}`
    }

    constructor(rawHtml: string, transformationOptions?: ConversionSettings) {
        this.rootNode = ChildNodesFromStringExtractor.extract(rawHtml)
        this.conversionSettings = transformationOptions || null
    }

    getReactComponents() {
        if (this.rootNode === null) {
            return null
        }
        return this.createChildren(this.rootNode)
    }

    private createChildren(node: Node): Array<ReactComponentElement<any, any>> | ReactComponentElement<any, any> | string | null {
        // is #text node
        if (this.isChildNodesEmpty(node)) {
            return node.nodeValue
        }
        // e.g <p>foo</p>
        if (this.hasOnlyOneTextNode(node)) {
            return node.childNodes[0].nodeValue
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

    private createReactComponent(node: Node): ReactComponentElement<any, any> | null {
        if (this.isEmptyTextNode(node)) {
            return null
        }
        if (this.nodeHasBlacklistedTag(node)) {
            return null
        }

        let tagName = ReactTagNameFromNodeExtractor.extract(node)
        let children = this.createChildren(node)
        let params = ReactParamsFromNodeExtractor.extract(node)

        params.key = this.nextKey()

        if (Array.isArray(children)) {
            return React.createElement(tagName, params, ...children)
        }
        return React.createElement(tagName, params, children)
    }

    private nodeHasBlacklistedTag(node: Node): boolean {
        if (this.conversionSettings === null) {
            return false
        }
        let nodeName = node.nodeName.toLowerCase()
        let transformatorForNode = this.conversionSettings.convertOptions[nodeName]
        if (transformatorForNode !== undefined) {
            for (let transformator of transformatorForNode) {
                if (transformator.blackListedTags[nodeName] === true) {
                    return true
                }
            }
        }
        return false
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
        if (childNode.nodeType !== NodeTypesEnum.TEXT_NODE) {
            return false
        }
        return true
    }
}

