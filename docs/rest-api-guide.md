 

# REST API GUIDE 
## tickatme-auth-service

Authentication service for the project

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to . 
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email: 

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the Auth Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our Auth Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the Auth Service via HTTP requests for purposes such as creating, updating, deleting and querying Auth objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the Auth Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the Auth service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

**Protected Routes**: 
Certain routes require specific authorization levels. Access to these routes is contingent upon the possession of a valid access token that meets the route-specific authorization criteria. Unauthorized requests to these routes will be rejected.

**Public Routes**: 
The service also includes routes that are accessible without authentication. These public endpoints are designed for open access and do not require an access token.


### Token Locations
When including your access token in a request, ensure it is placed in one of the following specified locations. The service will sequentially search these locations for the token, utilizing the first one it encounters.

| Location               | Token Name                   |
| ---------------------- | ---------------------------- |
| bearer | Auth Header | 
| cookie | tickatme-access-token | 
Please ensure the token is correctly placed in one of these locations, using the appropriate label as indicated. The service prioritizes these locations in the order listed, processing the first token it successfully identifies.


## Api Definitions
This section outlines the API endpoints available within the Auth service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the Auth service.

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the Auth service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `Auth` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `Auth` service.


  ### Multi Tenant Architecture

  The `Auth` service operates within a multi tenant architecture.
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
    - **Tenant Registration**: The `Auth` service allows for the registration of new tenants. Any user who registers himself in the root tenant through the POST /tenantowners , can create a new organizer publicly with the user registration. The creator user of the organizer record will be registred to the new tenenat with the `tenantAdmin` role.
  
  #### Implementation:

  When the user logins there may be few ways for Mindbricks to recognize and set the tenant id in the session.
  1. Mindbricks will check the url of the login request if it matches tenant url.
  2. Mindbricks will check the `mbx-organizer-id` has the tenant id.
  3. Mindbricks will check if the user is associated with a `organizer` in the data model.
  After you login a tenant successfully, ensure that your requests accurately target objects that fall within the tenant scope set during the login session.
  Ensure your requests are correctly formatted to include the domain sandbox information in the header. This enables the `Auth` service to accurately identify the domain context, facilitating proper access control and data management based on the user's permissions and the specified domain.  
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
  By adhering to this domain sandbox model, the `Auth` service maintains a secure and organized structure for handling requests across different domains, ensuring that operations are performed within the correct contextual boundaries.

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

When the `Auth` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

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
Auth service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### User resource

*Resource Definition* : A data object that stores the user information and handles login settings.
*User Resource Properties* 
| Name | Type | Required | Default | Definition | 
| ---- | ---- | -------- | ------- | ---------- |
| **email** | String |  |  | * A string value to represent the user&#39;s email.* |
| **password** | String |  |  | * A string value to represent the user&#39;s password as hashed.* |
| **fullname** | String |  |  | *A string value to represent the fullname of the user* |
| **avatar** | String |  |  | *The avatar icon of the user.* |
| **roleId** | String |  |  | *The roleId of the user.* |
| **mobile** | String |  |  | *A string value to represent the user&#39;s mobile number.* |
| **mobileVerified** | Boolean |  |  | *A boolean value to represent the mobile verification status of the user.* |
| **age** | Integer |  |  | *The age of the user* |
| **sex** | Enum |  |  | *The sex value of the user. * |
| **emailVerified** | Boolean |  |  | *A boolean value to represent the email verification status of the user.* |
| **organizerId** | ID |  |  | *An ID value to represent the tenant id of the organizer* |
#### Enum Properties
Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.
##### sex Enum Property
*Enum Options*
| Name | Value | 
| ---- | ----- |
| **male** | 0 | 
| **female** | 1 | 
### UserGroup resource

*Resource Definition* : A data object that stores the user group information.
*UserGroup Resource Properties* 
| Name | Type | Required | Default | Definition | 
| ---- | ---- | -------- | ------- | ---------- |
| **groupName** | String |  |  | * A string value to represent the group name.* |
| **avatar** | String |  |  | * A string value to represent the groups icon.* |
### UserGroupMember resource

