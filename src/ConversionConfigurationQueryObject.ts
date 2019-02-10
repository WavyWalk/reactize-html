import {ConversionConfiguration} from "./ConversionConfiguration";
import {ConversionOptions} from "./ConversionOptions"
import {HandlerResult} from "./HandlerResult";

export class ConversionConfigurationQueryObject {

    static ANY_TAG = 'any'

    conversionConfiguration: ConversionConfiguration

    constructor(conversionConfiguration: ConversionConfiguration) {
        this.conversionConfiguration = conversionConfiguration
    }

    getConversionOptionsForTag(tagName: string): ConversionOptions | null {
        return this.conversionConfiguration.convertOptions[tagName] || null
    }

    shouldAttributeBeSkipped(tagName: string, attributeName: string): boolean {
        let conversionOptionsFortag = this.getConversionOptionsForTag(tagName)
        if (!conversionOptionsFortag) {
            return false
        }
        return conversionOptionsFortag.blackListedAttributes[attributeName] || false
    }

    shouldBeIgnored(tagName: string): boolean {
        if (this.conversionConfiguration.convertOptions.whitelistedTags) {
            return !!!(this.conversionConfiguration.convertOptions.whitelistedTags as any)[tagName]
        }
        if (this.conversionConfiguration.convertOptions.blacklistedTags) {
            return (this.conversionConfiguration.convertOptions.blacklistedTags as any)[tagName] || false
        }
        return false
    }

    shouldUserDefinedHandlerBeApplied(tagName: string): boolean {
        const conversionOptionsForTag = this.getConversionOptionsForTag(tagName)
        if (!conversionOptionsForTag) {
            return false
        } else if (!!conversionOptionsForTag.userDefinedHandler) {
            return true
        }
        const conversionOptionsForAnyTag = this.getConversionOptionsForTag(ConversionConfigurationQueryObject.ANY_TAG)
        if (!conversionOptionsForAnyTag) {
            return false
        }
        return !!conversionOptionsForAnyTag.userDefinedHandler
    }

    applyUserDefinedHandler(tagName: string, params: { [p: string]: any }, children: any): HandlerResult {
        const conversionOptionsForTag = this.getConversionOptionsForTag(tagName) || this.getConversionOptionsForTag(ConversionConfigurationQueryObject.ANY_TAG)
        return conversionOptionsForTag!.userDefinedHandler!(params, children)
    }
}