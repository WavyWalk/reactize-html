// found and copied from https://greensock.com/forums/topic/14435-convert-css-string-to-object/

export class StyleToObjectConverter {
    static toCamelCase(aString: string) {
        return aString.replace(/^([A-Z])|[\s-](\w)/g, function(match, p1, p2, offset) {
            if (p2) return p2.toUpperCase();
            return p1.toLowerCase();
        });
    };

    static convert(css: string) {
        let frameCSS = css.replace(/(([\w-.]+)\s*[^;]+);?/g, '$1:$2,');
        frameCSS = frameCSS.replace(/,+$/, '');
        let properties = frameCSS.split(', ');
        let frameCSSObj: {[key:string]:any} = {};
        properties.forEach(function(property) {
            let cssProp = property.split(':');
            let cssKey = StyleToObjectConverter.toCamelCase(cssProp[0]);
            let cssValue = cssProp[1].trim();
            frameCSSObj[cssKey] = cssValue;
        });
        return frameCSSObj
    };
}