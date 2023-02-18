## Modules

<dl>
<dt><a href="#Base GUI.module_App">App</a></dt>
<dd></dd>
<dt><a href="#Base GUI.module_AppEntry">AppEntry</a></dt>
<dd></dd>
<dt><a href="#Base GUI.module_Bootstrap">Bootstrap</a></dt>
<dd></dd>
</dl>

<a name="Base GUI.module_App"></a>

## App

* [App](#Base GUI.module_App)
    * [~App(props)](#Base GUI.module_App..App) ⇒ <code>React.ReactNode</code>
        * [.propTypes](#Base GUI.module_App..App.propTypes) : <code>Object</code>
        * [.defaultProps](#Base GUI.module_App..App.defaultProps) : <code>Object</code>

<a name="Base GUI.module_App..App"></a>

### App~App(props) ⇒ <code>React.ReactNode</code>
Curiosity application start.
- Loads locale
- Provides authentication

**Kind**: inner method of [<code>App</code>](#Base GUI.module_App)  

| Param | Type |
| --- | --- |
| props | <code>object</code> | 
| props.getLocale | <code>function</code> | 
| props.useDispatch | <code>function</code> | 
| props.useSelector | <code>function</code> | 


* [~App(props)](#Base GUI.module_App..App) ⇒ <code>React.ReactNode</code>
    * [.propTypes](#Base GUI.module_App..App.propTypes) : <code>Object</code>
    * [.defaultProps](#Base GUI.module_App..App.defaultProps) : <code>Object</code>

<a name="Base GUI.module_App..App.propTypes"></a>

#### App.propTypes : <code>Object</code>
Prop types.

**Kind**: static property of [<code>App</code>](#Base GUI.module_App..App)  
<a name="Base GUI.module_App..App.defaultProps"></a>

#### App.defaultProps : <code>Object</code>
Default props.

**Kind**: static property of [<code>App</code>](#Base GUI.module_App..App)  
<a name="Base GUI.module_AppEntry"></a>

## AppEntry
<a name="Base GUI.module_AppEntry..AppEntry"></a>

### AppEntry~AppEntry() ⇒ <code>React.ReactNode</code>
Application entry.
- A platform required file, including how it's cased.

**Kind**: inner method of [<code>AppEntry</code>](#Base GUI.module_AppEntry)  
<a name="Base GUI.module_Bootstrap"></a>

## Bootstrap

* [Bootstrap](#Base GUI.module_Bootstrap)
    * [~root](#Base GUI.module_Bootstrap..root) : <code>HTMLElement</code>
    * [~Render](#Base GUI.module_Bootstrap..Render) : <code>function</code>

<a name="Base GUI.module_Bootstrap..root"></a>

### Bootstrap~root : <code>HTMLElement</code>
Root element within HTML template.

**Kind**: inner constant of [<code>Bootstrap</code>](#Base GUI.module_Bootstrap)  
<a name="Base GUI.module_Bootstrap..Render"></a>

### Bootstrap~Render : <code>function</code>
Attach application to the root element, html

**Kind**: inner typedef of [<code>Bootstrap</code>](#Base GUI.module_Bootstrap)  