*Resource Definition* : A data object that stores the members of the user group.
*UserGroupMember Resource Properties* 
| Name | Type | Required | Default | Definition | 
| ---- | ---- | -------- | ------- | ---------- |
| **groupId** | ID |  |  | * An ID value to represent the group that the user is asssigned as a memeber to.* |
| **userId** | ID |  |  | * An ID value to represent the user that is assgined as a member to the group.* |
| **ownerId** | ID |  |  | *An ID value to represent the admin user who assgined the member.* |
### Organizer resource

*Resource Definition* : A data object that stores the information for organizer
*Organizer Resource Properties* 
| Name | Type | Required | Default | Definition | 
| ---- | ---- | -------- | ------- | ---------- |
| **name** | String |  |  | *A string value to represent one word name of the organizer* |
| **codename** | String |  |  | *A string value to represent a unique code name for the tenant which is generated automatically using name* |
| **fullname** | String |  |  | *A string value to represent the fullname of the organizer* |
| **avatar** | String |  |  | *The avatar icon of the client.* |
| **ownerId** | ID |  |  | *An ID value to represent the user id of organizer owner who created the tenant* |
| **brandName** | String |  |  | *The brandname of the organizer. It wlll be different than the name.* |
### GivenPermission resource

*Resource Definition* : A data object that stores the assigment of a specific named permission to a role, usergroup or user for a specific object or for general use.
*GivenPermission Resource Properties* 
| Name | Type | Required | Default | Definition | 
| ---- | ---- | -------- | ------- | ---------- |
| **permissionName** | String |  |  | * A string value to refrence the named permission. It can either reference as groupName.permissionName or permissionName or groupName.** |
| **roleId** | String |  |  | *A string value to represent the role name to which the permission is given.* |
| **subjectUserId** | String |  |  | *A string value to represent the user ID to whom the permission is given.* |
| **subjectUserGroupId** | String |  |  | *A string value to represent the user group ID to which the permission is given.* |
| **objectId** | String |  |  | *A string value to represent the object ID for which the permission is given.* |
| **canDo** | Boolean |  |  | *A boolean value to represent if the permission is active or not. A specific negative value can override a more general positive value or vice verse.* |
| **organizerId** | ID |  |  | *An ID value to represent the tenant id of the organizer* |
## Crud Routes
### Route: create-user
*Route Definition* : This route is used by admin roles to create a new user manually from admin panels

*Route Type* : create

*Default access route* : *POST* `/users`

####  Parameters
The create-user api has got 10 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| email  | String  |  | request.body?.email |
| password  | String  |  | request.body?.password |
| fullname  | String  |  | request.body?.fullname |
| avatar  | String  |  | request.body?.avatar |
| roleId  | String  |  | request.body?.roleId |
| mobile  | String  |  | request.body?.mobile |
| mobileVerified  | Boolean  |  | request.body?.mobileVerified |
| age  | Integer  |  | request.body?.age |
| sex  | Enum  |  | request.body?.sex |
| emailVerified  | Boolean  |  | request.body?.emailVerified |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /users**
```js
  axios({
    method: 'POST',
    url: '/users',
    data: {
            email:"String",  
            password:"String",  
            fullname:"String",  
            avatar:"String",  
            roleId:"String",  
            mobile:"String",  
            mobileVerified:"Boolean",  
            age:"Integer",  
            sex:"Enum",  
            emailVerified:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`user`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"user","action":"create","appVersion":"Version","rowCount":1,"user":{"id":"ID","isActive":true}}
```  


  

### Route: update-user
*Route Definition* : This route is used by users to update their profiles.

*Route Type* : update

*Default access route* : *PATCH* `/users/:userId`

####  Parameters
The update-user api has got 7 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| password  | String  | false | request.body?.password |
| fullname  | String  | false | request.body?.fullname |
| avatar  | String  | false | request.body?.avatar |
| mobile  | String  | false | request.body?.mobile |
| age  | Integer  | false | request.body?.age |
| sex  | Enum  | false | request.body?.sex |
| userId  | ID  | true | request.params?.userId |

  

  



