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
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.isSetAppNav</td><td><code>boolean</code></td><td><p>Allow setting the Platform&#39;s left navigation if conditions are met or fallback to history.push.</p>
</td>
    </tr><tr>
    <td>options.useHistory</td><td><code>function</code></td><td></td>
    </tr><tr>
    <td>options.useDispatch</td><td><code>function</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="Hooks.module_UseWindow"></a>

## UseWindow
Global window related hooks.

<a name="Hooks.module_UseWindow..useResizeObserver"></a>

### UseWindow~useResizeObserver(target) ⇒ <code>Object</code>
Apply a resize observer to an element.

**Kind**: inner method of [<code>UseWindow</code>](#Hooks.module_UseWindow)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>target</td><td><code>*</code></td>
    </tr>  </tbody>
</table>

