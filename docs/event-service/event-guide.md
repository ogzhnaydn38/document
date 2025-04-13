---
id: event-guide
title:  EVENT GUIDE
sidebar_label:  EVENT GUIDE
sidebar_position: 1
---
# EVENT GUIDE

## tickatme-event-service

Event service manages the events of the organizer. It will also manage the event categories and cities and countries.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to . For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

# Documentation Scope

Welcome to the official documentation for the `Event` Service Event descriptions. This guide is dedicated to detailing how to subscribe to and listen for state changes within the `Event` Service, offering an exclusive focus on event subscription mechanisms.

**Intended Audience**

This documentation is aimed at developers and integrators looking to monitor `Event` Service state changes. It is especially relevant for those wishing to implement or enhance business logic based on interactions with `Event` objects.

**Overview**

This section provides detailed instructions on monitoring service events, covering payload structures and demonstrating typical use cases through examples.

# Authentication and Authorization

Access to the `Event` service's events is facilitated through the project's Kafka server, which is not accessible to the public. Subscription to a Kafka topic requires being on the same network and possessing valid Kafka user credentials. This document presupposes that readers have existing access to the Kafka server.

Additionally, the service offers a public subscription option via REST for real-time data management in frontend applications, secured through REST API authentication and authorization mechanisms. To subscribe to service events via the REST API, please consult the Realtime REST API Guide.

# Database Events

Database events are triggered at the database layer, automatically and atomically, in response to any modifications at the data level. These events serve to notify subscribers about the creation, update, or deletion of objects within the database, distinct from any overarching business logic.

Listening to database events is particularly beneficial for those focused on tracking changes at the database level. A typical use case for subscribing to database events is to replicate the data store of one service within another service's scope, ensuring data consistency and syncronization across services.

For example, while a business operation such as "approve membership" might generate a high-level business event like `membership-approved`, the underlying database changes could involve multiple state updates to different entities. These might be published as separate events, such as `dbevent-member-updated` and `dbevent-user-updated`, reflecting the granular changes at the database level.

Such detailed eventing provides a robust foundation for building responsive, data-driven applications, enabling fine-grained observability and reaction to the dynamics of the data landscape. It also facilitates the architectural pattern of event sourcing, where state changes are captured as a sequence of events, allowing for high-fidelity data replication and history replay for analytical or auditing purposes.

## DbEvent event-created

**Event topic**: `tickatme-event-service-dbevent-event-created`

This event is triggered upon the creation of a `event` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "eventName": "Text",
  "eventInfo": "Text",
  "ownerId": "ID",
  "eventImage": "String",
  "startDate": "Date",
  "minutes": "Integer",
  "categoryId": "ID",
  "venueName": "String",
  "venueAddress": "Text",
  "venueLocation": "String",
  "cityId": "ID",
  "countryId": "ID",
  "capacity": "Integer",
  "price": "Float",
  "published": "String",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent event-updated

**Event topic**: `tickatme-event-service-dbevent-event-updated`

Activation of this event follows the update of a `event` data object. The payload contains the updated information under the `event` attribute, along with the original data prior to update, labeled as `old_event`.

**Event payload**:

