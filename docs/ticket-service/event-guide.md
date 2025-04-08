---
id: event-guide
title:  EVENT GUIDE
sidebar_label:  EVENT GUIDE
sidebar_position: 1
---
# EVENT GUIDE

## tickatme-ticket-service

Ticket service is responsible for managing the orders for joining to the events and their payments through Stripe payment.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to . For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

# Documentation Scope

Welcome to the official documentation for the `Ticket` Service Event descriptions. This guide is dedicated to detailing how to subscribe to and listen for state changes within the `Ticket` Service, offering an exclusive focus on event subscription mechanisms.

**Intended Audience**

This documentation is aimed at developers and integrators looking to monitor `Ticket` Service state changes. It is especially relevant for those wishing to implement or enhance business logic based on interactions with `Ticket` objects.

**Overview**

This section provides detailed instructions on monitoring service events, covering payload structures and demonstrating typical use cases through examples.

# Authentication and Authorization

Access to the `Ticket` service's events is facilitated through the project's Kafka server, which is not accessible to the public. Subscription to a Kafka topic requires being on the same network and possessing valid Kafka user credentials. This document presupposes that readers have existing access to the Kafka server.

Additionally, the service offers a public subscription option via REST for real-time data management in frontend applications, secured through REST API authentication and authorization mechanisms. To subscribe to service events via the REST API, please consult the Realtime REST API Guide.

# Database Events

Database events are triggered at the database layer, automatically and atomically, in response to any modifications at the data level. These events serve to notify subscribers about the creation, update, or deletion of objects within the database, distinct from any overarching business logic.

Listening to database events is particularly beneficial for those focused on tracking changes at the database level. A typical use case for subscribing to database events is to replicate the data store of one service within another service's scope, ensuring data consistency and syncronization across services.

For example, while a business operation such as "approve membership" might generate a high-level business event like `membership-approved`, the underlying database changes could involve multiple state updates to different entities. These might be published as separate events, such as `dbevent-member-updated` and `dbevent-user-updated`, reflecting the granular changes at the database level.

Such detailed eventing provides a robust foundation for building responsive, data-driven applications, enabling fine-grained observability and reaction to the dynamics of the data landscape. It also facilitates the architectural pattern of event sourcing, where state changes are captured as a sequence of events, allowing for high-fidelity data replication and history replay for analytical or auditing purposes.

## DbEvent ticket-created

**Event topic**: `tickatme-ticket-service-dbevent-ticket-created`

This event is triggered upon the creation of a `ticket` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "eventId": "ID",
  "userId": "ID",
  "price": "Float",
  "eventStartDate": "Date",
  "eventMinutes": "Integer",
  "status": "String",
  "statusUpdateDate": "Date",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent ticket-updated

**Event topic**: `tickatme-ticket-service-dbevent-ticket-updated`

Activation of this event follows the update of a `ticket` data object. The payload contains the updated information under the `ticket` attribute, along with the original data prior to update, labeled as `old_ticket`.

**Event payload**:

