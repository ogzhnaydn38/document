---
id: rest-api-guide
title:  REST API GUIDE
sidebar_label:  REST API GUIDE
sidebar_position: 1
---
# REST API GUIDE

## tickatme-event-service

Event service manages the events of the organizer. It will also manage the event categories and cities and countries.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to .
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the Event Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our Event Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the Event Service via HTTP requests for purposes such as creating, updating, deleting and querying Event objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the Event Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the Event service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

**Protected Routes**:
Certain routes require specific authorization levels. Access to these routes is contingent upon the possession of a valid access token that meets the route-specific authorization criteria. Unauthorized requests to these routes will be rejected.

**Public Routes**:
The service also includes routes that are accessible without authentication. These public endpoints are designed for open access and do not require an access token.

### Token Locations

When including your access token in a request, ensure it is placed in one of the following specified locations. The service will sequentially search these locations for the token, utilizing the first one it encounters.

| Location | Token Name            |
| -------- | --------------------- |
| bearer   | Auth Header           |
| cookie   | tickatme-access-token |

Please ensure the token is correctly placed in one of these locations, using the appropriate label as indicated. The service prioritizes these locations in the order listed, processing the first token it successfully identifies.

## Api Definitions

This section outlines the API endpoints available within the Event service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the Event service.

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the Event service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `Event` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `Event` service.

### Multi Tenant Architecture

The `Event` service operates within a multi tenant architecture.
The service is designed to support multiple tenants, each with its distinct data and configuration. This architecture ensures that data is securely isolated between tenants, preventing unauthorized access and maintaining data integrity.
The service tenant is called `organizer` and identified as `organizerId`.
Other than platform users like superAdmin, saasAdmin and saasUser that belong to the root tenant, the tenant creators(owners) and users will all be associated with an organizer tenant.
When users login their scope will be isolated only to include one tenant data they below. So user may acces only this logined tennat through out the session. After loging in to e specific tenant, users should include the tenant id in their request to access the tenant data. In each request they may access different tenant data if they belong them.

#### Key Points:

- **Tenant-Specific Requests**: It is imperative that each request specifies the tenant it pertains to. This is crucial because most routes are designed to interact exclusively with objects that are part of the specified tenant sandbox.
- **User Distinction**: The requesting user must have a registration for that tenant. The service searches for a `organizer` specific token (cookie or bearer) using the provided `organizer`Id in the request header. Note that to be able to login and use multiple tenant's sites a user must register for them all.
- **Request Header Parameter**: When making a request, include the desired `organizerId` in the request header using the parameter name `mbx-organizer-id`. This signals to the service which domain context to apply for the request processing. Alternatively, you can include the tenant id in the query parameters with the name `organizerId`.
- **Root Tenant**: As all multi tenant architectures this application also has a default root tenant which created automatically. If there is no tenant mark for the request, the request are assumed as to the root tenant. Root tenant is also the hub for registering tenant creating and their owner users. When users register themselves in the root tenant, an (organizer) will alos be created with the given data in the request body and the user will be asssociated with this new tenant record as the `tenantAdmin`.
- **Superadmin account**: A super admin account is created with the given credentials in the design so that there is an absolute user which has all rights in the root tenant and other tenants. This account is used to create and manage all other tenants in the system.
  - **Tenant Registration**: The `Event` service allows for the registration of new tenants. Any user who registers himself in the root tenant through the POST /tenantowners , can create a new organizer publicly with the user registration. The creator user of the organizer record will be registred to the new tenenat with the `tenantAdmin` role.

#### Implementation:

When the user logins there may be few ways for Mindbricks to recognize and set the tenant id in the session.

1. Mindbricks will check the url of the login request if it matches tenant url.
2. Mindbricks will check the `mbx-organizer-id` has the tenant id.
3. Mindbricks will check if the user is associated with a `organizer` in the data model.
   After you login a tenant successfully, ensure that your requests accurately target objects that fall within the tenant scope set during the login session.
   Ensure your requests are correctly formatted to include the domain sandbox information in the header. This enables the `Event` service to accurately identify the domain context, facilitating proper access control and data management based on the user's permissions and the specified domain.

```js
axios({
  method: 'GET',
  headers: {
    'mbx-organizer-id': 'Your-organizerId-here'
  }
  url: "/someroutepath",
  data: {
    "someData":"someData"
  },
  params: {
    "aParam":"aParam"
  }
});
```