To access the api you can use the **REST** controller with the path **PATCH  /users/:userId**
```js
  axios({
    method: 'PATCH',
    url: `/users/${userId}`,
    data: {
            password:"String",  
            fullname:"String",  
            avatar:"String",  
            mobile:"String",  
            age:"Integer",  
            sex:"Enum",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`user`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"user","action":"update","appVersion":"Version","rowCount":1,"user":{"id":"ID","isActive":true}}
```  


  

### Route: update-userrole
*Route Definition* : This route is used by admin roles to update the user role.The default role is tenantUser when a tenant user is registered. A tenant user&#39;s role can be updated by tenantAdmin, while saas user&#39;s role is updated by superAdmin or saasAdmin

*Route Type* : update

*Default access route* : *PATCH* `/userroles/:userId`

####  Parameters
The update-userrole api has got 2 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| roleId  | ID  | true | request.body?.roleId |
| userId  | ID  | true | request.params?.userId |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **PATCH  /userroles/:userId**
```js
  axios({
    method: 'PATCH',
    url: `/userroles/${userId}`,
    data: {
            roleId:"ID",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`user`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"user","action":"update","appVersion":"Version","rowCount":1,"user":{"id":"ID","isActive":true}}
```  


  

### Route: register-tenantuser
*Route Definition* : This route is used by public users to register themselves to tenants that are created by tenant owners.

*Route Type* : create

*Default access route* : *POST* `/tenantusers`

####  Parameters
The register-tenantuser api has got 10 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| email  | String  |  | request.body?.email |
| password  | String  |  | request.body?.password |
| fullname  | String  |  | request.body?.fullname |
| avatar  | String  |  | request.body?.avatar |
| roleId  | String  |  | request.body?.roleId |
| mobile  | String  |  | request.body?.mobile |
| mobileVerified  | Boolean  |  | request.body?.mobileVerified |
| age  | Integer  |  | request.body?.age |
| sex  | Enum  |  | request.body?.sex |
| emailVerified  | Boolean  |  | request.body?.emailVerified |

  

  



To access the api you can use the **REST** controller with the path **POST  /tenantusers**
```js
  axios({
    method: 'POST',
    url: '/tenantusers',
    data: {
            email:"String",  
            password:"String",  
            fullname:"String",  
            avatar:"String",  
            roleId:"String",  
            mobile:"String",  
            mobileVerified:"Boolean",  
            age:"Integer",  
            sex:"Enum",  
            emailVerified:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`user`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"user","action":"create","appVersion":"Version","rowCount":1,"user":{"id":"ID","isActive":true}}
```  


  

### Route: register-tenantowner
*Route Definition* : This route is used by public users to register themselves as tenant owners to create both a user account and a organizer account they own.

*Route Type* : create

*Default access route* : *POST* `/tenantowners`

####  Parameters
The register-tenantowner api has got 11 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| email  | String  |  | request.body?.email |
| password  | String  |  | request.body?.password |
| fullname  | String  |  | request.body?.fullname |
| avatar  | String  |  | request.body?.avatar |
| roleId  | String  |  | request.body?.roleId |
| mobile  | String  |  | request.body?.mobile |
| mobileVerified  | Boolean  |  | request.body?.mobileVerified |
| age  | Integer  |  | request.body?.age |
| sex  | Enum  |  | request.body?.sex |
| emailVerified  | Boolean  |  | request.body?.emailVerified |
| organizer  | Object  |  | request.body?.organizer |

  

  



To access the api you can use the **REST** controller with the path **POST  /tenantowners**
```js
  axios({
    method: 'POST',
    url: '/tenantowners',
    data: {
            email:"String",  
            password:"String",  
            fullname:"String",  
            avatar:"String",  
            roleId:"String",  
            mobile:"String",  
            mobileVerified:"Boolean",  
            age:"Integer",  
            sex:"Enum",  
            emailVerified:"Boolean",  
            organizer:"Object",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`user`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"user","action":"create","appVersion":"Version","rowCount":1,"user":{"id":"ID","isActive":true}}
```  


  

### Route: retrive-user
*Route Definition* : This route is used by admin roles or the users themselves to get the user profile information.