```json
{
  "old_ticket": {
    "id": "ID",
    "_owner": "ID",
    "eventId": "ID",
    "userId": "ID",
    "price": "Float",
    "eventStartDate": "Date",
    "eventMinutes": "Integer",
    "status": "String",
    "statusUpdateDate": "Date",
    "organizerId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "ticket": {
    "id": "ID",
    "_owner": "ID",
    "eventId": "ID",
    "userId": "ID",
    "price": "Float",
    "eventStartDate": "Date",
    "eventMinutes": "Integer",
    "status": "String",
    "statusUpdateDate": "Date",
    "organizerId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent ticket-deleted

**Event topic**: `tickatme-ticket-service-dbevent-ticket-deleted`

This event announces the deletion of a `ticket` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "eventId": "ID",
  "userId": "ID",
  "price": "Float",
  "eventStartDate": "Date",
  "eventMinutes": "Integer",
  "status": "String",
  "statusUpdateDate": "Date",
  "organizerId": "ID",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent ticketPayment-created

**Event topic**: `tickatme-ticket-service-dbevent-ticketpayment-created`

This event is triggered upon the creation of a `ticketPayment` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "ownerId": "ID",
  "orderId": "ID",
  "paymentId": "String",
  "paymentStatus": "String",
  "statusLiteral": "String",
  "redirectUrl": "String",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent ticketPayment-updated

**Event topic**: `tickatme-ticket-service-dbevent-ticketpayment-updated`

Activation of this event follows the update of a `ticketPayment` data object. The payload contains the updated information under the `ticketPayment` attribute, along with the original data prior to update, labeled as `old_ticketPayment`.

**Event payload**:

```json
{
  "old_ticketPayment": {
    "id": "ID",
    "_owner": "ID",
    "ownerId": "ID",
    "orderId": "ID",
    "paymentId": "String",
    "paymentStatus": "String",
    "statusLiteral": "String",
    "redirectUrl": "String",
    "organizerId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "ticketPayment": {
    "id": "ID",
    "_owner": "ID",
    "ownerId": "ID",
    "orderId": "ID",
    "paymentId": "String",
    "paymentStatus": "String",
    "statusLiteral": "String",
    "redirectUrl": "String",
    "organizerId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent ticketPayment-deleted

**Event topic**: `tickatme-ticket-service-dbevent-ticketpayment-deleted`

This event announces the deletion of a `ticketPayment` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "ownerId": "ID",
  "orderId": "ID",
  "paymentId": "String",
  "paymentStatus": "String",
  "statusLiteral": "String",
  "redirectUrl": "String",
  "organizerId": "ID",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent paymentCustomer-created

**Event topic**: `tickatme-ticket-service-dbevent-paymentcustomer-created`

This event is triggered upon the creation of a `paymentCustomer` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "organizerId": "ID",
  "customerId": "String",
  "platform": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent paymentCustomer-updated

**Event topic**: `tickatme-ticket-service-dbevent-paymentcustomer-updated`

Activation of this event follows the update of a `paymentCustomer` data object. The payload contains the updated information under the `paymentCustomer` attribute, along with the original data prior to update, labeled as `old_paymentCustomer`.

**Event payload**:

```json
{
  "old_paymentCustomer": {
    "id": "ID",
    "_owner": "ID",
    "userId": "ID",
    "organizerId": "ID",
    "customerId": "String",
    "platform": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "paymentCustomer": {
    "id": "ID",
    "_owner": "ID",
    "userId": "ID",
    "organizerId": "ID",
    "customerId": "String",
    "platform": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent paymentCustomer-deleted

**Event topic**: `tickatme-ticket-service-dbevent-paymentcustomer-deleted`

This event announces the deletion of a `paymentCustomer` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "organizerId": "ID",
  "customerId": "String",
  "platform": "String",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent paymentMethod-created

**Event topic**: `tickatme-ticket-service-dbevent-paymentmethod-created`

This event is triggered upon the creation of a `paymentMethod` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "paymentMethodId": "String",
  "userId": "ID",
  "organizerId": "ID",
  "customerId": "String",
  "cardHolderName": "String",
  "cardHolderZip": "String",
  "platform": "String",
  "cardInfo": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent paymentMethod-updated

**Event topic**: `tickatme-ticket-service-dbevent-paymentmethod-updated`

Activation of this event follows the update of a `paymentMethod` data object. The payload contains the updated information under the `paymentMethod` attribute, along with the original data prior to update, labeled as `old_paymentMethod`.

**Event payload**:

```json
{
  "old_paymentMethod": {
    "id": "ID",
    "_owner": "ID",
    "paymentMethodId": "String",
    "userId": "ID",
    "organizerId": "ID",
    "customerId": "String",
    "cardHolderName": "String",
    "cardHolderZip": "String",
    "platform": "String",
    "cardInfo": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "paymentMethod": {
    "id": "ID",
    "_owner": "ID",
    "paymentMethodId": "String",
    "userId": "ID",
    "organizerId": "ID",
    "customerId": "String",
    "cardHolderName": "String",
    "cardHolderZip": "String",
    "platform": "String",
    "cardInfo": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent paymentMethod-deleted

**Event topic**: `tickatme-ticket-service-dbevent-paymentmethod-deleted`

This event announces the deletion of a `paymentMethod` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "paymentMethodId": "String",
  "userId": "ID",
  "organizerId": "ID",
  "customerId": "String",
  "cardHolderName": "String",
  "cardHolderZip": "String",
  "platform": "String",
  "cardInfo": "Object",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

# ElasticSearch Index Events

Within the `Ticket` service, most data objects are mirrored in ElasticSearch indices, ensuring these indices remain syncronized with their database counterparts through creation, updates, and deletions. These indices serve dual purposes: they act as a data source for external services and furnish aggregated data tailored to enhance frontend user experiences. Consequently, an ElasticSearch index might encapsulate data in its original form or aggregate additional information from other data objects.

These aggregations can include both one-to-one and one-to-many relationships not only with database objects within the same service but also across different services. This capability allows developers to access comprehensive, aggregated data efficiently. By subscribing to ElasticSearch index events, developers are notified when an index is updated and can directly obtain the aggregated entity within the event payload, bypassing the need for separate ElasticSearch queries.

It's noteworthy that some services may augment another service's index by appending to the entity’s `extends` object. In such scenarios, an `*-extended` event will contain only the newly added data. Should you require the complete dataset, you would need to retrieve the full ElasticSearch index entity using the provided ID.

This approach to indexing and event handling facilitates a modular, interconnected architecture where services can seamlessly integrate and react to changes, enriching the overall data ecosystem and enabling more dynamic, responsive applications.

## Index Event ticket-created

**Event topic**: `elastic-index-tickatme_ticket-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "eventId": "ID",
  "userId": "ID",
  "price": "Float",
  "eventStartDate": "Date",
  "eventMinutes": "Integer",
  "status": "String",
  "statusUpdateDate": "Date",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event ticket-updated

**Event topic**: `elastic-index-tickatme_ticket-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "eventId": "ID",
  "userId": "ID",
  "price": "Float",
  "eventStartDate": "Date",
  "eventMinutes": "Integer",
  "status": "String",
  "statusUpdateDate": "Date",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event ticket-deleted

**Event topic**: `elastic-index-tickatme_ticket-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "eventId": "ID",
  "userId": "ID",
  "price": "Float",
  "eventStartDate": "Date",
  "eventMinutes": "Integer",
  "status": "String",
  "statusUpdateDate": "Date",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event ticket-extended

**Event topic**: `elastic-index-tickatme_ticket-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Route Event ticket-created

**Event topic** : `tickatme-ticket-service-ticket-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-startcheckoutked

**Event topic** : `tickatme-ticket-service-ticket-startcheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-completecheckoutked

**Event topic** : `tickatme-ticket-service-ticket-completecheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-refreshcheckoutked

**Event topic** : `tickatme-ticket-service-ticket-refreshcheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-retreived

**Event topic** : `tickatme-ticket-service-ticketpayment-retreived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpaymentbyorderid-got

**Event topic** : `tickatme-ticket-service-ticketpaymentbyorderid-got`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpaymentbypaymentid-got

**Event topic** : `tickatme-ticket-service-ticketpaymentbypaymentid-got`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-created

**Event topic** : `tickatme-ticket-service-ticketpayment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-updated

**Event topic** : `tickatme-ticket-service-ticketpayment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayments-listed

**Event topic** : `tickatme-ticket-service-ticketpayments-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayments` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayments`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayments-deleted

**Event topic** : `tickatme-ticket-service-ticketpayments-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentcustomer-retreived

**Event topic** : `tickatme-ticket-service-paymentcustomer-retreived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomer` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomer`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentcustomers-listed

**Event topic** : `tickatme-ticket-service-paymentcustomers-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomers` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomers`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentMethods-listed

**Event topic** : `tickatme-ticket-service-paymentmethods-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentMethods` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentMethods`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Index Event ticketpayment-created

**Event topic**: `elastic-index-tickatme_ticketpayment-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "ownerId": "ID",
  "orderId": "ID",
  "paymentId": "String",
  "paymentStatus": "String",
  "statusLiteral": "String",
  "redirectUrl": "String",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event ticketpayment-updated

**Event topic**: `elastic-index-tickatme_ticketpayment-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "ownerId": "ID",
  "orderId": "ID",
  "paymentId": "String",
  "paymentStatus": "String",
  "statusLiteral": "String",
  "redirectUrl": "String",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event ticketpayment-deleted

**Event topic**: `elastic-index-tickatme_ticketpayment-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "ownerId": "ID",
  "orderId": "ID",
  "paymentId": "String",
  "paymentStatus": "String",
  "statusLiteral": "String",
  "redirectUrl": "String",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event ticketpayment-extended

**Event topic**: `elastic-index-tickatme_ticketpayment-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Route Event ticket-created

**Event topic** : `tickatme-ticket-service-ticket-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-startcheckoutked

**Event topic** : `tickatme-ticket-service-ticket-startcheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-completecheckoutked

**Event topic** : `tickatme-ticket-service-ticket-completecheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-refreshcheckoutked

**Event topic** : `tickatme-ticket-service-ticket-refreshcheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-retreived

**Event topic** : `tickatme-ticket-service-ticketpayment-retreived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpaymentbyorderid-got

**Event topic** : `tickatme-ticket-service-ticketpaymentbyorderid-got`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpaymentbypaymentid-got

**Event topic** : `tickatme-ticket-service-ticketpaymentbypaymentid-got`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-created

**Event topic** : `tickatme-ticket-service-ticketpayment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-updated

**Event topic** : `tickatme-ticket-service-ticketpayment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayments-listed

**Event topic** : `tickatme-ticket-service-ticketpayments-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayments` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayments`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayments-deleted

**Event topic** : `tickatme-ticket-service-ticketpayments-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentcustomer-retreived

**Event topic** : `tickatme-ticket-service-paymentcustomer-retreived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomer` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomer`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentcustomers-listed

**Event topic** : `tickatme-ticket-service-paymentcustomers-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomers` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomers`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentMethods-listed

**Event topic** : `tickatme-ticket-service-paymentmethods-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentMethods` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentMethods`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Index Event paymentcustomer-created

**Event topic**: `elastic-index-tickatme_paymentcustomer-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "organizerId": "ID",
  "customerId": "String",
  "platform": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentcustomer-updated

**Event topic**: `elastic-index-tickatme_paymentcustomer-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "organizerId": "ID",
  "customerId": "String",
  "platform": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentcustomer-deleted

**Event topic**: `elastic-index-tickatme_paymentcustomer-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "organizerId": "ID",
  "customerId": "String",
  "platform": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentcustomer-extended

**Event topic**: `elastic-index-tickatme_paymentcustomer-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Route Event ticket-created

**Event topic** : `tickatme-ticket-service-ticket-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-startcheckoutked

**Event topic** : `tickatme-ticket-service-ticket-startcheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-completecheckoutked

**Event topic** : `tickatme-ticket-service-ticket-completecheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-refreshcheckoutked

**Event topic** : `tickatme-ticket-service-ticket-refreshcheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-retreived

**Event topic** : `tickatme-ticket-service-ticketpayment-retreived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpaymentbyorderid-got

**Event topic** : `tickatme-ticket-service-ticketpaymentbyorderid-got`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpaymentbypaymentid-got

**Event topic** : `tickatme-ticket-service-ticketpaymentbypaymentid-got`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-created

**Event topic** : `tickatme-ticket-service-ticketpayment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-updated

**Event topic** : `tickatme-ticket-service-ticketpayment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayments-listed

**Event topic** : `tickatme-ticket-service-ticketpayments-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayments` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayments`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayments-deleted

**Event topic** : `tickatme-ticket-service-ticketpayments-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentcustomer-retreived

**Event topic** : `tickatme-ticket-service-paymentcustomer-retreived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomer` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomer`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentcustomers-listed

**Event topic** : `tickatme-ticket-service-paymentcustomers-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomers` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomers`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentMethods-listed

**Event topic** : `tickatme-ticket-service-paymentmethods-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentMethods` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentMethods`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Index Event paymentmethod-created

**Event topic**: `elastic-index-tickatme_paymentmethod-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "paymentMethodId": "String",
  "userId": "ID",
  "organizerId": "ID",
  "customerId": "String",
  "cardHolderName": "String",
  "cardHolderZip": "String",
  "platform": "String",
  "cardInfo": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentmethod-updated

**Event topic**: `elastic-index-tickatme_paymentmethod-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "paymentMethodId": "String",
  "userId": "ID",
  "organizerId": "ID",
  "customerId": "String",
  "cardHolderName": "String",
  "cardHolderZip": "String",
  "platform": "String",
  "cardInfo": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentmethod-deleted

**Event topic**: `elastic-index-tickatme_paymentmethod-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "paymentMethodId": "String",
  "userId": "ID",
  "organizerId": "ID",
  "customerId": "String",
  "cardHolderName": "String",
  "cardHolderZip": "String",
  "platform": "String",
  "cardInfo": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentmethod-extended

**Event topic**: `elastic-index-tickatme_paymentmethod-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Route Event ticket-created

**Event topic** : `tickatme-ticket-service-ticket-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-startcheckoutked

**Event topic** : `tickatme-ticket-service-ticket-startcheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-completecheckoutked

**Event topic** : `tickatme-ticket-service-ticket-completecheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticket-refreshcheckoutked

**Event topic** : `tickatme-ticket-service-ticket-refreshcheckoutked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticket` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticket`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-retreived

**Event topic** : `tickatme-ticket-service-ticketpayment-retreived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpaymentbyorderid-got

**Event topic** : `tickatme-ticket-service-ticketpaymentbyorderid-got`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpaymentbypaymentid-got

**Event topic** : `tickatme-ticket-service-ticketpaymentbypaymentid-got`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-created

**Event topic** : `tickatme-ticket-service-ticketpayment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayment-updated

**Event topic** : `tickatme-ticket-service-ticketpayment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayments-listed

**Event topic** : `tickatme-ticket-service-ticketpayments-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayments` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayments`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event ticketpayments-deleted

**Event topic** : `tickatme-ticket-service-ticketpayments-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `ticketPayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`ticketPayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentcustomer-retreived

**Event topic** : `tickatme-ticket-service-paymentcustomer-retreived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomer` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomer`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentcustomers-listed

**Event topic** : `tickatme-ticket-service-paymentcustomers-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomers` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomers`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event paymentMethods-listed

**Event topic** : `tickatme-ticket-service-paymentmethods-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentMethods` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentMethods`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

# Copyright

All sources, documents and other digital materials are copyright of .

# About Us

For more information please visit our website: .

.
.