By adhering to this domain sandbox model, the `Event` service maintains a secure and organized structure for handling requests across different domains, ensuring that operations are performed within the correct contextual boundaries.

### Error Response

If a request encounters an issue, whether due to a logical fault or a technical problem, the service responds with a standardized JSON error structure. The HTTP status code within this response indicates the nature of the error, utilizing commonly recognized codes for clarity:

- **400 Bad Request**: The request was improperly formatted or contained invalid parameters, preventing the server from processing it.
- **401 Unauthorized**: The request lacked valid authentication credentials or the credentials provided do not grant access to the requested resource.
- **404 Not Found**: The requested resource was not found on the server.
- **500 Internal Server Error**: The server encountered an unexpected condition that prevented it from fulfilling the request.

Each error response is structured to provide meaningful insight into the problem, assisting in diagnosing and resolving issues efficiently.

```js
{
  "result": "ERR",
  "status": 400,
  "message": "errMsg_organizationIdisNotAValidID",
  "errCode": 400,
  "date": "2024-03-19T12:13:54.124Z",
  "detail": "String"
}
```

### Object Structure of a Successfull Response

When the `Event` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

**Key Characteristics of the Response Envelope:**

- **Data Presentation**: Depending on the nature of the request, the service returns either a single data object or an array of objects encapsulated within the JSON envelope.

  - **Creation and Update Routes**: These routes return the unmodified (pure) form of the data object(s), without any associations to other data objects.
  - **Delete Routes**: Even though the data is removed from the database, the last known state of the data object(s) is returned in its pure form.
  - **Get Requests**: A single data object is returned in JSON format.
  - **Get List Requests**: An array of data objects is provided, reflecting a collection of resources.

- **Data Structure and Joins**: The complexity of the data structure in the response can vary based on the route's architectural design and the join options specified in the request. The architecture might inherently limit join operations, or they might be dynamically controlled through query parameters.
  - **Pure Data Forms**: In some cases, the response mirrors the exact structure found in the primary data table, without extensions.
  - **Extended Data Forms**: Alternatively, responses might include data extended through joins with tables within the same service or aggregated from external sources, such as ElasticSearch indices related to other services.
  - **Join Varieties**: The extensions might involve one-to-one joins, resulting in single object associations, or one-to-many joins, leading to an array of objects. In certain instances, the data might even feature nested inclusions from other data objects.

**Design Considerations**: The structure of a route's response data is meticulously crafted during the service's architectural planning. This design ensures that responses adequately reflect the intended data relationships and service logic, providing clients with rich and meaningful information.

**Brief Data**: Certain routes return a condensed version of the object data, intentionally selecting only specific fields deemed useful for that request. In such instances, the route documentation will detail the properties included in the response, guiding developers on what to expect.

### API Response Structure

The API utilizes a standardized JSON envelope to encapsulate responses. This envelope is designed to consistently deliver both the requested data and essential metadata, ensuring that clients can efficiently interpret and utilize the response.

**HTTP Status Codes:**

- **200 OK**: This status code is returned for successful GET, GETLIST, UPDATE, or DELETE operations, indicating that the request has been processed successfully.
- **201 Created**: This status code is specific to CREATE operations, signifying that the requested resource has been successfully created.

**Success Response Format:**

For successful operations, the response includes a `"status": "OK"` property, signaling the successful execution of the request. The structure of a successful response is outlined below:

```json
{
  "status":"OK",
  "statusCode": 200,
  "elapsedMs":126,
  "ssoTime":120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName":"products",
  "method":"GET",
  "action":"getlist",
  "appVersion":"Version",
  "rowCount":3
  "products":[{},{},{}],
  "paging": {
    "pageNumber":1,
    "pageRowCount":25,
    "totalRowCount":3,
    "pageCount":1
  },
  "filters": [],
  "uiPermissions": []
}
```

- **`products`**: In this example, this key contains the actual response content, which may be a single object or an array of objects depending on the operation performed.

**Handling Errors:**

For details on handling error scenarios and understanding the structure of error responses, please refer to the "Error Response" section provided earlier in this documentation. It outlines how error conditions are communicated, including the use of HTTP status codes and standardized JSON structures for error messages.

