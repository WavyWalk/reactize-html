export class ChildNodesFromStringExtractor {
    static extract(rawHtml: string): Node {
        let sanitized = rawHtml.replace(/ +/g, ' ')
        let parser = new DOMParser()
        let parsedHtmlDocument = parser.parseFromString(sanitized, 'text/html')
        return parsedHtmlDocument.body
    }
}