*Route Type* : get

*Default access route* : *GET* `/users/:userId`

####  Parameters
The retrive-user api has got 1 parameter  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| userId  | ID  | true | request.params?.userId |

  

  



To access the api you can use the **REST** controller with the path **GET  /users/:userId**
```js
  axios({
    method: 'GET',
    url: `/users/${userId}`,
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`user`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"user","action":"get","appVersion":"Version","rowCount":1,"user":{"id":"ID","isActive":true}}
```  


  

### Route: list-users
*Route Definition* : The list of users is filtered by the tenantId.

*Route Type* : getList

*Default access route* : *GET* `/users`

The list-users api has got no parameters.    

  

  



To access the api you can use the **REST** controller with the path **GET  /users**
```js
  axios({
    method: 'GET',
    url: '/users',
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`users`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"users","action":"getList","appVersion":"Version","rowCount":1,"users":{"id":"ID","isActive":true}}
```  


  

### Route: create-usergroup
*Route Definition* : This route is used by admin roles to create a new usergroup manually from admin panels

*Route Type* : create

*Default access route* : *POST* `/usergroups`

####  Parameters
The create-usergroup api has got 2 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| groupName  | String  |  | request.body?.groupName |
| avatar  | String  |  | request.body?.avatar |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /usergroups**
```js
  axios({
    method: 'POST',
    url: '/usergroups',
    data: {
            groupName:"String",  
            avatar:"String",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`userGroup`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"userGroup","action":"create","appVersion":"Version","rowCount":1,"userGroup":{"id":"ID","isActive":true}}
```  


  

### Route: update-usergroup
*Route Definition* : This route is used by admin to update user groups.

*Route Type* : update

*Default access route* : *PATCH* `/usergroups/:userGroupId`

####  Parameters
The update-usergroup api has got 3 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| groupName  | String  | false | request.body?.groupName |
| avatar  | String  | false | request.body?.avatar |
| userGroupId  | ID  | true | request.params?.userGroupId |

  

  



To access the api you can use the **REST** controller with the path **PATCH  /usergroups/:userGroupId**
```js
  axios({
    method: 'PATCH',
    url: `/usergroups/${userGroupId}`,
    data: {
            groupName:"String",  
            avatar:"String",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`userGroup`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"userGroup","action":"update","appVersion":"Version","rowCount":1,"userGroup":{"id":"ID","isActive":true}}
```  


  

### Route: retrive-usergroup
*Route Definition* : This route is used by admin roles or the users to get the user group information.

*Route Type* : get

*Default access route* : *GET* `/usergroups/:userGroupId`

####  Parameters
The retrive-usergroup api has got 1 parameter  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| userGroupId  | ID  | true | request.params?.userGroupId |

  

  



To access the api you can use the **REST** controller with the path **GET  /usergroups/:userGroupId**
```js
  axios({
    method: 'GET',
    url: `/usergroups/${userGroupId}`,
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`userGroup`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"userGroup","action":"get","appVersion":"Version","rowCount":1,"userGroup":{"id":"ID","isActive":true}}
```  


  

### Route: list-usergroups
*Route Definition* : This route is used by admin or user roles to get the list of groups.

*Route Type* : getList

*Default access route* : *GET* `/usergroups`

The list-usergroups api has got no parameters.    

  

  



To access the api you can use the **REST** controller with the path **GET  /usergroups**
```js
  axios({
    method: 'GET',
    url: '/usergroups',
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`userGroups`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"userGroups","action":"getList","appVersion":"Version","rowCount":1,"userGroups":{"id":"ID","isActive":true}}
```  


  

### Route: create-usergroupmember
*Route Definition* : This route is used by admin roles to add a user to a group.

*Route Type* : create

*Default access route* : *POST* `/usergroupmembers`

####  Parameters
The create-usergroupmember api has got 2 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| groupId  | ID  |  | request.body?.groupId |
| userId  | ID  |  | request.body?.userId |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /usergroupmembers**
```js
  axios({
    method: 'POST',
    url: '/usergroupmembers',
    data: {
            groupId:"ID",  
            userId:"ID",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`userGroupMember`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"userGroupMember","action":"create","appVersion":"Version","rowCount":1,"userGroupMember":{"id":"ID","isActive":true}}
```  


  