**Route Validation Layers:**

Route Validations may be executed in 4 different layers. The layer is a kind of time definition in the route life cycle. Note that while conditional check times are defined by layers, the fetch actions are defined by access times.

`layer1`: "The first layer of route life cycle which is just after the request parameters are validated and the request is in controller. Any script, validation or data operation in this layer can access the route parameters only. The beforeInstance data is not ready yet."

`layer2`: "The second layer of route life cycle which is just after beforeInstance data is collected before the main operation of the route and the main operation is not started yet. In this layer the collected supplementary data is accessable with the route parameters."

`layer3`: "The third layer of route life cycle which is just after the main operation of the route is completed. In this layer the main operation result is accessable with the beforeInstance data and route parameters. Note that the afterInstance data is not ready yet."

`layer4`: "The last layer of route life cycle which is just after afterInstance supplementary data is collected. In this layer the afterInstance data is accessable with the main operation result, beforeInstance data and route parameters."

## Resources

Event service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### Event resource

_Resource Definition_ : Event data object stores the organizer&#39;s events.
_Event Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **eventName** | Text | | | _Event name represents the commercial name of the event. _ |
| **eventInfo** | Text | | | _EventInfo is a text field which stores event information to show the user._ |
| **ownerId** | ID | | | _OwnerId is the ID field to store the user id of the logined organizer staff. It will be populated from the session._ |
| **eventImage** | String | | | _EventImage stores the bucket url path of the image which is loaded to the bucket for this event._ |
| **startDate** | Date | | | _StartDate is a date time value to store the start date and time of the event._ |
| **minutes** | Integer | | | _minutes is an integer value to store how long will the event last in minute unit? _ |
| **categoryId** | ID | | | _the ID of the category of the event. The category is stored in an other data object named category._ |
| **venueName** | String | | | _A name to define the location of the event. It can be like Istanbul Concert Hall, Taksim Square or more indie like My home._ |
| **venueAddress** | Text | | | _A full text are to store the address of the venue. It can be in any format and can include also extra instrcutions._ |
| **venueLocation** | String | | | _The location of the venu as formatted string of 4 double values seperated by comma._ |
| **cityId** | ID | | | _The Id of the city where the event is handled._ |
| **countryId** | ID | | | _the ID of the country where the event will be handled. Will be populated automatically using cityId._ |
| **capacity** | Integer | | | _An integer value to represent the maximum tickets that can be sold for the event. 0 means no limit._ |
| **price** | Float | | | _The ticket price of the event. 0 for free._ |
| **published** | String | | | ** |
| **organizerId\** | ID | | | *An ID value to represent the tenant id of the organizer\* |

### Category resource

_Resource Definition_ : Category data object stores information for the event categories. It will be represented in other data object as categoryId. The categories will be added by only saasAdmin.
_Category Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **name** | String | | | _The name of the category as an English word._ |
| **sortOrder** | Integer | | | _An integer value the define the sort order of the category when the categories are listed in UI._ |
| **featured** | Boolean | | | _A boolean value to define whether the category is featured or not. Featured categories will be served by a separate api._ |
| **published** | Boolean | | | _A boolean value to inactivate a category for a short time. All categories are marked published as default._ |

### Country resource

_Resource Definition_ : A table to store countries. It will be accessed by only saas admin.
_Country Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **countryName** | String | | | _The name of the country as named in English._ |
| **published** | Boolean | | | _A boolean value to use to inactivate the country. All countries will be publiched by default._ |

### City resource

_Resource Definition_ : A data object to store the cities to address to the events. Cities belong to a country. Cities can only be managed by saas admin.
_City Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **cityName** | String | | | _The name of the city as spelled in English._ |
| **countryId** | ID | | | _The id of the country that the city belongs. It should be the id value of the country in country data store._ |
| **published** | Boolean | | | _A boolean value to inactivate the city in the app. All cities are published by default._ |

## Route:

_Route Type_ : get
_Default access route_ : _GET_ `/events/:eventId`

### Parameters

The retrive-event api has got 1 parameter

| Parameter | Type | Required | Population              |
| --------- | ---- | -------- | ----------------------- |
| eventId   | ID   | true     | request.params?.eventId |

To access the api you can use the **REST** controller with the path **GET /events/:eventId**

