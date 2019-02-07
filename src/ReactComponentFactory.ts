import * as React from 'react'
import {NodeFilters} from "./NodeFilters";
import {ReactComponentElement} from "react";
import {NodeTypesEnum} from "./NodeTypesEnum";

export class ReactComponentFactory {
    
    transformers: Array<any>
    
    constructor(transformers: Array<any> = []){
        this.transformers = transformers
    }
    
    
    produceReactComponent(node: Node){
        let childNodes = this.parseChildNodes(node)
    }

    parseChildNodes(node: Node): NodeListOf<ChildNode> | null {
        let childNodes = node.childNodes
        if (childNodes.length == 0) {
            return null
        }
        this.filterChildNodes(childNodes)
    }

    createReactComponent(node: Node, children: Array<ReactComponentElement<any, any>> | null) {
        React.createElement(
            this.produceReactComponentTagName(node),
            this.produceProps(node)
        )
    }

    produceProps(node: Node) {
        let params = {}

        return params
    }

    filterChildNodes(nodes: NodeListOf<Node>){
        for (let node of nodes as any as Array<Node>) {
            if (NodeFilters.isEmptyTextNode(node)) {

            }
        }
    }
    
    produceReactComponentTagName(node: Node): string {
        if (node.nodeType === NodeTypesEnum.TEXT_NODE) {
            return 'span'
        }
        return node.nodeName
    }

}