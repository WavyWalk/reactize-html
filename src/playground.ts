import {HtmlToReactComponentsConverter} from "./HtmlToReactComponentsConverter";

let html = `
    <div style="color: red; .foo {color: black}">
      <p>
        hello world
      </p>
      asfasfasf
      <h1>hello
        <p>workd!</p>
      </h1>
    </div>
`


export let reactComponents = new HtmlToReactComponentsConverter(html).getReactComponents()
