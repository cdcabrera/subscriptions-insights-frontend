## Modules

<dl>
<dt><a href="#Redux State.module_Actions">Actions</a></dt>
<dd></dd>
<dt><a href="#Actions.module_PlatformActions">PlatformActions</a></dt>
<dd></dd>
<dt><a href="#Actions.module_RhsmActions">RhsmActions</a></dt>
<dd></dd>
<dt><a href="#Actions.module_UserActions">UserActions</a></dt>
<dd></dd>
<dt><a href="#Redux State.module_Helpers">Helpers</a></dt>
<dd></dd>
<dt><a href="#Helpers.module_ReduxHelpers">ReduxHelpers</a></dt>
<dd></dd>
<dt><a href="#Redux State.module_Hooks">Hooks</a></dt>
<dd></dd>
<dt><a href="#Hooks.module_UseReactRedux">UseReactRedux</a></dt>
<dd></dd>
<dt><a href="#Middleware.module_ActionRecordMiddleware">ActionRecordMiddleware</a></dt>
<dd></dd>
<dt><a href="#Redux State.module_Middleware">Middleware</a></dt>
<dd></dd>
<dt><a href="#Middleware.module_MultiActionMiddleware">MultiActionMiddleware</a></dt>
<dd></dd>
<dt><a href="#Middleware.module_StatusMiddleware">StatusMiddleware</a></dt>
<dd></dd>
<dt><a href="#Reducers.module_GraphReducer">GraphReducer</a></dt>
<dd></dd>
<dt><a href="#Redux State.module_Reducers">Reducers</a></dt>
<dd></dd>
<dt><a href="#Reducers.module_InventoryReducer">InventoryReducer</a></dt>
<dd></dd>
<dt><a href="#Reducers.module_MessagesReducer">MessagesReducer</a></dt>
<dd></dd>
<dt><a href="#Reducers.module_ToolbarReducer">ToolbarReducer</a></dt>
<dd></dd>
<dt><a href="#Reducers.module_UserReducer">UserReducer</a></dt>
<dd></dd>
<dt><a href="#Reducers.module_ViewReducer">ViewReducer</a></dt>
<dd></dd>
<dt><a href="#Redux State.module_Store">Store</a></dt>
<dd></dd>
<dt><a href="#Types.module_AppTypes">AppTypes</a></dt>
<dd></dd>
<dt><a href="#Types.module_GraphTypes">GraphTypes</a></dt>
<dd></dd>
<dt><a href="#Redux State.module_Types">Types</a></dt>
<dd></dd>
<dt><a href="#Types.module_InventoryTypes">InventoryTypes</a></dt>
<dd></dd>
<dt><a href="#Types.module_PlatformTypes">PlatformTypes</a></dt>
<dd></dd>
<dt><a href="#Types.module_QueryTypes">QueryTypes</a></dt>
<dd></dd>
<dt><a href="#Types.module_RhsmTypes">RhsmTypes</a></dt>
<dd></dd>
<dt><a href="#Types.module_ToolbarTypes">ToolbarTypes</a></dt>
<dd></dd>
<dt><a href="#Types.module_UserTypes">UserTypes</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#Redux State">Redux State</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#connectRouter">connectRouter(mapStateToProps, mapDispatchToProps)</a> ⇒ <code>function</code></dt>
<dd><p>Wrapper for applying Router Dom withRouter and Redux connect.</p>
</dd>
</dl>

<a name="Redux State.module_Actions"></a>

## Actions
**Properties**

| Name | Type |
| --- | --- |
| PlatformActions | <code>module</code> | 
| RhsmActions | <code>module</code> | 
| UserActions | <code>module</code> | 

<a name="Redux State.module_Actions..actions"></a>

### Actions~actions : <code>Object</code>
Redux actions

