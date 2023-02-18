## Modules

<dl>
<dt><a href="#Hooks.module_UseRouter">UseRouter</a></dt>
<dd><p>Global routing hooks.</p>
</dd>
<dt><a href="#Hooks.module_UseWindow">UseWindow</a></dt>
<dd><p>Global window related hooks.</p>
</dd>
</dl>

<a name="Hooks.module_UseRouter"></a>

## UseRouter
Global routing hooks.

<a name="Hooks.module_UseRouter..useHistory"></a>

### UseRouter~useHistory(options) ⇒ <code>object</code>
Pass useHistory methods. Proxy useHistory push with Platform specific navigation update.

**Kind**: inner method of [<code>UseRouter</code>](#Hooks.module_UseRouter)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.isSetAppNav | <code>boolean</code> | Allow setting the Platform's left navigation if conditions are met or fallback to history.push. |
| options.useHistory | <code>function</code> |  |
| options.useDispatch | <code>function</code> |  |

<a name="Hooks.module_UseWindow"></a>

## UseWindow
Global window related hooks.

<a name="Hooks.module_UseWindow..useResizeObserver"></a>

### UseWindow~useResizeObserver(target) ⇒ <code>Object</code>
Apply a resize observer to an element.

**Kind**: inner method of [<code>UseWindow</code>](#Hooks.module_UseWindow)  

| Param | Type |
| --- | --- |
| target | <code>\*</code> | 

