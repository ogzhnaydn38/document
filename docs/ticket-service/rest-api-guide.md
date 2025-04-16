---
id: rest-api-guide
title:  REST API GUIDE
sidebar_label:  REST API GUIDE
sidebar_position: 1
---
# REST API GUIDE

## tickatme-ticket-service

Ticket service is responsible for managing the orders for joining to the events and their payments through Stripe payment...

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to .
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the Ticket Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our Ticket Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the Ticket Service via HTTP requests for purposes such as creating, updating, deleting and querying Ticket objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the Ticket Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the Ticket service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

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

This section outlines the API endpoints available within the Ticket service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the Ticket service.

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the Ticket service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `Ticket` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `Ticket` service.

### Multi Tenant Architecture

The `Ticket` service operates within a multi tenant architecture.
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
  - **Tenant Registration**: The `Ticket` service allows for the registration of new tenants. Any user who registers himself in the root tenant through the POST /tenantowners , can create a new organizer publicly with the user registration. The creator user of the organizer record will be registred to the new tenenat with the `tenantAdmin` role.

#### Implementation:

When the user logins there may be few ways for Mindbricks to recognize and set the tenant id in the session.

1. Mindbricks will check the url of the login request if it matches tenant url.
2. Mindbricks will check the `mbx-organizer-id` has the tenant id.
3. Mindbricks will check if the user is associated with a `organizer` in the data model.
   After you login a tenant successfully, ensure that your requests accurately target objects that fall within the tenant scope set during the login session.
   Ensure your requests are correctly formatted to include the domain sandbox information in the header. This enables the `Ticket` service to accurately identify the domain context, facilitating proper access control and data management based on the user's permissions and the specified domain.

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

By adhering to this domain sandbox model, the `Ticket` service maintains a secure and organized structure for handling requests across different domains, ensuring that operations are performed within the correct contextual boundaries.

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

When the `Ticket` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

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

Ticket service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### Ticket resource

_Resource Definition_ : Ticket is a data object that stores the tickets of user and their status.
_Ticket Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **eventId** | ID | | | _Event id is trhe id of the event which the ticket is for._ |
| **userId** | ID | | | _Userid stands for the id of the user who purchased it, the value is assigned from session._ |
| **price** | Float | | | _price is the amount that will be charged to the ticket owner_ |
| **eventStartDate** | Date | | | _Event date is a date time value to store the date of the event._ |
| **eventMinutes** | Integer | | | _eventTime is the period of the event in minutes._ |
| **status** | String | | | _Status is a string value to mark the current state of the ticket. Possible values are created, paid, paymentFailed, scanned_ |
| **statusUpdateDate** | Date | | | _The date time of the status update._ |
| **organizerId** | ID | | | _An ID value to represent the tenant id of the organizer_ |

### TicketPayment resource

_Resource Definition_ : A payment storage object to store the payment life cyle of orders based on ticket object. It is autocreated based on the source object&#39;s checkout config
_TicketPayment Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **ownerId** | ID | | | _ An ID value to represent owner user who created the order_ |
| **orderId** | ID | | | _an ID value to represent the orderId which is the ID parameter of the source ticket object_ |
| **paymentId** | String | | | _A String value to represent the paymentId which is generated on the Stripe gateway. This id may represent different objects due to the payment gateway and the chosen flow type_ |
| **paymentStatus** | String | | | _A string value to represent the payment status which belongs to the lifecyle of a Stripe payment._ |
| **statusLiteral** | String | | | _A string value to represent the logical payment status which belongs to the application lifecycle itself._ |
| **redirectUrl** | String | | | _A string value to represent return page of the frontend to show the result of the payment, this is used when the callback is made to server not the client._ |
| **organizerId** | ID | | | _An ID value to represent the tenant id of the organizer_ |

### PaymentCustomer resource

_Resource Definition_ : A payment storage object to store the customer values of the payment platform
_PaymentCustomer Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **userId** | ID | | | _ An ID value to represent the user who is created as a stripe customer_ |
| **customerId** | String | | | _A string value to represent the customer id which is generated on the Stripe gateway. This id is used to represent the customer in the Stripe gateway_ |
| **platform** | String | | | _A String value to represent payment platform which is used to make the payment. It is stripe as default. It will be used to distinguesh the payment gateways in the future._ |
| **organizerId** | ID | | | _An ID value to represent the tenant id of the organizer_ |

