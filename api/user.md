User API
-----------

# User - Read data of a User

## Method
> GET

## URL
> /user/:id

## Example usage
http://localhost/user/21

## Request parameter
|Field|Type|Description|
|:--- |:---|---|
|id |string|

## Response parameter
|Field|Type|Description|
|:----- |:------|:----------------------------- |
|id | int |
|name | string | 
|birthday | string |
|passport|int|
|driverLicense|string
|address|string
|password|string
|email|string
|createdAt|string
|updatedAt|string

## Response example
```
{
    "user": {
        "id": 21,
        "name": "Foo Bar",
        "birthday": "1992-01-01",
        "passport": "eh000000",
        "driverLicense": 123456,
        "address": "22 Tecoma",
        "password": "$10$Tw0pqw4k8JSZcHlOJyz4dOAj1M6vyRMEN.3s8uCsUvZ6845DFyWQO",
        "email": "1234@123.com",
        "phoneNumber": 0432811111,
        "createdAt": "2020-09-07T18:22:04.280Z",
        "updatedAt": "2020-09-07T18:22:04.280Z"
    }
}
```

# User - Create a new User

## Method
> POST

## URL
> /user

## Example usage
http://localhost/user

## Request parameter
|Field|Type|Description|
|:----- |:------|:----------------------------- |
|name | string | 
|birthday | string |
|passport|int|
|driverLicense|string
|address|string
|password|string
|email|string
|phoneNumber|int

## Request exapmle
```
{
    "name": "Foo Bar",
    "birthday": "1992-01-01",
    "passport": "eh000000",
    "driverLicense": 123456,
    "address": "22 Tecoma",
    "password": "abc123",
    "email": "1234@123.com",
    "phoneNumber": 0432811111
}
```

## Response parameter
|Field|Type|Description|
|:--- |:---|---|
|status |int|
|id |int|option

## Response example - Success
```
{
    "status": "success",
    "id": 21
}
```

## Response example - Fail
```
{
    "status": "error"
}
```

