## Modules

<dl>
<dt><a href="#Helpers.module_Dates">Dates</a></dt>
<dd></dd>
<dt><a href="#Helpers.module_Downloads">Downloads</a></dt>
<dd></dd>
<dt><a href="#Helpers.module_General">General</a></dt>
<dd></dd>
</dl>

<a name="Helpers.module_Dates"></a>

## Dates

* [Dates](#Helpers.module_Dates)
    * [~timestampDayFormats](#Helpers.module_Dates..timestampDayFormats) : <code>Object</code>
    * [~timestampMonthFormats](#Helpers.module_Dates..timestampMonthFormats) : <code>Object</code>
    * [~timestampQuarterFormats](#Helpers.module_Dates..timestampQuarterFormats) : <code>Object</code>
    * [~timestampTimeFormats](#Helpers.module_Dates..timestampTimeFormats) : <code>Object</code>
    * [~timestampUTCTimeFormats](#Helpers.module_Dates..timestampUTCTimeFormats) : <code>Object</code>
    * [~getCurrentDate()](#Helpers.module_Dates..getCurrentDate) ⇒ <code>string</code> \| <code>Date</code>
    * [~setRangedDateTime(params)](#Helpers.module_Dates..setRangedDateTime) ⇒ <code>Object</code>
    * [~getRangedDateTime(granularity)](#Helpers.module_Dates..getRangedDateTime) ⇒ <code>Object</code>
    * [~getRangedMonthDateTime(month)](#Helpers.module_Dates..getRangedMonthDateTime) ⇒ <code>Object</code> \| <code>\*</code> \| <code>undefined</code>

<a name="Helpers.module_Dates..timestampDayFormats"></a>

### Dates~timestampDayFormats : <code>Object</code>
Consistent timestamp day formats.

**Kind**: inner constant of [<code>Dates</code>](#Helpers.module_Dates)  
<a name="Helpers.module_Dates..timestampMonthFormats"></a>

### Dates~timestampMonthFormats : <code>Object</code>
Consistent timestamp month formats.

**Kind**: inner constant of [<code>Dates</code>](#Helpers.module_Dates)  
<a name="Helpers.module_Dates..timestampQuarterFormats"></a>

### Dates~timestampQuarterFormats : <code>Object</code>
Consistent timestamp quarter formats.

**Kind**: inner constant of [<code>Dates</code>](#Helpers.module_Dates)  
<a name="Helpers.module_Dates..timestampTimeFormats"></a>

### Dates~timestampTimeFormats : <code>Object</code>
Consistent timestamp time formats.

**Kind**: inner constant of [<code>Dates</code>](#Helpers.module_Dates)  
<a name="Helpers.module_Dates..timestampUTCTimeFormats"></a>

### Dates~timestampUTCTimeFormats : <code>Object</code>
Consistent UTC timestamp time formats.

**Kind**: inner constant of [<code>Dates</code>](#Helpers.module_Dates)  
<a name="Helpers.module_Dates..getCurrentDate"></a>

### Dates~getCurrentDate() ⇒ <code>string</code> \| <code>Date</code>
Return a date.

**Kind**: inner method of [<code>Dates</code>](#Helpers.module_Dates)  
<a name="Helpers.module_Dates..setRangedDateTime"></a>

### Dates~setRangedDateTime(params) ⇒ <code>Object</code>
Set a date range based on a granularity type.

**Kind**: inner method of [<code>Dates</code>](#Helpers.module_Dates)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> |  |
| params.date | <code>Date</code> | Start date, typically the current date. |
| params.subtract | <code>number</code> | Number of granularity type to subtract from the current date. |
| params.measurement | <code>string</code> | Granularity type. |
| params.endOfMeasurement | <code>string</code> | Granularity type. |

<a name="Helpers.module_Dates..getRangedDateTime"></a>

### Dates~getRangedDateTime(granularity) ⇒ <code>Object</code>
Return a range of time based on known granularity types.

**Kind**: inner method of [<code>Dates</code>](#Helpers.module_Dates)  

| Param | Type |
| --- | --- |
| granularity | <code>string</code> | 

<a name="Helpers.module_Dates..getRangedMonthDateTime"></a>

### Dates~getRangedMonthDateTime(month) ⇒ <code>Object</code> \| <code>\*</code> \| <code>undefined</code>
Generate a list of months for use in a select list.

**Kind**: inner method of [<code>Dates</code>](#Helpers.module_Dates)  

| Param | Type |
| --- | --- |
| month | <code>string</code> | 

<a name="Helpers.module_Downloads"></a>

## Downloads

* [Downloads](#Helpers.module_Downloads)
    * [~downloadData(options)](#Helpers.module_Downloads..downloadData) ⇒ <code>Promise</code>
    * [~debugLog()](#Helpers.module_Downloads..debugLog)

<a name="Helpers.module_Downloads..downloadData"></a>

### Downloads~downloadData(options) ⇒ <code>Promise</code>
Download data to a file

**Kind**: inner method of [<code>Downloads</code>](#Helpers.module_Downloads)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| options.data | <code>string</code> | 
| options.fileName | <code>string</code> | 
| options.fileType | <code>string</code> | 

<a name="Helpers.module_Downloads..debugLog"></a>

### Downloads~debugLog()
Download the debug log file.

**Kind**: inner method of [<code>Downloads</code>](#Helpers.module_Downloads)  
<a name="Helpers.module_General"></a>

## General

* [General](#Helpers.module_General)
    * [~noop](#Helpers.module_General..noop)
    * [~noopPromise](#Helpers.module_General..noopPromise) : <code>Promise.&lt;{}&gt;</code>
    * [~DEV_MODE](#Helpers.module_General..DEV_MODE) : <code>boolean</code>
    * [~PROD_MODE](#Helpers.module_General..PROD_MODE) : <code>boolean</code>
    * [~REVIEW_MODE](#Helpers.module_General..REVIEW_MODE) : <code>boolean</code>
    * [~TEST_MODE](#Helpers.module_General..TEST_MODE) : <code>boolean</code>
    * [~UI_DEPLOY_PATH_PREFIX](#Helpers.module_General..UI_DEPLOY_PATH_PREFIX) : <code>string</code>
    * [~UI_DISABLED](#Helpers.module_General..UI_DISABLED) : <code>boolean</code>
    * [~UI_DISABLED_GRAPH](#Helpers.module_General..UI_DISABLED_GRAPH) : <code>boolean</code>
    * [~UI_DISABLED_NOTIFICATIONS](#Helpers.module_General..UI_DISABLED_NOTIFICATIONS) : <code>boolean</code>
    * [~UI_DISABLED_TABLE](#Helpers.module_General..UI_DISABLED_TABLE) : <code>boolean</code>
    * [~UI_DISABLED_TABLE_HOSTS](#Helpers.module_General..UI_DISABLED_TABLE_HOSTS) : <code>boolean</code>
    * [~UI_DISABLED_TABLE_INSTANCES](#Helpers.module_General..UI_DISABLED_TABLE_INSTANCES) : <code>boolean</code>
    * [~UI_DISABLED_TABLE_SUBSCRIPTIONS](#Helpers.module_General..UI_DISABLED_TABLE_SUBSCRIPTIONS) : <code>boolean</code>
    * [~UI_DISABLED_TOOLBAR](#Helpers.module_General..UI_DISABLED_TOOLBAR) : <code>boolean</code>
    * [~UI_DISPLAY_NAME](#Helpers.module_General..UI_DISPLAY_NAME) : <code>string</code>
    * [~UI_DISPLAY_CONFIG_NAME](#Helpers.module_General..UI_DISPLAY_CONFIG_NAME) : <code>string</code>
    * [~UI_DISPLAY_START_NAME](#Helpers.module_General..UI_DISPLAY_START_NAME) : <code>string</code>
    * [~UI_LINK_CONTACT_US](#Helpers.module_General..UI_LINK_CONTACT_US) : <code>string</code>
    * [~UI_LINK_LEARN_MORE](#Helpers.module_General..UI_LINK_LEARN_MORE) : <code>string</code>
    * [~UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS](#Helpers.module_General..UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS) : <code>string</code>
    * [~UI_LOCALE_DEFAULT](#Helpers.module_General..UI_LOCALE_DEFAULT) : <code>string</code>
    * [~UI_LOCALE_DEFAULT_DESC](#Helpers.module_General..UI_LOCALE_DEFAULT_DESC) : <code>string</code>
    * [~UI_LOGGER_ID](#Helpers.module_General..UI_LOGGER_ID) : <code>string</code>
    * [~UI_LOGGER_FILE](#Helpers.module_General..UI_LOGGER_FILE) : <code>string</code>
    * [~UI_NAME](#Helpers.module_General..UI_NAME) : <code>string</code>
    * [~UI_PATH](#Helpers.module_General..UI_PATH) : <code>string</code>
    * [~UI_VERSION](#Helpers.module_General..UI_VERSION) : <code>string</code>
    * [~UI_WINDOW_ID](#Helpers.module_General..UI_WINDOW_ID) : <code>string</code>
    * [~aggregatedError(errors, message, options)](#Helpers.module_General..aggregatedError) ⇒ <code>Error</code> \| <code>window.AggregateError.&lt;Error&gt;</code>
    * [~generateId(prefix)](#Helpers.module_General..generateId) ⇒ <code>string</code>
    * [~isDate(date)](#Helpers.module_General..isDate) ⇒ <code>boolean</code>
    * [~isPromise(obj)](#Helpers.module_General..isPromise) ⇒ <code>boolean</code>
    * [~generateHash(anyValue, options)](#Helpers.module_General..generateHash) ⇒ <code>\*</code> \| <code>string</code>
    * [~noopTranslate(key, value, components)](#Helpers.module_General..noopTranslate) ⇒ <code>string</code>
    * [~numberDisplay(value)](#Helpers.module_General..numberDisplay) ⇒ <code>numbro.Numbro</code> \| <code>\*</code>
    * [~browserExpose(obj, options)](#Helpers.module_General..browserExpose)

<a name="Helpers.module_General..noop"></a>

### General~noop
An empty function.
Typically used as a default prop.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..noopPromise"></a>

### General~noopPromise : <code>Promise.&lt;{}&gt;</code>
An empty promise.
Typically used as a default prop, or during testing.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..DEV_MODE"></a>

### General~DEV\_MODE : <code>boolean</code>
Is dev mode active.
Associated with using the NPM script "start". See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..PROD_MODE"></a>

### General~PROD\_MODE : <code>boolean</code>
Is prod mode active.
Associated with production builds. See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..REVIEW_MODE"></a>

### General~REVIEW\_MODE : <code>boolean</code>
Is review/proxy mode active.
Associated with using the NPM script "start:proxy". See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..TEST_MODE"></a>

### General~TEST\_MODE : <code>boolean</code>
Is test mode active.
Associated with running unit tests. See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DEPLOY_PATH_PREFIX"></a>

### General~UI\_DEPLOY\_PATH\_PREFIX : <code>string</code>
Apply a path prefix for routing.
Typically associated with applying a "beta" path prefix. See dotenv config files for updating. See build scripts for generated prefix.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DISABLED"></a>

### General~UI\_DISABLED : <code>boolean</code>
Disable an aspect of the UI.
Typically associated with disabling views through route settings. See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DISABLED_GRAPH"></a>

### General~UI\_DISABLED\_GRAPH : <code>boolean</code>
Disable the graph card aspect of the UI.
See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DISABLED_NOTIFICATIONS"></a>

### General~UI\_DISABLED\_NOTIFICATIONS : <code>boolean</code>
Disable platform notifications.
See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DISABLED_TABLE"></a>

### General~UI\_DISABLED\_TABLE : <code>boolean</code>
Disable the inventory/table aspect of the UI.
See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DISABLED_TABLE_HOSTS"></a>

### General~UI\_DISABLED\_TABLE\_HOSTS : <code>boolean</code>
Disable the current hosts inventory/table aspect of the UI.
See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DISABLED_TABLE_INSTANCES"></a>

### General~UI\_DISABLED\_TABLE\_INSTANCES : <code>boolean</code>
Disable the current instances inventory/table aspect of the UI.
See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DISABLED_TABLE_SUBSCRIPTIONS"></a>

### General~UI\_DISABLED\_TABLE\_SUBSCRIPTIONS : <code>boolean</code>
Disable the current subscriptions inventory/table aspect of the UI.
See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DISABLED_TOOLBAR"></a>

### General~UI\_DISABLED\_TOOLBAR : <code>boolean</code>
Disable the filter toolbar aspect of the UI.
See dotenv config files for activation.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DISPLAY_NAME"></a>

### General~UI\_DISPLAY\_NAME : <code>string</code>
UI application name.
See dotenv config files for updating.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DISPLAY_CONFIG_NAME"></a>

### General~UI\_DISPLAY\_CONFIG\_NAME : <code>string</code>
UI application configuration name.
See dotenv config files for updating.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_DISPLAY_START_NAME"></a>

### General~UI\_DISPLAY\_START\_NAME : <code>string</code>
UI application sentence start name.
See dotenv config files for updating.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_LINK_CONTACT_US"></a>

### General~UI\_LINK\_CONTACT\_US : <code>string</code>
A url, or uri, for "contact us".

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_LINK_LEARN_MORE"></a>

### General~UI\_LINK\_LEARN\_MORE : <code>string</code>
A url, or uri, for "learn more".

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS"></a>

### General~UI\_LINK\_REPORT\_ACCURACY\_RECOMMENDATIONS : <code>string</code>
A url, or uri, for "recommend actions"

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_LOCALE_DEFAULT"></a>

### General~UI\_LOCALE\_DEFAULT : <code>string</code>
UI locale default.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_LOCALE_DEFAULT_DESC"></a>

### General~UI\_LOCALE\_DEFAULT\_DESC : <code>string</code>
UI locale default description.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_LOGGER_ID"></a>

### General~UI\_LOGGER\_ID : <code>string</code>
UI state logging name/id.
See dotenv config files for updating.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_LOGGER_FILE"></a>

### General~UI\_LOGGER\_FILE : <code>string</code>
UI state logging file name.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_NAME"></a>

### General~UI\_NAME : <code>string</code>
UI packaged application name.
See dotenv config files for updating.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_PATH"></a>

### General~UI\_PATH : <code>string</code>
UI packaged application path, with generated prefix.
See dotenv config files for updating. See build scripts for generated prefix.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_VERSION"></a>

### General~UI\_VERSION : <code>string</code>
UI packaged application version, with generated hash.
See dotenv config files for updating. See build scripts for generated hash.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..UI_WINDOW_ID"></a>

### General~UI\_WINDOW\_ID : <code>string</code>
UI exposed window name/id.
See dotenv config files for updating.

**Kind**: inner constant of [<code>General</code>](#Helpers.module_General)  
<a name="Helpers.module_General..aggregatedError"></a>

### General~aggregatedError(errors, message, options) ⇒ <code>Error</code> \| <code>window.AggregateError.&lt;Error&gt;</code>
Fill for AggregatedError

**Kind**: inner method of [<code>General</code>](#Helpers.module_General)  

| Param | Type | Description |
| --- | --- | --- |
| errors | <code>Array</code> \| <code>\*</code> | An array of errors |
| message | <code>string</code> \| <code>\*</code> |  |
| options | <code>object</code> |  |
| options.name | <code>string</code> |  |

<a name="Helpers.module_General..generateId"></a>

### General~generateId(prefix) ⇒ <code>string</code>
Generate a random'ish ID.

**Kind**: inner method of [<code>General</code>](#Helpers.module_General)  

| Param | Type |
| --- | --- |
| prefix | <code>string</code> | 

<a name="Helpers.module_General..isDate"></a>

### General~isDate(date) ⇒ <code>boolean</code>
Check if "is a Date"

**Kind**: inner method of [<code>General</code>](#Helpers.module_General)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> \| <code>\*</code> | 

<a name="Helpers.module_General..isPromise"></a>

### General~isPromise(obj) ⇒ <code>boolean</code>
Check if "is a Promise", "Promise like".

**Kind**: inner method of [<code>General</code>](#Helpers.module_General)  

| Param | Type |
| --- | --- |
| obj | <code>Promise</code> \| <code>\*</code> | 

<a name="Helpers.module_General..generateHash"></a>

### General~generateHash(anyValue, options) ⇒ <code>\*</code> \| <code>string</code>
Generate a consistent hash

**Kind**: inner method of [<code>General</code>](#Helpers.module_General)  

| Param | Type |
| --- | --- |
| anyValue | <code>\*</code> \| <code>object</code> | 
| options | <code>object</code> | 
| options.method | <code>function</code> | 

<a name="Helpers.module_General..noopTranslate"></a>

### General~noopTranslate(key, value, components) ⇒ <code>string</code>
A placeholder for "t", translation method.
Associated with the i18n package, and typically used as a default prop.

**Kind**: inner method of [<code>General</code>](#Helpers.module_General)  

| Param | Type |
| --- | --- |
| key | <code>string</code> \| <code>Array</code> | 
| value | <code>string</code> \| <code>object</code> \| <code>Array</code> | 
| components | <code>Array</code> | 

<a name="Helpers.module_General..numberDisplay"></a>

### General~numberDisplay(value) ⇒ <code>numbro.Numbro</code> \| <code>\*</code>
Convenience wrapper for numbro. Numbro assumes all values passed to it conform as "number".
This allows us to optional chain the function results.

**Kind**: inner method of [<code>General</code>](#Helpers.module_General)  

| Param | Type |
| --- | --- |
| value | <code>\*</code> | 

<a name="Helpers.module_General..browserExpose"></a>

### General~browserExpose(obj, options)
Expose an application specific object.
Associated with access on a browser's developer console. Limits exposed additions to
test and non-production environments only. Exposes helpers across all environments.

**Kind**: inner method of [<code>General</code>](#Helpers.module_General)  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 
| options | <code>object</code> | 

**Properties**

| Name | Type |
| --- | --- |
| limit | <code>boolean</code> | 
| id | <code>string</code> | 

