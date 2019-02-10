import {ReactComponentElement} from "react";

export class HandlerResult {


    private static _shouldIgnoreInstance: HandlerResult
    private static get shouldIgnoreInstance(): HandlerResult {
        if (this._shouldIgnoreInstance === undefined) {
            const handlerResult = new HandlerResult()
            handlerResult.shouldIgnore = true
            this._shouldIgnoreInstance = handlerResult
        }
        return this._shouldIgnoreInstance
    }

    private static _doNothingInstance: HandlerResult
    private static get doNothingInstance(): HandlerResult {
        if (this._doNothingInstance === undefined) {
            const handlerResult = new HandlerResult()
            handlerResult.shouldDoNothing = true
            this._doNothingInstance = handlerResult
        }
        return this._doNothingInstance
    }

    shouldIgnore: boolean = false
    shouldDoNothing: boolean = false
    componentToReplaceWith!: ReactComponentElement<any, any>
    paramsToReplaceWith!: { [p: string]: any }

    private constructor() {

    }

    static ignore(): HandlerResult {
        return this.shouldIgnoreInstance
    }

    static doNothing() {
        return this.doNothingInstance
    }

    static replaceWith(element: ReactComponentElement<any, any>) {
        let result = new HandlerResult()
        result.componentToReplaceWith = element
        return result
    }

    static replaceParamsWith(newParams: { [key: string]: any }) {
        let result = new HandlerResult()
        result.paramsToReplaceWith = newParams
        return result
    }

}