### Route: delete-usergroupmember
*Route Definition* : This route is used by admin to delete a member from a group.

*Route Type* : delete

*Default access route* : *DELETE* `/usergroupmembers/:userGroupMemberId`

####  Parameters
The delete-usergroupmember api has got 1 parameter  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| userGroupMemberId  | ID  | true | request.params?.userGroupMemberId |

  

  



To access the api you can use the **REST** controller with the path **DELETE  /usergroupmembers/:userGroupMemberId**
```js
  axios({
    method: 'DELETE',
    url: `/usergroupmembers/${userGroupMemberId}`,
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`userGroupMember`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"userGroupMember","action":"delete","appVersion":"Version","rowCount":1,"userGroupMember":{"id":"ID","isActive":false}}
```  


  

### Route: retrive-usergroupmember
*Route Definition* : This route is used by admin roles or the users to get the user group member information.

*Route Type* : get

*Default access route* : *GET* `/usergroupmembers/:userGroupMemberId`

####  Parameters
The retrive-usergroupmember api has got 1 parameter  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| userGroupMemberId  | ID  | true | request.params?.userGroupMemberId |

  

  



To access the api you can use the **REST** controller with the path **GET  /usergroupmembers/:userGroupMemberId**
```js
  axios({
    method: 'GET',
    url: `/usergroupmembers/${userGroupMemberId}`,
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`userGroupMember`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"userGroupMember","action":"get","appVersion":"Version","rowCount":1,"userGroupMember":{"id":"ID","isActive":true}}
```  


  

### Route: list-usergroupmembers
*Route Definition* : This route is used by admin or user roles to get the list of group members of a group.

*Route Type* : getList

*Default access route* : *GET* `/usergroupmembers`

####  Parameters
The list-usergroupmembers api has got 1 parameter  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| groupId  | ID  | true | request.query?.groupId |

  

  



To access the api you can use the **REST** controller with the path **GET  /usergroupmembers**
```js
  axios({
    method: 'GET',
    url: '/usergroupmembers',
    data: {
    
    },
    params: {
             groupId:'"ID"',  
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`userGroupMembers`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"userGroupMembers","action":"getList","appVersion":"Version","rowCount":1,"userGroupMembers":{"id":"ID","isActive":true}}
```  


  

### Route: create-organizer


*Route Type* : create

*Default access route* : *POST* `/organizers`

####  Parameters
The create-organizer api has got 5 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| name  | String  |  | request.body?.name |
| codename  | String  |  | request.body?.codename |
| fullname  | String  |  | request.body?.fullname |
| avatar  | String  |  | request.body?.avatar |
| brandName  | String  |  | request.body?.brandName |

  

  



To access the api you can use the **REST** controller with the path **POST  /organizers**
```js
  axios({
    method: 'POST',
    url: '/organizers',
    data: {
            name:"String",  
            codename:"String",  
            fullname:"String",  
            avatar:"String",  
            brandName:"String",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`organizer`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"organizer","action":"create","appVersion":"Version","rowCount":1,"organizer":{"id":"ID","isActive":true}}
```  


  

### Route: retrive-organizer
*Route Definition* : Get a organizer by id. A public route which cab be called without login

*Route Type* : get

*Default access route* : *GET* `/organizers/:organizerId`

####  Parameters
The retrive-organizer api has got 1 parameter  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| organizerId  | ID  | true | request.params?.organizerId |

  

  



To access the api you can use the **REST** controller with the path **GET  /organizers/:organizerId**
```js
  axios({
    method: 'GET',
    url: `/organizers/${organizerId}`,
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`organizer`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"organizer","action":"get","appVersion":"Version","rowCount":1,"organizer":{"id":"ID","isActive":true}}
```  


  

### Route: retriveByCode-organizer
*Route Definition* : Get organizer by codename to use the i in the header to make tenant specific calls. A public route which cab be called without login

*Route Type* : get