**Kind**: inner constant of [<code>Actions</code>](#Redux State.module_Actions)  
<a name="Actions.module_PlatformActions"></a>

## PlatformActions

* [PlatformActions](#Actions.module_PlatformActions)
    * [~addNotification(data)](#Actions.module_PlatformActions..addNotification) ⇒ <code>\*</code>
    * [~removeNotification(id)](#Actions.module_PlatformActions..removeNotification) ⇒ <code>\*</code>
    * [~clearNotifications()](#Actions.module_PlatformActions..clearNotifications) ⇒ <code>\*</code>
    * [~authorizeUser(appName)](#Actions.module_PlatformActions..authorizeUser) ⇒ <code>function</code>
    * [~hideGlobalFilter(isHidden)](#Actions.module_PlatformActions..hideGlobalFilter) ⇒ <code>Object</code>
    * [~initializeChrome()](#Actions.module_PlatformActions..initializeChrome) ⇒ <code>Object</code>
    * [~onNavigation(callback)](#Actions.module_PlatformActions..onNavigation) ⇒ <code>function</code>
    * [~setAppName(name)](#Actions.module_PlatformActions..setAppName) ⇒ <code>Object</code>
    * [~setAppNav(id, options)](#Actions.module_PlatformActions..setAppNav) ⇒ <code>function</code>

<a name="Actions.module_PlatformActions..addNotification"></a>

### PlatformActions~addNotification(data) ⇒ <code>\*</code>
Add a platform plugin toast notification.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  

| Param | Type |
| --- | --- |
| data | <code>object</code> | 

<a name="Actions.module_PlatformActions..removeNotification"></a>

### PlatformActions~removeNotification(id) ⇒ <code>\*</code>
Remove a platform plugin toast notification.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="Actions.module_PlatformActions..clearNotifications"></a>

### PlatformActions~clearNotifications() ⇒ <code>\*</code>
Clear all platform plugin toast notifications.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  
<a name="Actions.module_PlatformActions..authorizeUser"></a>

### PlatformActions~authorizeUser(appName) ⇒ <code>function</code>
Get an emulated and combined API response from the platforms "getUser" and "getUserPermissions" global methods.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  

| Param | Type |
| --- | --- |
| appName | <code>string</code> \| <code>Array</code> | 

<a name="Actions.module_PlatformActions..hideGlobalFilter"></a>

### PlatformActions~hideGlobalFilter(isHidden) ⇒ <code>Object</code>
Hide platform global filter.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  

| Param | Type |
| --- | --- |
| isHidden | <code>boolean</code> | 

<a name="Actions.module_PlatformActions..initializeChrome"></a>

### PlatformActions~initializeChrome() ⇒ <code>Object</code>
Apply platform method for initializing chrome, i.e. header, left-nav.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  
<a name="Actions.module_PlatformActions..onNavigation"></a>

### PlatformActions~onNavigation(callback) ⇒ <code>function</code>
Apply platform method for updating routing history on "navigating" with the left-nav.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="Actions.module_PlatformActions..setAppName"></a>

### PlatformActions~setAppName(name) ⇒ <code>Object</code>
Apply platform method for setting the application name/identifier.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="Actions.module_PlatformActions..setAppNav"></a>

### PlatformActions~setAppNav(id, options) ⇒ <code>function</code>
Apply platform method for changing routes via the left-nav navigation.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 
| options | <code>object</code> | 
| options.appName | <code>string</code> | 
| options.secondaryNav | <code>boolean</code> | 

<a name="Actions.module_RhsmActions"></a>

## RhsmActions

* [RhsmActions](#Actions.module_RhsmActions)
    * [~getGraphMetrics(idMetric, query, options)](#Actions.module_RhsmActions..getGraphMetrics) ⇒ <code>function</code>
    * [~getHostsInventory(id, query)](#Actions.module_RhsmActions..getHostsInventory) ⇒ <code>function</code>
    * [~getHostsInventoryGuests(id, query)](#Actions.module_RhsmActions..getHostsInventoryGuests) ⇒ <code>function</code>
    * [~getInstancesInventory(id, query)](#Actions.module_RhsmActions..getInstancesInventory) ⇒ <code>function</code>
    * [~getMessageReports(id, query)](#Actions.module_RhsmActions..getMessageReports) ⇒ <code>function</code>
    * [~getSubscriptionsInventory(id, query)](#Actions.module_RhsmActions..getSubscriptionsInventory) ⇒ <code>function</code>

<a name="Actions.module_RhsmActions..getGraphMetrics"></a>

### RhsmActions~getGraphMetrics(idMetric, query, options) ⇒ <code>function</code>
Get a RHSM response from multiple Tally, or Capacity, IDs and metrics.

**Kind**: inner method of [<code>RhsmActions</code>](#Actions.module_RhsmActions)  

| Param | Type | Description |
| --- | --- | --- |
| idMetric | <code>object</code> \| <code>Array</code> | An object, or an Array of objects, in the form of { id: PRODUCT_ID, metric: METRIC_ID, isCapacity: boolean } |
| query | <code>object</code> |  |
| options | <code>object</code> |  |
| options.cancelId | <code>string</code> |  |

<a name="Actions.module_RhsmActions..getHostsInventory"></a>

### RhsmActions~getHostsInventory(id, query) ⇒ <code>function</code>
Get a hosts response listing from RHSM subscriptions.

**Kind**: inner method of [<code>RhsmActions</code>](#Actions.module_RhsmActions)  

| Param | Type | Default |
| --- | --- | --- |
| id | <code>string</code> | <code>null</code> | 
| query | <code>object</code> |  | 

<a name="Actions.module_RhsmActions..getHostsInventoryGuests"></a>

### RhsmActions~getHostsInventoryGuests(id, query) ⇒ <code>function</code>
Get a host's guest response listing from RHSM subscriptions.

**Kind**: inner method of [<code>RhsmActions</code>](#Actions.module_RhsmActions)  

| Param | Type | Default |
| --- | --- | --- |
| id | <code>string</code> | <code>null</code> | 
| query | <code>object</code> |  | 

<a name="Actions.module_RhsmActions..getInstancesInventory"></a>

### RhsmActions~getInstancesInventory(id, query) ⇒ <code>function</code>
Get an instances response listing from RHSM subscriptions.

**Kind**: inner method of [<code>RhsmActions</code>](#Actions.module_RhsmActions)  

| Param | Type | Default |
| --- | --- | --- |
| id | <code>string</code> | <code>null</code> | 
| query | <code>object</code> |  | 

<a name="Actions.module_RhsmActions..getMessageReports"></a>

### RhsmActions~getMessageReports(id, query) ⇒ <code>function</code>
Get a RHSM response from message reporting.

**Kind**: inner method of [<code>RhsmActions</code>](#Actions.module_RhsmActions)  

| Param | Type | Default |
| --- | --- | --- |
| id | <code>string</code> | <code>null</code> | 
| query | <code>object</code> |  | 

<a name="Actions.module_RhsmActions..getSubscriptionsInventory"></a>

### RhsmActions~getSubscriptionsInventory(id, query) ⇒ <code>function</code>
Get a subscriptions response from RHSM subscriptions.

**Kind**: inner method of [<code>RhsmActions</code>](#Actions.module_RhsmActions)  

| Param | Type | Default |
| --- | --- | --- |
| id | <code>string</code> | <code>null</code> | 
| query | <code>object</code> |  | 

<a name="Actions.module_UserActions"></a>

## UserActions

* [UserActions](#Actions.module_UserActions)
    * [~getLocale()](#Actions.module_UserActions..getLocale) ⇒ <code>Object</code>
    * [~deleteAccountOptIn()](#Actions.module_UserActions..deleteAccountOptIn) ⇒ <code>function</code>
    * [~getAccountOptIn()](#Actions.module_UserActions..getAccountOptIn) ⇒ <code>function</code>
    * [~updateAccountOptIn(query)](#Actions.module_UserActions..updateAccountOptIn) ⇒ <code>function</code>

<a name="Actions.module_UserActions..getLocale"></a>

### UserActions~getLocale() ⇒ <code>Object</code>
Get a user's locale.

**Kind**: inner method of [<code>UserActions</code>](#Actions.module_UserActions)  
<a name="Actions.module_UserActions..deleteAccountOptIn"></a>

### UserActions~deleteAccountOptIn() ⇒ <code>function</code>
Delete a user's opt-in.

**Kind**: inner method of [<code>UserActions</code>](#Actions.module_UserActions)  
<a name="Actions.module_UserActions..getAccountOptIn"></a>

### UserActions~getAccountOptIn() ⇒ <code>function</code>
Get a user's opt-in config.

**Kind**: inner method of [<code>UserActions</code>](#Actions.module_UserActions)  
<a name="Actions.module_UserActions..updateAccountOptIn"></a>

### UserActions~updateAccountOptIn(query) ⇒ <code>function</code>
Update a user's opt-in.

**Kind**: inner method of [<code>UserActions</code>](#Actions.module_UserActions)  

| Param | Type |
| --- | --- |
| query | <code>object</code> | 

<a name="Redux State.module_Helpers"></a>

## Helpers
**Properties**

| Name | Type |
| --- | --- |
| ReduxHelpers | <code>module</code> | 

<a name="Helpers.module_ReduxHelpers"></a>

## ReduxHelpers

* [ReduxHelpers](#Helpers.module_ReduxHelpers)
    * [~FULFILLED_ACTION(base)](#Helpers.module_ReduxHelpers..FULFILLED_ACTION) ⇒ <code>string</code>
    * [~PENDING_ACTION(base)](#Helpers.module_ReduxHelpers..PENDING_ACTION) ⇒ <code>string</code>
    * [~REJECTED_ACTION(base)](#Helpers.module_ReduxHelpers..REJECTED_ACTION) ⇒ <code>string</code>
    * [~HTTP_STATUS_RANGE(status)](#Helpers.module_ReduxHelpers..HTTP_STATUS_RANGE) ⇒ <code>string</code>
    * [~setApiQuery(values, schema, [initialValue])](#Helpers.module_ReduxHelpers..setApiQuery) ⇒ <code>object</code>
    * [~setResponseSchemas(schemas, [initialValue])](#Helpers.module_ReduxHelpers..setResponseSchemas) ⇒ <code>Array</code>
    * [~setNormalizedResponse(...responses)](#Helpers.module_ReduxHelpers..setNormalizedResponse) ⇒ <code>Array</code>
    * [~getSingleResponseFromResultArray(results)](#Helpers.module_ReduxHelpers..getSingleResponseFromResultArray) ⇒ <code>object</code>
    * [~getMessageFromResults(results)](#Helpers.module_ReduxHelpers..getMessageFromResults) ⇒ <code>string</code> \| <code>null</code> \| <code>\*</code>
    * [~getDateFromResults(results)](#Helpers.module_ReduxHelpers..getDateFromResults) ⇒ <code>null</code> \| <code>string</code> \| <code>Date</code>
    * [~getStatusFromResults(results)](#Helpers.module_ReduxHelpers..getStatusFromResults) ⇒ <code>number</code>
    * [~setStateProp(prop, data, options)](#Helpers.module_ReduxHelpers..setStateProp) ⇒ <code>object</code>
    * [~singlePromiseDataResponseFromArray(results)](#Helpers.module_ReduxHelpers..singlePromiseDataResponseFromArray) ⇒ <code>Array</code> \| <code>object</code>
    * [~getDataFromResults(results)](#Helpers.module_ReduxHelpers..getDataFromResults) ⇒ <code>Array</code> \| <code>object</code>
    * [~generatedPromiseActionReducer(types, state, action)](#Helpers.module_ReduxHelpers..generatedPromiseActionReducer) ⇒ <code>object</code>

<a name="Helpers.module_ReduxHelpers..FULFILLED_ACTION"></a>

### ReduxHelpers~FULFILLED\_ACTION(base) ⇒ <code>string</code>
Apply a "fulfilled" suffix for Redux Promise Middleware action responses.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| base | <code>string</code> | 

<a name="Helpers.module_ReduxHelpers..PENDING_ACTION"></a>

### ReduxHelpers~PENDING\_ACTION(base) ⇒ <code>string</code>
Apply a "pending" suffix for Redux Promise Middleware action responses.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| base | <code>string</code> | 

<a name="Helpers.module_ReduxHelpers..REJECTED_ACTION"></a>

### ReduxHelpers~REJECTED\_ACTION(base) ⇒ <code>string</code>
Apply a "rejected" suffix for Redux Promise Middleware action responses.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| base | <code>string</code> | 

<a name="Helpers.module_ReduxHelpers..HTTP_STATUS_RANGE"></a>

### ReduxHelpers~HTTP\_STATUS\_RANGE(status) ⇒ <code>string</code>
Apply a "status range" suffix for Status Middleware action responses.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| status | <code>string</code> | 

<a name="Helpers.module_ReduxHelpers..setApiQuery"></a>

### ReduxHelpers~setApiQuery(values, schema, [initialValue]) ⇒ <code>object</code>
Set an API query based on specific API "acceptable values" schema.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| values | <code>object</code> | 
| schema | <code>object</code> | 
| [initialValue] | <code>\*</code> | 

<a name="Helpers.module_ReduxHelpers..setResponseSchemas"></a>

### ReduxHelpers~setResponseSchemas(schemas, [initialValue]) ⇒ <code>Array</code>
Apply a set of schemas using either an array of objects in the
form of [{ madeUpKey: 'some_api_key' }], or an array of arrays
in the form of [['some_api_key','another_api_key']]

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| schemas | <code>Array</code> | 
| [initialValue] | <code>\*</code> | 

<a name="Helpers.module_ReduxHelpers..setNormalizedResponse"></a>

### ReduxHelpers~setNormalizedResponse(...responses) ⇒ <code>Array</code>
Normalize an API response.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| ...responses | <code>\*</code> | 
| responses.response | <code>object</code> | 
| responses.response.schema | <code>object</code> | 
| responses.response.data | <code>Array</code> \| <code>object</code> | 
| responses.response.keyCase | <code>string</code> | 
| responses.response.customResponseEntry | <code>function</code> | 
| responses.response.customResponseValue | <code>function</code> | 
| responses.response.keyPrefix | <code>string</code> | 

<a name="Helpers.module_ReduxHelpers..getSingleResponseFromResultArray"></a>

### ReduxHelpers~getSingleResponseFromResultArray(results) ⇒ <code>object</code>
Create a single response from an array of service call responses.
Aids in handling a Promise.all response.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| results | <code>Array</code> \| <code>object</code> | 

<a name="Helpers.module_ReduxHelpers..getMessageFromResults"></a>

### ReduxHelpers~getMessageFromResults(results) ⇒ <code>string</code> \| <code>null</code> \| <code>\*</code>
Get a http status message from a service call.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| results | <code>Array</code> \| <code>object</code> | 

<a name="Helpers.module_ReduxHelpers..getDateFromResults"></a>

### ReduxHelpers~getDateFromResults(results) ⇒ <code>null</code> \| <code>string</code> \| <code>Date</code>
Get a date string from a service call.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| results | <code>Array</code> \| <code>object</code> | 

<a name="Helpers.module_ReduxHelpers..getStatusFromResults"></a>

### ReduxHelpers~getStatusFromResults(results) ⇒ <code>number</code>
Get a http status from a service call response.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| results | <code>Array</code> \| <code>object</code> | 

<a name="Helpers.module_ReduxHelpers..setStateProp"></a>

### ReduxHelpers~setStateProp(prop, data, options) ⇒ <code>object</code>
Convenience method for setting object properties, specifically Redux reducer based state objects.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| prop | <code>string</code> | 
| data | <code>object</code> | 
| options | <code>object</code> | 

**Properties**

| Name | Type |
| --- | --- |
| state | <code>object</code> | 
| initialState | <code>object</code> | 
| reset | <code>boolean</code> | 

<a name="Helpers.module_ReduxHelpers..singlePromiseDataResponseFromArray"></a>

### ReduxHelpers~singlePromiseDataResponseFromArray(results) ⇒ <code>Array</code> \| <code>object</code>
Retrieve a data property either from an array of responses, or a single response.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| results | <code>Array</code> \| <code>object</code> | 

<a name="Helpers.module_ReduxHelpers..getDataFromResults"></a>

### ReduxHelpers~getDataFromResults(results) ⇒ <code>Array</code> \| <code>object</code>
Alias for singlePromiseDataResponseFromArray.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| results | <code>Array</code> \| <code>object</code> | 

<a name="Helpers.module_ReduxHelpers..generatedPromiseActionReducer"></a>

### ReduxHelpers~generatedPromiseActionReducer(types, state, action) ⇒ <code>object</code>
Automatically apply reducer logic to state by handling promise responses from redux-promise-middleware.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  

| Param | Type |
| --- | --- |
| types | <code>Array</code> | 
| state | <code>object</code> | 
| action | <code>object</code> | 

**Properties**

| Name | Type |
| --- | --- |
| type | <code>string</code> | 

<a name="Redux State.module_Hooks"></a>

## Hooks
**Properties**

| Name | Type |
| --- | --- |
| UseReactRedux | <code>module</code> | 

<a name="Redux State.module_Hooks..storeHooks"></a>

### Hooks~storeHooks : <code>Object</code>
Store hooks

**Kind**: inner constant of [<code>Hooks</code>](#Redux State.module_Hooks)  
<a name="Hooks.module_UseReactRedux"></a>

## UseReactRedux

* [UseReactRedux](#Hooks.module_UseReactRedux)
    * [~useDispatch()](#Hooks.module_UseReactRedux..useDispatch) ⇒ <code>function</code>
    * [~useSelector(selector, value, options)](#Hooks.module_UseReactRedux..useSelector) ⇒ <code>\*</code>
    * [~useSelectors(selectors, value, options)](#Hooks.module_UseReactRedux..useSelectors) ⇒ <code>Array</code> \| <code>object</code>
    * [~useSelectorsResponse(selectors, options)](#Hooks.module_UseReactRedux..useSelectorsResponse) ⇒ <code>Object</code>
    * [~useSelectorsAllSettledResponse(selectors, options)](#Hooks.module_UseReactRedux..useSelectorsAllSettledResponse) ⇒ <code>Object</code>
    * [~useSelectorsAnyResponse(selectors, options)](#Hooks.module_UseReactRedux..useSelectorsAnyResponse) ⇒ <code>Object</code>
    * [~useSelectorsRaceResponse(selectors, options)](#Hooks.module_UseReactRedux..useSelectorsRaceResponse) ⇒ <code>Object</code>

<a name="Hooks.module_UseReactRedux..useDispatch"></a>

### UseReactRedux~useDispatch() ⇒ <code>function</code>
Wrapper for store.dispatch, emulating useDispatch.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  
<a name="Hooks.module_UseReactRedux..useSelector"></a>

### UseReactRedux~useSelector(selector, value, options) ⇒ <code>\*</code>
Wrapper for Redux hook, useSelector. Applies test mode and a fallback value.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  

| Param | Type | Default |
| --- | --- | --- |
| selector | <code>function</code> |  | 
| value | <code>\*</code> | <code></code> | 
| options | <code>object</code> |  | 
| options.equality | <code>\*</code> |  | 
| options.useSelector | <code>function</code> |  | 

<a name="Hooks.module_UseReactRedux..useSelectors"></a>

### UseReactRedux~useSelectors(selectors, value, options) ⇒ <code>Array</code> \| <code>object</code>
Generate a selector from multiple selectors for use in "useSelector".

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>Array</code> \| <code>function</code> | A selector function or array of functions. Or an array of objects in the form of     { selector: Function, id: string } If an "ID" is used for each selector the returned response will be in the     form of an object whose properties reflect said IDs with the associated selector value. |
| value | <code>\*</code> | Pass-through value similar to charging the response. |
| options | <code>object</code> |  |
| options.useSelector | <code>function</code> |  |
| options.equality | <code>\*</code> |  |

<a name="Hooks.module_UseReactRedux..useSelectorsResponse"></a>

### UseReactRedux~useSelectorsResponse(selectors, options) ⇒ <code>Object</code>
Return a combined selector response using a "Promise.all" like response.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>Array</code> \| <code>function</code> | A selector function or array of functions. Or an array of objects in the form of     { selector: Function, id: string } If an "ID" is used for each selector the returned response will be in the     form of an object whose properties reflect said IDs with the associated selector value. |
| options | <code>object</code> |  |
| options.useSelectors | <code>function</code> |  |
| options.customResponse | <code>function</code> | Callback for customizing your own response |

<a name="Hooks.module_UseReactRedux..useSelectorsAllSettledResponse"></a>

### UseReactRedux~useSelectorsAllSettledResponse(selectors, options) ⇒ <code>Object</code>
Return a combined selector response using a "Promise.allSettled" like response.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  

| Param | Type |
| --- | --- |
| selectors | <code>Array</code> \| <code>function</code> | 
| options | <code>object</code> | 
| options.useSelectorsResponse | <code>function</code> | 

<a name="Hooks.module_UseReactRedux..useSelectorsAnyResponse"></a>

### UseReactRedux~useSelectorsAnyResponse(selectors, options) ⇒ <code>Object</code>
Return a combined selector response using a "Promise.any" like response.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  

| Param | Type |
| --- | --- |
| selectors | <code>Array</code> \| <code>function</code> | 
| options | <code>object</code> | 
| options.useSelectorsResponse | <code>function</code> | 

<a name="Hooks.module_UseReactRedux..useSelectorsRaceResponse"></a>

### UseReactRedux~useSelectorsRaceResponse(selectors, options) ⇒ <code>Object</code>
Return a combined selector response using a "Promise.race" like response.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  

| Param | Type |
| --- | --- |
| selectors | <code>Array</code> \| <code>function</code> | 
| options | <code>object</code> | 
| options.useSelectorsResponse | <code>function</code> | 

<a name="Middleware.module_ActionRecordMiddleware"></a>

## ActionRecordMiddleware

* [ActionRecordMiddleware](#Middleware.module_ActionRecordMiddleware)
    * [~sanitizeActionHeaders(action)](#Middleware.module_ActionRecordMiddleware..sanitizeActionHeaders) ⇒ <code>object</code>
    * [~sanitizeData(action)](#Middleware.module_ActionRecordMiddleware..sanitizeData) ⇒ <code>object</code>
    * [~getActions(id, limit)](#Middleware.module_ActionRecordMiddleware..getActions) ⇒ <code>Array</code>
    * [~recordAction(action, config)](#Middleware.module_ActionRecordMiddleware..recordAction)
    * [~actionRecordMiddleware(config)](#Middleware.module_ActionRecordMiddleware..actionRecordMiddleware) ⇒ <code>function</code>

<a name="Middleware.module_ActionRecordMiddleware..sanitizeActionHeaders"></a>

### ActionRecordMiddleware~sanitizeActionHeaders(action) ⇒ <code>object</code>
Modify actions' payload for privacy.

**Kind**: inner method of [<code>ActionRecordMiddleware</code>](#Middleware.module_ActionRecordMiddleware)  

| Param | Type |
| --- | --- |
| action | <code>object</code> | 
| action.payload | <code>object</code> | 

<a name="Middleware.module_ActionRecordMiddleware..sanitizeData"></a>

### ActionRecordMiddleware~sanitizeData(action) ⇒ <code>object</code>
Modify actions' payload data for privacy.

**Kind**: inner method of [<code>ActionRecordMiddleware</code>](#Middleware.module_ActionRecordMiddleware)  

| Param | Type |
| --- | --- |
| action | <code>object</code> | 
| action.type | <code>string</code> | 
| action.payload | <code>object</code> | 

<a name="Middleware.module_ActionRecordMiddleware..getActions"></a>

### ActionRecordMiddleware~getActions(id, limit) ⇒ <code>Array</code>
Return existing sessionStorage log.

**Kind**: inner method of [<code>ActionRecordMiddleware</code>](#Middleware.module_ActionRecordMiddleware)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 
| limit | <code>number</code> | 

<a name="Middleware.module_ActionRecordMiddleware..recordAction"></a>

### ActionRecordMiddleware~recordAction(action, config)
Store actions against an id in sessionStorage.

**Kind**: inner method of [<code>ActionRecordMiddleware</code>](#Middleware.module_ActionRecordMiddleware)  

| Param | Type |
| --- | --- |
| action | <code>object</code> | 
| config | <code>object</code> | 
| config.id | <code>number</code> | 
| config.limit | <code>number</code> | 

<a name="Middleware.module_ActionRecordMiddleware..actionRecordMiddleware"></a>

### ActionRecordMiddleware~actionRecordMiddleware(config) ⇒ <code>function</code>
Expose settings and record middleware.

**Kind**: inner method of [<code>ActionRecordMiddleware</code>](#Middleware.module_ActionRecordMiddleware)  

| Param | Type |
| --- | --- |
| config | <code>object</code> | 

<a name="Redux State.module_Middleware"></a>

## Middleware
**Properties**

| Name | Type |
| --- | --- |
| ActionRecordMiddleware | <code>module</code> | 
| MultiActionMiddleware | <code>module</code> | 
| StatusMiddleware | <code>module</code> | 

<a name="Redux State.module_Middleware..reduxMiddleware"></a>

### Middleware~reduxMiddleware : <code>Array</code>
Redux middleware.

**Kind**: inner constant of [<code>Middleware</code>](#Redux State.module_Middleware)  
<a name="Middleware.module_MultiActionMiddleware"></a>

## MultiActionMiddleware
<a name="Middleware.module_MultiActionMiddleware..multiActionMiddleware"></a>

### MultiActionMiddleware~multiActionMiddleware(store) ⇒ <code>function</code>
Allow passing an array of actions for batch dispatch.

**Kind**: inner method of [<code>MultiActionMiddleware</code>](#Middleware.module_MultiActionMiddleware)  

| Param | Type |
| --- | --- |
| store | <code>object</code> | 

<a name="Middleware.module_StatusMiddleware"></a>

## StatusMiddleware
<a name="Middleware.module_StatusMiddleware..statusMiddleware"></a>

### StatusMiddleware~statusMiddleware(config) ⇒ <code>function</code>
Apply a status type based on actions, such as those generated from redux-promise-middleware.

**Kind**: inner method of [<code>StatusMiddleware</code>](#Middleware.module_StatusMiddleware)  

| Param | Type |
| --- | --- |
| config | <code>object</code> | 

**Properties**

| Name | Type |
| --- | --- |
| statusSuffix | <code>string</code> | 
| rangeSuffix | <code>string</code> | 
| rangeFiller | <code>string</code> | 
| statusDelimiter | <code>string</code> | 
| statusRange | <code>boolean</code> | 
| dispatchStatus | <code>boolean</code> | 

<a name="Reducers.module_GraphReducer"></a>

## GraphReducer
<a name="Reducers.module_GraphReducer..graphReducer"></a>

### GraphReducer~graphReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Apply graph interaction, and generated graph observer/reducer for reportCapacity to state,
against actions.

**Kind**: inner method of [<code>GraphReducer</code>](#Reducers.module_GraphReducer)  

| Param | Type |
| --- | --- |
| state | <code>object</code> | 
| action | <code>object</code> | 

<a name="Redux State.module_Reducers"></a>

## Reducers
**Properties**

| Name | Type |
| --- | --- |
| GraphReducer | <code>module</code> | 
| InventoryReducer | <code>module</code> | 
| MessagesReducer | <code>module</code> | 
| ToolbarReducer | <code>module</code> | 
| UserReducer | <code>module</code> | 
| ViewReducer | <code>module</code> | 

<a name="Redux State.module_Reducers..reducers"></a>

### Reducers~reducers : <code>Object</code>
Redux reducers

**Kind**: inner constant of [<code>Reducers</code>](#Redux State.module_Reducers)  
<a name="Reducers.module_InventoryReducer"></a>

## InventoryReducer
<a name="Reducers.module_InventoryReducer..inventoryReducer"></a>

### InventoryReducer~inventoryReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Apply generated inventory observer/reducer for hosts/system and subscriptions inventory to state,
against actions.

**Kind**: inner method of [<code>InventoryReducer</code>](#Reducers.module_InventoryReducer)  

| Param | Type |
| --- | --- |
| state | <code>object</code> | 
| action | <code>object</code> | 

<a name="Reducers.module_MessagesReducer"></a>

## MessagesReducer
<a name="Reducers.module_MessagesReducer..messagesReducer"></a>

### MessagesReducer~messagesReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Generated daily observer/reducer for report to state,
against actions.

**Kind**: inner method of [<code>MessagesReducer</code>](#Reducers.module_MessagesReducer)  

| Param | Type |
| --- | --- |
| state | <code>object</code> | 
| action | <code>object</code> | 

<a name="Reducers.module_ToolbarReducer"></a>

## ToolbarReducer
<a name="Reducers.module_ToolbarReducer..toolbarReducer"></a>

### ToolbarReducer~toolbarReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Apply user observer/reducer logic for toolbar to state, against actions.

**Kind**: inner method of [<code>ToolbarReducer</code>](#Reducers.module_ToolbarReducer)  

| Param | Type |
| --- | --- |
| state | <code>object</code> | 
| action | <code>object</code> | 

<a name="Reducers.module_UserReducer"></a>

## UserReducer
<a name="Reducers.module_UserReducer..userReducer"></a>

### UserReducer~userReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Apply user observer/reducer logic for session to state, against actions.

**Kind**: inner method of [<code>UserReducer</code>](#Reducers.module_UserReducer)  

| Param | Type |
| --- | --- |
| state | <code>object</code> | 
| action | <code>object</code> | 

<a name="Reducers.module_ViewReducer"></a>

## ViewReducer
<a name="Reducers.module_ViewReducer..viewReducer"></a>

### ViewReducer~viewReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Apply user observer/reducer logic for views to state, against actions.

**Kind**: inner method of [<code>ViewReducer</code>](#Reducers.module_ViewReducer)  

| Param | Type |
| --- | --- |
| state | <code>object</code> | 
| action | <code>object</code> | 

<a name="Redux State.module_Store"></a>

## Store
<a name="Redux State.module_Store..store"></a>

### Store~store : <code>Object</code>
Create a Redux store.

**Kind**: inner constant of [<code>Store</code>](#Redux State.module_Store)  
<a name="Types.module_AppTypes"></a>

## AppTypes
<a name="Types.module_AppTypes..appTypes"></a>

### AppTypes~appTypes : <code>Object</code>
Application action, reducer types.

**Kind**: inner constant of [<code>AppTypes</code>](#Types.module_AppTypes)  
<a name="Types.module_GraphTypes"></a>

## GraphTypes
<a name="Types.module_GraphTypes..graphTypes"></a>

### GraphTypes~graphTypes : <code>Object</code>
Graph action, reducer types.

**Kind**: inner constant of [<code>GraphTypes</code>](#Types.module_GraphTypes)  
<a name="Redux State.module_Types"></a>

## Types
**Properties**

| Name | Type |
| --- | --- |
| AppTypes | <code>module</code> | 
| GraphTypes | <code>module</code> | 
| InventoryTypes | <code>module</code> | 
| PlatformTypes | <code>module</code> | 
| QueryTypes | <code>module</code> | 
| RhsmTypes | <code>module</code> | 
| ToolbarTypes | <code>module</code> | 
| UserTypes | <code>module</code> | 

<a name="Redux State.module_Types..reduxTypes"></a>

### Types~reduxTypes : <code>Object</code>
Redux types

**Kind**: inner constant of [<code>Types</code>](#Redux State.module_Types)  
<a name="Types.module_InventoryTypes"></a>

## InventoryTypes
<a name="Types.module_InventoryTypes..inventoryTypes"></a>

### InventoryTypes~inventoryTypes : <code>Object</code>
Inventory action, reducer types.

**Kind**: inner constant of [<code>InventoryTypes</code>](#Types.module_InventoryTypes)  
<a name="Types.module_PlatformTypes"></a>

## PlatformTypes
<a name="Types.module_PlatformTypes..platformTypes"></a>

### PlatformTypes~platformTypes : <code>Object</code>
Platform action, reducer types.

**Kind**: inner constant of [<code>PlatformTypes</code>](#Types.module_PlatformTypes)  
<a name="Types.module_QueryTypes"></a>

## QueryTypes

* [QueryTypes](#Types.module_QueryTypes)
    * [~SET_QUERY_RHSM_TYPES](#Types.module_QueryTypes..SET_QUERY_RHSM_TYPES)
    * [~SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES](#Types.module_QueryTypes..SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES)
    * [~SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES](#Types.module_QueryTypes..SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES)
    * [~SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES](#Types.module_QueryTypes..SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES)
    * [~queryTypes](#Types.module_QueryTypes..queryTypes) : <code>Object</code>

<a name="Types.module_QueryTypes..SET_QUERY_RHSM_TYPES"></a>

### QueryTypes~SET\_QUERY\_RHSM\_TYPES
Query types associated with across ALL queries.

**Kind**: inner constant of [<code>QueryTypes</code>](#Types.module_QueryTypes)  
<a name="Types.module_QueryTypes..SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES"></a>

### QueryTypes~SET\_QUERY\_RHSM\_GUESTS\_INVENTORY\_TYPES
Inventory query types associated with only GUESTS' queries.

**Kind**: inner constant of [<code>QueryTypes</code>](#Types.module_QueryTypes)  
<a name="Types.module_QueryTypes..SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES"></a>

### QueryTypes~SET\_QUERY\_RHSM\_HOSTS\_INVENTORY\_TYPES
Inventory query types associated with only HOSTS' and INSTANCES' queries.

**Kind**: inner constant of [<code>QueryTypes</code>](#Types.module_QueryTypes)  
<a name="Types.module_QueryTypes..SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES"></a>

### QueryTypes~SET\_QUERY\_RHSM\_SUBSCRIPTIONS\_INVENTORY\_TYPES
Inventory query types associated with only SUBSCRIPTIONS' queries.

**Kind**: inner constant of [<code>QueryTypes</code>](#Types.module_QueryTypes)  
<a name="Types.module_QueryTypes..queryTypes"></a>

### QueryTypes~queryTypes : <code>Object</code>
Query/filter reducer types.

**Kind**: inner constant of [<code>QueryTypes</code>](#Types.module_QueryTypes)  
<a name="Types.module_RhsmTypes"></a>

## RhsmTypes
<a name="Types.module_RhsmTypes..rhsmTypes"></a>

### RhsmTypes~rhsmTypes : <code>Object</code>
RHSM API action, reducer types.

**Kind**: inner constant of [<code>RhsmTypes</code>](#Types.module_RhsmTypes)  
<a name="Types.module_ToolbarTypes"></a>

## ToolbarTypes
<a name="Types.module_ToolbarTypes..toolbarTypes"></a>

### ToolbarTypes~toolbarTypes : <code>Object</code>
Filter, toolbar reducer types.

**Kind**: inner constant of [<code>ToolbarTypes</code>](#Types.module_ToolbarTypes)  
<a name="Types.module_UserTypes"></a>

## UserTypes
<a name="Types.module_UserTypes..userTypes"></a>

### UserTypes~userTypes : <code>Object</code>
User action, reducer types.

**Kind**: inner constant of [<code>UserTypes</code>](#Types.module_UserTypes)  
<a name="Redux State"></a>

## Redux State : <code>object</code>
**Kind**: global namespace  
**Properties**

| Name | Type |
| --- | --- |
| Store | <code>module</code> | 
| Actions | <code>module</code> | 
| Helpers | <code>module</code> | 
| Hooks | <code>module</code> | 
| Middleware | <code>module</code> | 
| Reducers | <code>module</code> | 
| Types | <code>module</code> | 

<a name="connectRouter"></a>

## connectRouter(mapStateToProps, mapDispatchToProps) ⇒ <code>function</code>
Wrapper for applying Router Dom withRouter and Redux connect.

**Kind**: global function  

| Param | Type |
| --- | --- |
| mapStateToProps | <code>function</code> | 
| mapDispatchToProps | <code>function</code> | 

