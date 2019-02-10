# How 
`npm i reactize-html`
or include it to packagejson

# dependencies
no dependencies. Supposed to be used in Typescript applications only.

#Why
Sometimes you need to render raw html as react components, and replace some html elements with your components.
With this lib you can parse html to react elements.

#Guide
For simply converting html to components:

`HtmlToReactComponentsConverter.convert(htmlString)`

For a more sophisticated stuff and logic, you should provide `HtmlToReactComponentsConverter` with `ConversionConfiguration`
instance. With it you can:
- blacklist by tag //no elements with blacklisted tags will be skipped

you can provide a specific convert options for a specific tag:
- you can whitelist/blacklist attributes
- apply your own handler that can:
    - make some element igonred (not converted)
    - modify params/replace params
    - replace element with your provided element
 example:
 ```typescript
let html = `
<div>
    <p data-badattribute="foo">
        hello
    </p>
    <p class="ignore">
        stupid    
    </p>
    <p style="color:red;">
        world!
    </p>
    <mycustomtag class="bar">
        foo
    </mycustomtag>
    <script>
        window.destroyWorld()
    </script>
</div>
`
let reactElements = HtmlToReactComponentsConverter.convert(html, new ConversionConfiguration({
    p: new ConvertOptionsBuilder()
        .blackListAttibutes('data-badattribute')
        .applyHandler(
            ((params, children) => {
                if (params['className'] === 'ignore') {
                    // will be ignored
                    return HandlerResult.ignore()
                }
                if (params['style'] && params.style['color'] === 'red') {
                    // element be created with this params
                    return HandlerResult.replaceParamsWith({style: {'color': 'purple'}})
                }
            })
        )
        .get(),
    mycustomtag: new ConvertOptionsBuilder()
        .applyHandler(
            ((params, children) => {
                const newParams = {
                    onClick: ()=>{alert('foo')},
                    key: params.key //do not forget to copy or provide a key!
                }
                // element be replaced with your provided component
                return HandlerResult.replaceWith(
                    <Button {...params}>bump</button>
                )
            })
        )
        .get(),
    blacklistedTags: ['script']
}))

//result same as:
`
<div key="somegenereatedkey">
    <p key="somegenereatedkey">
        hello
     </p key="somegenereatedkey">
     <p style={{color: 'purple'}} key="somegenereatedkey">
        world!
     </p>
     <button onClick={()=>{alert("foo")}} key="somegenereatedkey"> 
        alert
     </button>
 </div>
 `
```

Pretty useful in scenarios where you have for example a post stored with html, and you want to enhance it with your 
components.