### PaymentMethod resource

_Resource Definition_ : A payment storage object to store the payment methods of the platform customers
_PaymentMethod Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **paymentMethodId** | String | | | _A string value to represent the id of the payment method on the payment platform._ |
| **userId** | ID | | | _ An ID value to represent the user who owns the payment method_ |
| **customerId** | String | | | _A string value to represent the customer id which is generated on the payment gateway._ |
| **cardHolderName** | String | | | _A string value to represent the name of the card holder. It can be different than the registered customer._ |
| **cardHolderZip** | String | | | _A string value to represent the zip code of the card holder. It is used for address verification in specific countries._ |
| **platform** | String | | | _A String value to represent payment platform which teh paymentMethod belongs. It is stripe as default. It will be used to distinguesh the payment gateways in the future._ |
| **cardInfo** | Object | | | _A Json value to store the card details of the payment method._ |
| **organizerId** | ID | | | _An ID value to represent the tenant id of the organizer_ |

## Crud Routes

### Route: create-ticket

_Route Type_ : create

_Default access route_ : _POST_ `/tickets`

#### Parameters

The create-ticket api has got 6 parameters

| Parameter        | Type    | Required | Population                     |
| ---------------- | ------- | -------- | ------------------------------ |
| eventId          | ID      |          | request.body?.eventId          |
| price            | Float   |          | request.body?.price            |
| eventStartDate   | Date    |          | request.body?.eventStartDate   |
| eventMinutes     | Integer |          | request.body?.eventMinutes     |
| status           | String  |          | request.body?.status           |
| statusUpdateDate | Date    |          | request.body?.statusUpdateDate |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the current ticket count of the event is lower than the event capacity.
This validation will be executed on layer2
*/
if (!this.ticketCount < (this.ticketEvent?.capacity ?? 10)) {
  throw new BadRequestError("errMsg_eventTicketsAreSoldOut");
}
```

To access the api you can use the **REST** controller with the path **POST /tickets**

```js
axios({
  method: "POST",
  url: "/tickets",
  data: {
    eventId: "ID",
    price: "Float",
    eventStartDate: "Date",
    eventMinutes: "Integer",
    status: "String",
    statusUpdateDate: "Date",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`ticket`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "ticket",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "ticket": { "id": "ID", "isActive": true }
}
```

### Route: startcheckout-ticket

_Route Type_ : update

_Default access route_ : _PATCH_ `/startcheckout/ticket/:ticketId`

#### Parameters

The startcheckout-ticket api has got 7 parameters

| Parameter        | Type    | Required | Population                     |
| ---------------- | ------- | -------- | ------------------------------ |
| eventId          | ID      | false    | request.body?.eventId          |
| price            | Float   | false    | request.body?.price            |
| eventStartDate   | Date    | false    | request.body?.eventStartDate   |
| eventMinutes     | Integer | false    | request.body?.eventMinutes     |
| status           | String  | false    | request.body?.status           |
| statusUpdateDate | Date    | false    | request.body?.statusUpdateDate |
| ticketId         | ID      | true     | request.params?.ticketId       |

To access the api you can use the **REST** controller with the path **PATCH /startcheckout/ticket/:ticketId**

```js
axios({
  method: "PATCH",
  url: `/startcheckout/ticket/${ticketId}`,
  data: {
    eventId: "ID",
    price: "Float",
    eventStartDate: "Date",
    eventMinutes: "Integer",
    status: "String",
    statusUpdateDate: "Date",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`ticket`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "ticket",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "ticket": { "id": "ID", "isActive": true }
}
```

### Route: completecheckout-ticket

_Route Type_ : update

_Default access route_ : _PATCH_ `/completecheckout/ticket/:ticketId`

#### Parameters

The completecheckout-ticket api has got 7 parameters

| Parameter        | Type    | Required | Population                     |
| ---------------- | ------- | -------- | ------------------------------ |
| eventId          | ID      | false    | request.body?.eventId          |
| price            | Float   | false    | request.body?.price            |
| eventStartDate   | Date    | false    | request.body?.eventStartDate   |
| eventMinutes     | Integer | false    | request.body?.eventMinutes     |
| status           | String  | false    | request.body?.status           |
| statusUpdateDate | Date    | false    | request.body?.statusUpdateDate |
| ticketId         | ID      | true     | request.params?.ticketId       |

To access the api you can use the **REST** controller with the path **PATCH /completecheckout/ticket/:ticketId**

```js
axios({
  method: "PATCH",
  url: `/completecheckout/ticket/${ticketId}`,
  data: {
    eventId: "ID",
    price: "Float",
    eventStartDate: "Date",
    eventMinutes: "Integer",
    status: "String",
    statusUpdateDate: "Date",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`ticket`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "ticket",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "ticket": { "id": "ID", "isActive": true }
}
```

### Route: refreshcheckout-ticket

_Route Type_ : update

_Default access route_ : _PATCH_ `/refreshcheckout/ticket/:ticketId`

#### Parameters

The refreshcheckout-ticket api has got 7 parameters

| Parameter        | Type    | Required | Population                     |
| ---------------- | ------- | -------- | ------------------------------ |
| eventId          | ID      | false    | request.body?.eventId          |
| price            | Float   | false    | request.body?.price            |
| eventStartDate   | Date    | false    | request.body?.eventStartDate   |
| eventMinutes     | Integer | false    | request.body?.eventMinutes     |
| status           | String  | false    | request.body?.status           |
| statusUpdateDate | Date    | false    | request.body?.statusUpdateDate |
| ticketId         | ID      | true     | request.params?.ticketId       |

To access the api you can use the **REST** controller with the path **PATCH /refreshcheckout/ticket/:ticketId**

```js
axios({
  method: "PATCH",
  url: `/refreshcheckout/ticket/${ticketId}`,
  data: {
    eventId: "ID",
    price: "Float",
    eventStartDate: "Date",
    eventMinutes: "Integer",
    status: "String",
    statusUpdateDate: "Date",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`ticket`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "ticket",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "ticket": { "id": "ID", "isActive": true }
}
```

### Route: retreive-ticketpayment

_Route Type_ : get

_Default access route_ : _GET_ `/ticketpayments/:ticketPaymentId`

#### Parameters

The retreive-ticketpayment api has got 1 parameter

| Parameter       | Type | Required | Population                      |
| --------------- | ---- | -------- | ------------------------------- |
| ticketPaymentId | ID   | true     | request.params?.ticketPaymentId |

To access the api you can use the **REST** controller with the path **GET /ticketpayments/:ticketPaymentId**

```js
axios({
  method: "GET",
  url: `/ticketpayments/${ticketPaymentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`ticketPayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "ticketPayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "ticketPayment": { "id": "ID", "isActive": true }
}
```

### Route: get-ticketpaymentbyorderid

_Route Type_ : get

_Default access route_ : _GET_ `/ticketpaymentbyorderids/:ticketPaymentId`

#### Parameters

The get-ticketpaymentbyorderid api has got 1 parameter

| Parameter       | Type | Required | Population                      |
| --------------- | ---- | -------- | ------------------------------- |
| ticketPaymentId | ID   | true     | request.params?.ticketPaymentId |

To access the api you can use the **REST** controller with the path **GET /ticketpaymentbyorderids/:ticketPaymentId**

```js
axios({
  method: "GET",
  url: `/ticketpaymentbyorderids/${ticketPaymentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`ticketPayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "ticketPayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "ticketPayment": { "id": "ID", "isActive": true }
}
```

### Route: get-ticketpaymentbypaymentid

_Route Type_ : get

_Default access route_ : _GET_ `/ticketpaymentbypaymentids/:ticketPaymentId`

#### Parameters

The get-ticketpaymentbypaymentid api has got 1 parameter

| Parameter       | Type | Required | Population                      |
| --------------- | ---- | -------- | ------------------------------- |
| ticketPaymentId | ID   | true     | request.params?.ticketPaymentId |

To access the api you can use the **REST** controller with the path **GET /ticketpaymentbypaymentids/:ticketPaymentId**

```js
axios({
  method: "GET",
  url: `/ticketpaymentbypaymentids/${ticketPaymentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`ticketPayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "ticketPayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "ticketPayment": { "id": "ID", "isActive": true }
}
```

### Route: create-ticketpayment

_Route Type_ : create

_Default access route_ : _POST_ `/ticketpayments`

#### Parameters

The create-ticketpayment api has got 5 parameters

| Parameter     | Type   | Required | Population                  |
| ------------- | ------ | -------- | --------------------------- |
| orderId       | ID     |          | request.body?.orderId       |
| paymentId     | String |          | request.body?.paymentId     |
| paymentStatus | String |          | request.body?.paymentStatus |
| statusLiteral | String |          | request.body?.statusLiteral |
| redirectUrl   | String |          | request.body?.redirectUrl   |

To access the api you can use the **REST** controller with the path **POST /ticketpayments**

```js
axios({
  method: "POST",
  url: "/ticketpayments",
  data: {
    orderId: "ID",
    paymentId: "String",
    paymentStatus: "String",
    statusLiteral: "String",
    redirectUrl: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`ticketPayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "ticketPayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "ticketPayment": { "id": "ID", "isActive": true }
}
```

### Route: update-ticketpayment

_Route Type_ : update

_Default access route_ : _PATCH_ `/ticketpayments/:ticketPaymentId`

#### Parameters

The update-ticketpayment api has got 5 parameters

| Parameter       | Type   | Required | Population                      |
| --------------- | ------ | -------- | ------------------------------- |
| paymentId       | String | false    | request.body?.paymentId         |
| paymentStatus   | String | false    | request.body?.paymentStatus     |
| statusLiteral   | String | false    | request.body?.statusLiteral     |
| redirectUrl     | String | false    | request.body?.redirectUrl       |
| ticketPaymentId | ID     | true     | request.params?.ticketPaymentId |

To access the api you can use the **REST** controller with the path **PATCH /ticketpayments/:ticketPaymentId**

```js
axios({
  method: "PATCH",
  url: `/ticketpayments/${ticketPaymentId}`,
  data: {
    paymentId: "String",
    paymentStatus: "String",
    statusLiteral: "String",
    redirectUrl: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`ticketPayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "ticketPayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "ticketPayment": { "id": "ID", "isActive": true }
}
```

### Route: list-ticketpayments

_Route Type_ : getList

_Default access route_ : _GET_ `/ticketpayments`

The list-ticketpayments api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /ticketpayments**

```js
axios({
  method: "GET",
  url: "/ticketpayments",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`ticketPayments`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "ticketPayments",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": 1,
  "ticketPayments": { "id": "ID", "isActive": true }
}
```

### Route: delete-ticketpayments

_Route Type_ : delete

_Default access route_ : _DELETE_ `/ticketpaymentses/:ticketPaymentId`

#### Parameters

The delete-ticketpayments api has got 1 parameter

| Parameter       | Type | Required | Population                      |
| --------------- | ---- | -------- | ------------------------------- |
| ticketPaymentId | ID   | true     | request.params?.ticketPaymentId |

To access the api you can use the **REST** controller with the path **DELETE /ticketpaymentses/:ticketPaymentId**

```js
axios({
  method: "DELETE",
  url: `/ticketpaymentses/${ticketPaymentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`ticketPayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "ticketPayment",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "ticketPayment": { "id": "ID", "isActive": false }
}
```

### Route: retreive-paymentcustomer

_Route Type_ : get

_Default access route_ : _GET_ `/paymentcustomers/:userId`

#### Parameters

The retreive-paymentcustomer api has got 1 parameter

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| userId    | ID   | true     | request.params?.userId |

To access the api you can use the **REST** controller with the path **GET /paymentcustomers/:userId**

```js
axios({
  method: "GET",
  url: `/paymentcustomers/${userId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`paymentCustomer`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "paymentCustomer",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "paymentCustomer": { "id": "ID", "isActive": true }
}
```

### Route: list-paymentcustomers

_Route Type_ : getList

_Default access route_ : _GET_ `/paymentcustomers`

The list-paymentcustomers api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /paymentcustomers**

```js
axios({
  method: "GET",
  url: "/paymentcustomers",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`paymentCustomers`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "paymentCustomers",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": 1,
  "paymentCustomers": { "id": "ID", "isActive": true }
}
```

### Route: list-paymentMethods

_Route Type_ : getList

_Default access route_ : _GET_ `/paymentMethods`

The list-paymentMethods api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /paymentMethods**

```js
axios({
  method: "GET",
  url: "/paymentMethods",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`paymentMethods`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "paymentMethods",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": 1,
  "paymentMethods": { "id": "ID", "isActive": true }
}
```

## Copyright

All sources, documents and other digital materials are copyright of .

## About Us

For more information please visit our website: .

.
.