```js
axios({
  method: "GET",
  url: `/events/${eventId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`event`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "event",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "event": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : create
_Default access route_ : _POST_ `/events`

### Parameters

The create-event api has got 14 parameters

| Parameter     | Type    | Required | Population                  |
| ------------- | ------- | -------- | --------------------------- |
| eventName     | Text    |          | request.body?.eventName     |
| eventInfo     | Text    |          | request.body?.eventInfo     |
| eventImage    | String  |          | request.body?.eventImage    |
| startDate     | Date    |          | request.body?.startDate     |
| minutes       | Integer |          | request.body?.minutes       |
| categoryId    | ID      |          | request.body?.categoryId    |
| venueName     | String  |          | request.body?.venueName     |
| venueAddress  | Text    |          | request.body?.venueAddress  |
| venueLocation | String  |          | request.body?.venueLocation |
| cityId        | ID      |          | request.body?.cityId        |
| countryId     | ID      |          | request.body?.countryId     |
| capacity      | Integer |          | request.body?.capacity      |
| price         | Float   |          | request.body?.price         |
| published     | String  |          | request.body?.published     |

To access the api you can use the **REST** controller with the path **POST /events**

```js
axios({
  method: "POST",
  url: "/events",
  data: {
    eventName: "Text",
    eventInfo: "Text",
    eventImage: "String",
    startDate: "Date",
    minutes: "Integer",
    categoryId: "ID",
    venueName: "String",
    venueAddress: "Text",
    venueLocation: "String",
    cityId: "ID",
    countryId: "ID",
    capacity: "Integer",
    price: "Float",
    published: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`event`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "event",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "event": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : getList
_Default access route_ : _GET_ `/organizerevents`

The get-organizerevents api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /organizerevents**

```js
axios({
  method: "GET",
  url: "/organizerevents",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`events`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "events",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": 1,
  "events": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : update
_Default access route_ : \*\* `/events/:eventId`

### Parameters

The update-event api has got 15 parameters

| Parameter     | Type    | Required | Population                  |
| ------------- | ------- | -------- | --------------------------- |
| eventName     | Text    | false    | request.body?.eventName     |
| eventInfo     | Text    | false    | request.body?.eventInfo     |
| eventImage    | String  | false    | request.body?.eventImage    |
| startDate     | Date    | false    | request.body?.startDate     |
| minutes       | Integer | false    | request.body?.minutes       |
| categoryId    | ID      | false    | request.body?.categoryId    |
| venueName     | String  | false    | request.body?.venueName     |
| venueAddress  | Text    | false    | request.body?.venueAddress  |
| venueLocation | String  | false    | request.body?.venueLocation |
| cityId        | ID      | false    | request.body?.cityId        |
| countryId     | ID      | false    | request.body?.countryId     |
| capacity      | Integer | false    | request.body?.capacity      |
| price         | Float   | false    | request.body?.price         |
| published     | String  | false    | request.body?.published     |
| eventId       | ID      | true     | request.params?.eventId     |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: 
This validation will be executed on layer3
*/
if (!this.event.published == false || this.startDate == null) {
  throw new BadRequestError("errMsg_publishedEventDatesCanNotBeChanged");
}
```

To access the api you can use the **REST** controller with the path ** /events/:eventId**

```js
axios({
  method: "",
  url: `/events/${eventId}`,
  data: {
    eventName: "Text",
    eventInfo: "Text",
    eventImage: "String",
    startDate: "Date",
    minutes: "Integer",
    categoryId: "ID",
    venueName: "String",
    venueAddress: "Text",
    venueLocation: "String",
    cityId: "ID",
    countryId: "ID",
    capacity: "Integer",
    price: "Float",
    published: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`event`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "event",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "event": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : update
_Default access route_ : \*\* `/events/:eventId`

### Parameters

The publish-event api has got 1 parameter

| Parameter | Type | Required | Population              |
| --------- | ---- | -------- | ----------------------- |
| eventId   | ID   | true     | request.params?.eventId |

To access the api you can use the **REST** controller with the path ** /events/:eventId**

```js
axios({
  method: "",
  url: `/events/${eventId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`event`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "event",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "event": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : getList
_Default access route_ : _GET_ `/userevents`

The retreive-userevents api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /userevents**

```js
axios({
  method: "GET",
  url: "/userevents",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`events`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "events",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": 1,
  "events": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : get
_Default access route_ : _GET_ `/categories/:categoryId`

### Parameters

The retrive-category api has got 1 parameter

| Parameter  | Type | Required | Population                 |
| ---------- | ---- | -------- | -------------------------- |
| categoryId | ID   | true     | request.params?.categoryId |

To access the api you can use the **REST** controller with the path **GET /categories/:categoryId**

```js
axios({
  method: "GET",
  url: `/categories/${categoryId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`category`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "category",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "category": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : create
_Default access route_ : _POST_ `/categories`

### Parameters

The create-category api has got 4 parameters

| Parameter | Type    | Required | Population              |
| --------- | ------- | -------- | ----------------------- |
| name      | String  |          | request.body?.name      |
| sortOrder | Integer |          | request.body?.sortOrder |
| featured  | Boolean |          | request.body?.featured  |
| published | Boolean |          | request.body?.published |

To access the api you can use the **REST** controller with the path **POST /categories**

```js
axios({
  method: "POST",
  url: "/categories",
  data: {
    name: "String",
    sortOrder: "Integer",
    featured: "Boolean",
    published: "Boolean",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`category`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "category",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "category": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : getList
_Default access route_ : _GET_ `/categories`

The list-categories api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /categories**

```js
axios({
  method: "GET",
  url: "/categories",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`categories`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "categories",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": 1,
  "categories": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : get
_Default access route_ : _GET_ `/countries/:countryId`

### Parameters

The find-country api has got 1 parameter

| Parameter | Type | Required | Population                |
| --------- | ---- | -------- | ------------------------- |
| countryId | ID   | true     | request.params?.countryId |

To access the api you can use the **REST** controller with the path **GET /countries/:countryId**

```js
axios({
  method: "GET",
  url: `/countries/${countryId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`country`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "country",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "country": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : getList
_Default access route_ : _GET_ `/countries`

The list-countries api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /countries**

```js
axios({
  method: "GET",
  url: "/countries",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`countries`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "countries",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": 1,
  "countries": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : create
_Default access route_ : _POST_ `/countries`

### Parameters

The create-country api has got 2 parameters

| Parameter   | Type    | Required | Population                |
| ----------- | ------- | -------- | ------------------------- |
| countryName | String  |          | request.body?.countryName |
| published   | Boolean |          | request.body?.published   |

To access the api you can use the **REST** controller with the path **POST /countries**

```js
axios({
  method: "POST",
  url: "/countries",
  data: {
    countryName: "String",
    published: "Boolean",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`country`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "country",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "country": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : get
_Default access route_ : _GET_ `/cities/:cityId`

### Parameters

The retrive-city api has got 1 parameter

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| cityId    | ID   | true     | request.params?.cityId |

To access the api you can use the **REST** controller with the path **GET /cities/:cityId**

```js
axios({
  method: "GET",
  url: `/cities/${cityId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`city`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "city",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "city": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : getList
_Default access route_ : _GET_ `/cities`

### Parameters

The get-cities api has got 1 parameter

| Parameter | Type | Required | Population               |
| --------- | ---- | -------- | ------------------------ |
| countryId | ID   |          | request.query?.countryId |

To access the api you can use the **REST** controller with the path **GET /cities**

```js
axios({
  method: "GET",
  url: "/cities",
  data: {},
  params: {
    countryId: '"ID"',
  },
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`cities`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "cities",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": 1,
  "cities": { "id": "ID", "isActive": true }
}
```

## Route:

_Route Type_ : create
_Default access route_ : _POST_ `/cities`

### Parameters

The create-city api has got 3 parameters

| Parameter | Type    | Required | Population              |
| --------- | ------- | -------- | ----------------------- |
| cityName  | String  |          | request.body?.cityName  |
| countryId | ID      |          | request.body?.countryId |
| published | Boolean |          | request.body?.published |

To access the api you can use the **REST** controller with the path **POST /cities**

```js
axios({
  method: "POST",
  url: "/cities",
  data: {
    cityName: "String",
    countryId: "ID",
    published: "Boolean",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`city`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "city",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "city": { "id": "ID", "isActive": true }
}
```

## Copyright

All sources, documents and other digital materials are copyright of .

## About Us

For more information please visit our website: .

.
.
