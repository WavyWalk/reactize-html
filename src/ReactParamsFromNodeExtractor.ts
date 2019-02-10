import {ConversionConfigurationQueryObject} from "./ConversionConfigurationQueryObject";
import {StyleToObjectConverter} from "./StyleToObjectConverter";

export class ReactParamsFromNodeExtractor {
    private static reactSpecificAttributes: { [key: string]: string } = {
        "class": "className",
        "acceptcharset":"acceptCharset","accesskey":"accessKey","allowfullscreen":"allowFullScreen",
        "autocomplete":"autoComplete","autofocus":"autoFocus","autoplay":"autoPlay","cellpadding":"cellPadding",
        "cellspacing":"cellSpacing","charset":"charSet","classid":"classID", "colspan":"colSpan",
        "contenteditable":"contentEditable","contextmenu":"contextMenu","controlslist":"controlsList",
        "crossorigin":"crossOrigin","datetime":"dateTime","enctype":"encType","formaction":"formAction",
        "formenctype":"formEncType","formmethod":"formMethod","formnovalidate":"formNoValidate",
        "formtarget":"formTarget","frameborder":"frameBorder","hreflang":"hrefLang","htmlfor":"htmlFor",
        "httpequiv":"httpEquiv","inputmode":"inputMode","keyparams":"keyParams","keytype":"keyType",
        "marginheight":"marginHeight","marginwidth":"marginWidth","maxlength":"maxLength","mediagroup":"mediaGroup",
        "minlength":"minLength","novalidate":"noValidate","radiogroup":"radioGroup","readonly":"readOnly",
        "rowspan":"rowSpan","spellcheck":"spellCheck","srcdoc":"srcDoc","srclang":"srcLang","srcset":"srcSet",
        "tabindex":"tabIndex","usemap":"useMap"
    }

    static extract(node: Node | Element, tagName: string, convertOptionsQueryObject: ConversionConfigurationQueryObject): { [key: string]: any } {
        let paramsToReturn: { [key: string]: any } = {}
        let attributes = (node as Element).attributes
        if (attributes === undefined || attributes.length === 0) {
            return paramsToReturn
        }
        for (let attr of attributes as any as Array<Attr>) {
            let attributeName = this.transformAttributeNameToReactSpecific(attr.name)
            if (convertOptionsQueryObject.shouldAttributeBeSkipped(tagName, attributeName)) {
                continue
            }
            var value = attr.value
            if (attributeName === 'style') {
                value = StyleToObjectConverter.convert(value) as any
            }
            paramsToReturn[attributeName] = value
        }
        return paramsToReturn
    }

    private static transformAttributeNameToReactSpecific(name: string): string {
        return this.reactSpecificAttributes[name] || name
    }
}