export class ReactTagNameFromNodeExtractor {
    private static reactSpecificTags: { [key: string]: string } = {
        '#text': 'span'
    }

    static extract(node: Node) {
        let nodeName = node.nodeName
        if (this.isProbablyCanonicalTagName(nodeName)) {
            nodeName = nodeName.toLowerCase()
        }
        return this.reactSpecificTags[nodeName] || nodeName
    }

    private static isProbablyCanonicalTagName(nodeName: string): boolean {
        return nodeName === nodeName.toUpperCase()
    }
}