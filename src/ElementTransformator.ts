export class ElementTransformator {

}

interface ITransformator {
    [key: string]: {
        shouldRemove: (node: Node)=>boolean
    }
}

class TransformationBuilder {

    transformations: Array<any>

    processedNode!: Node

    constructor(){
        this.transformations = []
    }

    removeIfTagIs(tagName: String) {
        if (this.processedNode.nodeName === tagName) {
            return true
        }
        return false
    }

    removeIfTagIsIn(tagNames: Array<String>) {
        let tagName = this.processedNode.nodeName
        for (let tagName of tagNames) {
            if (tagNames.indexOf(tagName)) {
                return true
            }
        }
        return false
    }



}