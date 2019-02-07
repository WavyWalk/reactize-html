export class ElementPreparator {
    static prepare(rawHtml: string): NodeListOf<ChildNode> {
        let parser = new DOMParser()
        let parsedHtmlDocument = parser.parseFromString(rawHtml, 'text/html')
        let bodyNodes = parsedHtmlDocument.body.childNodes
        return bodyNodes
    }
}