*Default access route* : *GET* `/organizerbycodename/:codename`

####  Parameters
The retriveByCode-organizer api has got 1 parameter  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| codename  | String  | true | request.params?.codename |

  

  



To access the api you can use the **REST** controller with the path **GET  /organizerbycodename/:codename**
```js
  axios({
    method: 'GET',
    url: `/organizerbycodename/${codename}`,
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`organizer`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"organizer","action":"get","appVersion":"Version","rowCount":1,"organizer":{"id":"ID","isActive":true}}
```  


  

### Route: list-userorganizer
*Route Definition* : Get a list of organizer, this route can be called by saas user and close to tenant level

*Route Type* : getList

*Default access route* : *GET* `/userorganizers`

The list-userorganizer api has got no parameters.    

  

  



To access the api you can use the **REST** controller with the path **GET  /userorganizers**
```js
  axios({
    method: 'GET',
    url: '/userorganizers',
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`organizers`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"organizers","action":"getList","appVersion":"Version","rowCount":1,"organizers":{"id":"ID","isActive":true}}
```  


  

### Route: create-givenpermission
*Route Definition* : This route is used by admin to create a new permission assignment to a role/user/usergroup for objects or general use.

*Route Type* : create

*Default access route* : *POST* `/givenpermissions`

####  Parameters
The create-givenpermission api has got 6 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| permissionName  | String  |  | request.body?.permissionName |
| roleId  | String  |  | request.body?.roleId |
| subjectUserId  | String  |  | request.body?.subjectUserId |
| subjectUserGroupId  | String  |  | request.body?.subjectUserGroupId |
| objectId  | String  |  | request.body?.objectId |
| canDo  | Boolean  |  | request.body?.canDo |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /givenpermissions**
```js
  axios({
    method: 'POST',
    url: '/givenpermissions',
    data: {
            permissionName:"String",  
            roleId:"String",  
            subjectUserId:"String",  
            subjectUserGroupId:"String",  
            objectId:"String",  
            canDo:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"create","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":true}}
```  


  

### Route: create-rolepermission
*Route Definition* : This route is used by admin to create a new permission assignment to a role.

*Route Type* : create

*Default access route* : *POST* `/rolepermissions`

####  Parameters
The create-rolepermission api has got 3 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| roleId  | String  | true | request.body?.roleId |
| permissionName  | String  | true | request.body?.permissionName |
| canDo  | Boolean  | true | request.body?.canDo |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /rolepermissions**
```js
  axios({
    method: 'POST',
    url: '/rolepermissions',
    data: {
            roleId:"String",  
            permissionName:"String",  
            canDo:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"create","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":true}}
```  


  

### Route: create-userpermission
*Route Definition* : This route is used by admin to create a new permission assignment to a user.

*Route Type* : create

*Default access route* : *POST* `/userpermissions`

####  Parameters
The create-userpermission api has got 3 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| subjectUserId  | ID  | true | request.body?.subjectUserId |
| permissionName  | String  | true | request.body?.permissionName |
| canDo  | Boolean  | true | request.body?.canDo |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /userpermissions**
```js
  axios({
    method: 'POST',
    url: '/userpermissions',
    data: {
            subjectUserId:"ID",  
            permissionName:"String",  
            canDo:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"create","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":true}}
```  


  

### Route: create-grouppermission
*Route Definition* : This route is used by admin to create a new permission assignment to a user group.

*Route Type* : create

*Default access route* : *POST* `/grouppermissions`

####  Parameters
The create-grouppermission api has got 3 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| subjectUserGroupId  | ID  | true | request.body?.subjectUserGroupId |
| permissionName  | String  | true | request.body?.permissionName |
| canDo  | Boolean  | true | request.body?.canDo |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /grouppermissions**
```js
  axios({
    method: 'POST',
    url: '/grouppermissions',
    data: {
            subjectUserGroupId:"ID",  
            permissionName:"String",  
            canDo:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"create","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":true}}
```  


  

### Route: create-rolegrouppermission
*Route Definition* : This route is used by admin to create a new permission assignment to a role and user group. The permission is given to the users of the group who has the role.

*Route Type* : create