```json
{
  "old_event": {
    "id": "ID",
    "_owner": "ID",
    "eventName": "Text",
    "eventInfo": "Text",
    "ownerId": "ID",
    "eventImage": "String",
    "startDate": "Date",
    "minutes": "Integer",
    "categoryId": "ID",
    "venueName": "String",
    "venueAddress": "Text",
    "venueLocation": "String",
    "cityId": "ID",
    "countryId": "ID",
    "capacity": "Integer",
    "price": "Float",
    "published": "String",
    "organizerId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "event": {
    "id": "ID",
    "_owner": "ID",
    "eventName": "Text",
    "eventInfo": "Text",
    "ownerId": "ID",
    "eventImage": "String",
    "startDate": "Date",
    "minutes": "Integer",
    "categoryId": "ID",
    "venueName": "String",
    "venueAddress": "Text",
    "venueLocation": "String",
    "cityId": "ID",
    "countryId": "ID",
    "capacity": "Integer",
    "price": "Float",
    "published": "String",
    "organizerId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent event-deleted

**Event topic**: `tickatme-event-service-dbevent-event-deleted`

This event announces the deletion of a `event` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "eventName": "Text",
  "eventInfo": "Text",
  "ownerId": "ID",
  "eventImage": "String",
  "startDate": "Date",
  "minutes": "Integer",
  "categoryId": "ID",
  "venueName": "String",
  "venueAddress": "Text",
  "venueLocation": "String",
  "cityId": "ID",
  "countryId": "ID",
  "capacity": "Integer",
  "price": "Float",
  "published": "String",
  "organizerId": "ID",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent category-created

**Event topic**: `tickatme-event-service-dbevent-category-created`

This event is triggered upon the creation of a `category` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "name": "String",
  "sortOrder": "Integer",
  "featured": "Boolean",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent category-updated

**Event topic**: `tickatme-event-service-dbevent-category-updated`

Activation of this event follows the update of a `category` data object. The payload contains the updated information under the `category` attribute, along with the original data prior to update, labeled as `old_category`.

**Event payload**:

```json
{
  "old_category": {
    "id": "ID",
    "_owner": "ID",
    "name": "String",
    "sortOrder": "Integer",
    "featured": "Boolean",
    "published": "Boolean",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "category": {
    "id": "ID",
    "_owner": "ID",
    "name": "String",
    "sortOrder": "Integer",
    "featured": "Boolean",
    "published": "Boolean",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent category-deleted

**Event topic**: `tickatme-event-service-dbevent-category-deleted`

This event announces the deletion of a `category` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "name": "String",
  "sortOrder": "Integer",
  "featured": "Boolean",
  "published": "Boolean",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent country-created

**Event topic**: `tickatme-event-service-dbevent-country-created`

This event is triggered upon the creation of a `country` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "countryName": "String",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent country-updated

**Event topic**: `tickatme-event-service-dbevent-country-updated`

Activation of this event follows the update of a `country` data object. The payload contains the updated information under the `country` attribute, along with the original data prior to update, labeled as `old_country`.

**Event payload**:

```json
{
  "old_country": {
    "id": "ID",
    "_owner": "ID",
    "countryName": "String",
    "published": "Boolean",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "country": {
    "id": "ID",
    "_owner": "ID",
    "countryName": "String",
    "published": "Boolean",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent country-deleted

**Event topic**: `tickatme-event-service-dbevent-country-deleted`

This event announces the deletion of a `country` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "countryName": "String",
  "published": "Boolean",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent city-created

**Event topic**: `tickatme-event-service-dbevent-city-created`

This event is triggered upon the creation of a `city` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "cityName": "String",
  "countryId": "ID",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent city-updated

**Event topic**: `tickatme-event-service-dbevent-city-updated`

Activation of this event follows the update of a `city` data object. The payload contains the updated information under the `city` attribute, along with the original data prior to update, labeled as `old_city`.

**Event payload**:

```json
{
  "old_city": {
    "id": "ID",
    "_owner": "ID",
    "cityName": "String",
    "countryId": "ID",
    "published": "Boolean",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "city": {
    "id": "ID",
    "_owner": "ID",
    "cityName": "String",
    "countryId": "ID",
    "published": "Boolean",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent city-deleted

**Event topic**: `tickatme-event-service-dbevent-city-deleted`

This event announces the deletion of a `city` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "cityName": "String",
  "countryId": "ID",
  "published": "Boolean",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

# ElasticSearch Index Events

Within the `Event` service, most data objects are mirrored in ElasticSearch indices, ensuring these indices remain syncronized with their database counterparts through creation, updates, and deletions. These indices serve dual purposes: they act as a data source for external services and furnish aggregated data tailored to enhance frontend user experiences. Consequently, an ElasticSearch index might encapsulate data in its original form or aggregate additional information from other data objects.

These aggregations can include both one-to-one and one-to-many relationships not only with database objects within the same service but also across different services. This capability allows developers to access comprehensive, aggregated data efficiently. By subscribing to ElasticSearch index events, developers are notified when an index is updated and can directly obtain the aggregated entity within the event payload, bypassing the need for separate ElasticSearch queries.

It's noteworthy that some services may augment another service's index by appending to the entity’s `extends` object. In such scenarios, an `*-extended` event will contain only the newly added data. Should you require the complete dataset, you would need to retrieve the full ElasticSearch index entity using the provided ID.

This approach to indexing and event handling facilitates a modular, interconnected architecture where services can seamlessly integrate and react to changes, enriching the overall data ecosystem and enabling more dynamic, responsive applications.

## Index Event event-created

**Event topic**: `elastic-index-tickatme_event-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "eventName": "Text",
  "eventInfo": "Text",
  "ownerId": "ID",
  "eventImage": "String",
  "startDate": "Date",
  "minutes": "Integer",
  "categoryId": "ID",
  "venueName": "String",
  "venueAddress": "Text",
  "venueLocation": "String",
  "cityId": "ID",
  "countryId": "ID",
  "capacity": "Integer",
  "price": "Float",
  "published": "String",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event event-updated

**Event topic**: `elastic-index-tickatme_event-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "eventName": "Text",
  "eventInfo": "Text",
  "ownerId": "ID",
  "eventImage": "String",
  "startDate": "Date",
  "minutes": "Integer",
  "categoryId": "ID",
  "venueName": "String",
  "venueAddress": "Text",
  "venueLocation": "String",
  "cityId": "ID",
  "countryId": "ID",
  "capacity": "Integer",
  "price": "Float",
  "published": "String",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event event-deleted

**Event topic**: `elastic-index-tickatme_event-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "eventName": "Text",
  "eventInfo": "Text",
  "ownerId": "ID",
  "eventImage": "String",
  "startDate": "Date",
  "minutes": "Integer",
  "categoryId": "ID",
  "venueName": "String",
  "venueAddress": "Text",
  "venueLocation": "String",
  "cityId": "ID",
  "countryId": "ID",
  "capacity": "Integer",
  "price": "Float",
  "published": "String",
  "organizerId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event event-extended

**Event topic**: `elastic-index-tickatme_event-extended`

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

## Route Event event-retrived

**Event topic** : `tickatme-event-service-event-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event event-updated

**Event topic** : `tickatme-event-service-event-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event event-published

**Event topic** : `tickatme-event-service-event-published`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event category-retrived

**Event topic** : `tickatme-event-service-category-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `category` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`category`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event category-created

**Event topic** : `tickatme-event-service-category-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `category` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`category`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event categories-listed

**Event topic** : `tickatme-event-service-categories-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `categories` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`categories`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event country-found

**Event topic** : `tickatme-event-service-country-found`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `country` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`country`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event city-retrived

**Event topic** : `tickatme-event-service-city-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `city` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`city`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event city-created

**Event topic** : `tickatme-event-service-city-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `city` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`city`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Index Event category-created

**Event topic**: `elastic-index-tickatme_category-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "name": "String",
  "sortOrder": "Integer",
  "featured": "Boolean",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event category-updated

**Event topic**: `elastic-index-tickatme_category-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "name": "String",
  "sortOrder": "Integer",
  "featured": "Boolean",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event category-deleted

**Event topic**: `elastic-index-tickatme_category-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "name": "String",
  "sortOrder": "Integer",
  "featured": "Boolean",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event category-extended

**Event topic**: `elastic-index-tickatme_category-extended`

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

## Route Event event-retrived

**Event topic** : `tickatme-event-service-event-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event event-updated

**Event topic** : `tickatme-event-service-event-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event event-published

**Event topic** : `tickatme-event-service-event-published`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event category-retrived

**Event topic** : `tickatme-event-service-category-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `category` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`category`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event category-created

**Event topic** : `tickatme-event-service-category-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `category` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`category`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event categories-listed

**Event topic** : `tickatme-event-service-categories-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `categories` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`categories`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event country-found

**Event topic** : `tickatme-event-service-country-found`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `country` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`country`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event city-retrived

**Event topic** : `tickatme-event-service-city-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `city` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`city`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event city-created

**Event topic** : `tickatme-event-service-city-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `city` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`city`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Index Event country-created

**Event topic**: `elastic-index-tickatme_country-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "countryName": "String",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event country-updated

**Event topic**: `elastic-index-tickatme_country-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "countryName": "String",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event country-deleted

**Event topic**: `elastic-index-tickatme_country-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "countryName": "String",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event country-extended

**Event topic**: `elastic-index-tickatme_country-extended`

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

## Route Event event-retrived

**Event topic** : `tickatme-event-service-event-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event event-updated

**Event topic** : `tickatme-event-service-event-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event event-published

**Event topic** : `tickatme-event-service-event-published`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event category-retrived

**Event topic** : `tickatme-event-service-category-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `category` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`category`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event category-created

**Event topic** : `tickatme-event-service-category-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `category` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`category`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event categories-listed

**Event topic** : `tickatme-event-service-categories-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `categories` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`categories`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event country-found

**Event topic** : `tickatme-event-service-country-found`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `country` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`country`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event city-retrived

**Event topic** : `tickatme-event-service-city-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `city` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`city`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event city-created

**Event topic** : `tickatme-event-service-city-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `city` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`city`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Index Event city-created

**Event topic**: `elastic-index-tickatme_city-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "cityName": "String",
  "countryId": "ID",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event city-updated

**Event topic**: `elastic-index-tickatme_city-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "cityName": "String",
  "countryId": "ID",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event city-deleted

**Event topic**: `elastic-index-tickatme_city-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "cityName": "String",
  "countryId": "ID",
  "published": "Boolean",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event city-extended

**Event topic**: `elastic-index-tickatme_city-extended`

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

## Route Event event-retrived

**Event topic** : `tickatme-event-service-event-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event event-updated

**Event topic** : `tickatme-event-service-event-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event event-published

**Event topic** : `tickatme-event-service-event-published`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `event` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`event`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event category-retrived

**Event topic** : `tickatme-event-service-category-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `category` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`category`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event category-created

**Event topic** : `tickatme-event-service-category-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `category` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`category`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event categories-listed

**Event topic** : `tickatme-event-service-categories-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `categories` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`categories`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event country-found

**Event topic** : `tickatme-event-service-country-found`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `country` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`country`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event city-retrived

**Event topic** : `tickatme-event-service-city-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `city` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`city`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

## Route Event city-created

**Event topic** : `tickatme-event-service-city-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `city` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`city`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

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

# Copyright

All sources, documents and other digital materials are copyright of .

# About Us

For more information please visit our website: .

.
.
