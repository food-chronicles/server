# Food Chronicles

## RESTful endpoints

### POST /product

> Post new product

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
{
  "name": "<Product Name>",
  "location": {
    "latitude": "<Block Latitude coordinate>",
    "longitude": "<Block Longitude coordinate"
  },
  "data": {
      <Block data_key>: <Block data_field>
  },
  "image_url": "<Block image_url>"
}
```

_Response (201)_

```
{
  "chain": [
    {
      "index": 0,
      "timestamp": "<Time Blockchain created>",
      "location": "0",
      "image_url": "Genesis block",
      "user": "Genesis block",
      "data": "Genesis block",
      "previousHash": "0",
      "hash": "<Hash Genesis Blockchain>",
      "nonce": 0
    },
    {
      "index": 1,
      "timestamp": "<Time Blockchain created>",
      "key": "<Block unique key>",
      "location": {
        "latitude": "<Block Latitude coordinate>",
        "longitude": "<Block Longitude coordinate",
        "city": "<Block City>",
        "region": "<Block Region>",
        "country": "<Block Country>"
      },
      "image_url": "<Block Image_url>",
      "user": {
        "id": "<User Id that created the Block>",
        "username": "<User Username that created the Block>",
        "company_name": "<User Company Name that created the Block>",
        "category": "<User Category that created the Block>"
      },
      "data": {
          <Block data_key>: <Block data_field>
      },
      "previousHash": "<Previous Block Hash>",
      "hash": "<This Block Hash>",
      "nonce": 0
    }
  ],
  "_id": "<Product Id>",
  "name": "<Product Name>",
  "__v": 0
}
```

_Response (400)_

```
{
  "message": "<Validation Error message>"
}
```

_Response (500)_

```
{
  "message": "<Error message>"
}
```

### GET /product

> Get all product

_Request Header_

```
{
    "access_token": "<your access token>"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
    {
        "_id": "<Product Id that of has the Block you created>",
        "name": ""<Product Name that of has the Block you created>"
    },
    {
        "_id": "<Product Id that of has the Block you created>",
        "name": "<Product Name that of has the Block you created>"
    },
]
```

_Response (500)_

```
{
    "message": "<Error message>"
}
```

### GET /product/:id

> Get product by id

_Request Header_

```
{
    "access_token": "<your access token>"
}
```

_Request Params_

```
{
    "id": <product id>
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
  "_id": "<Product Id>",
  "name": "<Product Name>",
  "chain": [
    {
      "index": 0,
      "timestamp": "<Time Blockchain created>",
      "location": "0",
      "image_url": "Genesis block",
      "user": "Genesis block",
      "data": "Genesis block",
      "previousHash": "0",
      "hash": "<Hash Genesis Blockchain>",
      "nonce": 0
    },
    {
      "index": 1,
      "timestamp": "<Time Blockchain created>",
      "key": "<Block unique key>",
      "location": {
        "latitude": "<Block Latitude coordinate>",
        "longitude": "<Block Longitude coordinate",
        "city": "<Block City>",
        "region": "<Block Region>",
        "country": "<Block Country>"
      },
      "image_url": "<Block Image_url>",
      "user": {
        "id": "<User Id that created the Block>",
        "username": "<User Username that created the Block>",
        "company_name": "<User Company Name that created the Block>",
        "category": "<User Category that created the Block>"
      },
      "data": {
          <data_key>: <data_field>
      },
      "previousHash": "<Previous Block Hash>",
      "hash": "<This Block Hash>",
      "nonce": 0
    }
  ],
}
```

_Response (404)_

```
{
    "message": "<Product Not Found>"
}
```

### PUT /product/:id

> Update product by id

_Request Header_

```
{
    "access_token": "<your access token>",
    "key": "<Unique key of the previous Block>"
}
```

_Request Body_

```
{
  "location": {
    "latitude": "<Block Latitude coordinate>",
    "longitude": "<Block Longitude coordinate"
  },
  "data": {
      <Block data_key>: <Block data_field>
  },
  "image_url": "<Block image_url>"
}
```

_Response (200)_

```
{
  "message": "1 doc has been updated"
}
```

_Response (400)_

```
{
  "message": "<Validation Error message>"
}
```

_Response (404)_

```
{
  "message": "Product not found"
}
```

_Response (500)_

```
{
  "message": "<Error message>"
}
```

### POST /register

> Post new User

_Request Body_

```
{
  "email": "<User Email>",
  "username": "<User Username>",
  "password": "<User Password>",
  "company_name": "<User Company Name>",
  "category": "<User Category>"
}
```

_Response (201)_

```
{
  "_id": "<User ID>",
  "email": "<User Email>",
  "username": "<User Username>",
  "password": "<User Hash Password>",
  "company_name": "<User Company Name>",
  "category": "<User Category>"
  "history": [],
  "access_token": "<access_token>"
}
```

_Response (400)_

```
{
  "message": "<Validation Error message>"
}
```

### POST /login

> Post User login

_Request Body_

```
{
  "email": "<User email>",
  "password": "<User password>"
}
```

_Response (200)_

```
{
  "accessToken": "<generated by system>"
}
```

_Response (400)_

```
{
  "message": "<Validation Error message>"
}
```

### GET /user

> Get User

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Response (200)_

```
{
  "_id": "<User Id>"
  "email": "<User Email>",
  "username": "<User Username>",
  "password": "<User Password>",
  "company_name": "<User Company Name>",
  "category": "<User Category>"
}
```

_Response (401)_

```
{
  "message": "Please login / register first"
}
```