*Default access route* : *POST* `/rolegrouppermissions`

####  Parameters
The create-rolegrouppermission api has got 4 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| roleId  | String  | true | request.body?.roleId |
| subjectUserGroupId  | ID  | true | request.body?.subjectUserGroupId |
| permissionName  | String  | true | request.body?.permissionName |
| canDo  | Boolean  | true | request.body?.canDo |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /rolegrouppermissions**
```js
  axios({
    method: 'POST',
    url: '/rolegrouppermissions',
    data: {
            roleId:"String",  
            subjectUserGroupId:"ID",  
            permissionName:"String",  
            canDo:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"create","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":true}}
```  


  

### Route: create-objectpermission
*Route Definition* : This route is used by admin to create a new permission assignment to a user for an object.

*Route Type* : create

*Default access route* : *POST* `/objectpermissions`

####  Parameters
The create-objectpermission api has got 4 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| objectId  | ID  | true | request.body?.objectId |
| subjectUserId  | ID  | true | request.body?.subjectUserId |
| permissionName  | String  | true | request.body?.permissionName |
| canDo  | Boolean  | true | request.body?.canDo |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /objectpermissions**
```js
  axios({
    method: 'POST',
    url: '/objectpermissions',
    data: {
            objectId:"ID",  
            subjectUserId:"ID",  
            permissionName:"String",  
            canDo:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"create","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":true}}
```  


  

### Route: create-objectgrouppermission
*Route Definition* : This route is used by admin to create a new permission assignment to a user group for an object.

*Route Type* : create

*Default access route* : *POST* `/objectgrouppermissions`

####  Parameters
The create-objectgrouppermission api has got 4 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| objectId  | ID  | true | request.body?.objectId |
| subjectUserGroupId  | ID  | true | request.body?.subjectUserGroupId |
| permissionName  | String  | true | request.body?.permissionName |
| canDo  | Boolean  | true | request.body?.canDo |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /objectgrouppermissions**
```js
  axios({
    method: 'POST',
    url: '/objectgrouppermissions',
    data: {
            objectId:"ID",  
            subjectUserGroupId:"ID",  
            permissionName:"String",  
            canDo:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"create","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":true}}
```  


  

### Route: create-objectrolepermission
*Route Definition* : This route is used by admin to create a new permission assignment to a role for an object.

*Route Type* : create

*Default access route* : *POST* `/objectrolepermissions`

####  Parameters
The create-objectrolepermission api has got 4 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| objectId  | ID  | true | request.body?.objectId |
| roleId  | String  | true | request.body?.roleId |
| permissionName  | String  | true | request.body?.permissionName |
| canDo  | Boolean  | true | request.body?.canDo |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /objectrolepermissions**
```js
  axios({
    method: 'POST',
    url: '/objectrolepermissions',
    data: {
            objectId:"ID",  
            roleId:"String",  
            permissionName:"String",  
            canDo:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"create","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":true}}
```  


  

### Route: create-objectgrouprolepermission
*Route Definition* : This route is used by admin to create a new permission assignment to a role and user group for an object. The permission to acess(or not) the object is given to the users of the group who has the role.

*Route Type* : create

*Default access route* : *POST* `/objectgrouprolepermissions`

####  Parameters
The create-objectgrouprolepermission api has got 5 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| objectId  | ID  | true | request.body?.objectId |
| roleId  | String  | true | request.body?.roleId |
| subjectUserGroupId  | ID  | true | request.body?.subjectUserGroupId |
| permissionName  | String  | true | request.body?.permissionName |
| canDo  | Boolean  | true | request.body?.canDo |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **POST  /objectgrouprolepermissions**
```js
  axios({
    method: 'POST',
    url: '/objectgrouprolepermissions',
    data: {
            objectId:"ID",  
            roleId:"String",  
            subjectUserGroupId:"ID",  
            permissionName:"String",  
            canDo:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"create","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":true}}
```  


  

### Route: update-givenpermission
*Route Definition* : This route is used by admin to update a permission assignment to a role/user/usergroup for objects or general use.

*Route Type* : update

