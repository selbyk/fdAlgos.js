fdAlgos.js
===

[![Build Status](https://travis-ci.org/selbyk/fdAlgos.js.svg)](https://travis-ci.org/selbyk/fdAlgos.js)

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

## Build

Concatenates ./lib/* and fdalgos-wt.js, replaces module exports, and runs wt create

```bash
$ grunt buildwt
```

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

{ "attrs": ["A","B","C","D","E"], "fds": [ [["A","B"], ["E"]], [["A","D"], ["B"]], [["B"], ["C"]], [["C"], ["D"]] ] }
```

#### Response

```json
{
    "specialKeys": {
        "necessary": [
            "A"
        ],
        "useless": [
            "E"
        ],
        "middleGround": [
            "B",
            "C",
            "D"
        ],
        "candidate": [
            [
                "B",
                "A"
            ],
            [
                "C",
                "A"
            ],
            [
                "D",
                "A"
            ]
        ]
    },
    "3nf": [
        [
            "A",
            "B",
            "E"
        ],
        [
            "A",
            "D",
            "B"
        ],
        [
            "B",
            "C"
        ],
        [
            "C",
            "D"
        ],
        [
            "B",
            "A"
        ]
    ],
    "bcnf": [
        [
            "B",
            "C"
        ],
        [
            "C",
            "D"
        ],
        [
            "A",
            "B",
            "E"
        ]
    ]
}
```
