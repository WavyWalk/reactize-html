import {NodeTypesEnum} from "./NodeTypesEnum";

export class NodeFilters {

    static isEmptyTextNode(node: Node): boolean {
        return (
            node.nodeType === NodeTypesEnum.TEXT_NODE
            && node.textContent === '/n'
        )
    }

}