*Default access route* : *PATCH* `/givenpermissions/:givenPermissionId`

####  Parameters
The update-givenpermission api has got 7 parameters  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| permissionName  | String  | false | request.body?.permissionName |
| roleId  | String  | false | request.body?.roleId |
| subjectUserId  | String  | false | request.body?.subjectUserId |
| subjectUserGroupId  | String  | false | request.body?.subjectUserGroupId |
| objectId  | String  | false | request.body?.objectId |
| canDo  | Boolean  | false | request.body?.canDo |
| givenPermissionId  | ID  | true | request.params?.givenPermissionId |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **PATCH  /givenpermissions/:givenPermissionId**
```js
  axios({
    method: 'PATCH',
    url: `/givenpermissions/${givenPermissionId}`,
    data: {
            permissionName:"String",  
            roleId:"String",  
            subjectUserId:"String",  
            subjectUserGroupId:"String",  
            objectId:"String",  
            canDo:"Boolean",  
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"update","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":true}}
```  


  

### Route: delete-givenpermission
*Route Definition* : This route is used by admin to delete a permission assignment to a role/user/usergroup for objects or general use.

*Route Type* : delete

*Default access route* : *DELETE* `/givenpermissions/:givenPermissionId`

####  Parameters
The delete-givenpermission api has got 1 parameter  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| givenPermissionId  | ID  | true | request.params?.givenPermissionId |

  

  

To access the route the session should validated across these validations.





```js
/* 
Validation Check: Check if the logged in user has [superAdmin-admin-saasAdmin-tenantAdmin] roles
This validation will be executed on layer1
*/
  if (!(this.userHasRole(this.ROLES.superAdmin) || this.userHasRole(this.ROLES.admin) || this.userHasRole(this.ROLES.saasAdmin) || this.userHasRole(this.ROLES.tenantAdmin))) {
  throw (new BadRequestError("errMsg_userShoudlHave[superAdmin-admin-saasAdmin-tenantAdmin]RoleToAccessRoute"))
};

``` 



To access the api you can use the **REST** controller with the path **DELETE  /givenpermissions/:givenPermissionId**
```js
  axios({
    method: 'DELETE',
    url: `/givenpermissions/${givenPermissionId}`,
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"delete","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":false}}
```  


  

### Route: retrive-givenpermission
*Route Definition* : This route is used by admin roles or the users to get the permission assignment information.

*Route Type* : get

*Default access route* : *GET* `/givenpermissions/:givenPermissionId`

####  Parameters
The retrive-givenpermission api has got 1 parameter  

| Parameter              | Type                   | Required | Population                   |
| ---------------------- | ---------------------- | -------- | ---------------------------- |
| givenPermissionId  | ID  | true | request.params?.givenPermissionId |

  

  



To access the api you can use the **REST** controller with the path **GET  /givenpermissions/:givenPermissionId**
```js
  axios({
    method: 'GET',
    url: `/givenpermissions/${givenPermissionId}`,
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermission`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermission","action":"get","appVersion":"Version","rowCount":1,"givenPermission":{"id":"ID","isActive":true}}
```  


  

### Route: list-givenpermissions
*Route Definition* : This route is used by admin or user roles to get the list of permission assignments.

*Route Type* : getList

*Default access route* : *GET* `/givenpermissions`

The list-givenpermissions api has got no parameters.    

  

  



To access the api you can use the **REST** controller with the path **GET  /givenpermissions**
```js
  axios({
    method: 'GET',
    url: '/givenpermissions',
    data: {
    
    },
    params: {
    
    }
  });
```     
The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`givenPermissions`** object in the respones. However, some properties may be omitted based on the object's internal logic.



```json
{"status":"OK","statusCode":"200","elapsedMs":126,"ssoTime":120,"source":"db","cacheKey":"hexCode","userId":"ID","sessionId":"ID","requestId":"ID","dataName":"givenPermissions","action":"getList","appVersion":"Version","rowCount":1,"givenPermissions":{"id":"ID","isActive":true}}
```  


  




## Copyright
All sources, documents and other digital materials are copyright of .

## About Us
For more information please visit our website: .

.
.
