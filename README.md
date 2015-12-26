fdalgos.js
===

[![Build Status](https://travis-ci.org/selbyk/fdalgos.js.svg)](https://travis-ci.org/selbyk/fdalgos.js)

Functional dependency algorithms for relational database schema normalization

Webtask.io microservice built and deployed via grunt

Usage
---

## Testing

Concatenates ./lib/* and fdalgos-wt.js, replaces module exports, and runs wt create

```bash
$ grunt test
```

Webtask.io
---

## Deployment

Concatenates ./lib/* and fdalgos-wt.js, replaces module exports, and runs wt create

```bash
$ grunt deploywt
```

## Service API Usage

### Example Request

#### Request

```http
POST /api/run/wt-selby_kendrick-gmail_com-0/fdalgos-wt HTTP/1.1
Host: webtask.it.auth0.com
Content-Type: application/json
Cache-Control: no-cache

{ "attrs": ["a","b","c"] }
```

#### Response

```json
{"combinations":[["a"],["b"],["c"],["a","b"],["a","c"],["b","c"],["a","b","c"]]}
```
