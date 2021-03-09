# case-number-service

Service that generates unique case-number to be used within a `mu.semte.ch` stack.

## Installation

### Basic

To add the service to your `mu.semte.ch` stack, add the following snippet to docker-compose.yml:

```yaml
services:
  case-number:
    image: lblod/case-number-service:x.x.x
```
To make it available to the CLIENT configure the [dispatcher](https://github.com/mu-semtech/mu-dispatcher):

```
  get "/case-numbers/*path", _ do
    forward conn, [], "http://case-number/generate"
  end
```
### Environment variables

Provided [environment variables](https://docs.docker.com/compose/environment-variables/) by the service. These can be added in within the docker declaration.

| NAME                    | DESCRIPTION                                             | DEFAULT                                                                                                                                    |
|-------------------------|---------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `CASE_NUMBER_ID_LENGTH` | Represents the length of the ID within the case-number. | `6`                                                                                                                                          |
| `CASE_NUMBER_PREDICATE` | Predicate where case-numbers can be found.              | **[nie:identifier](http://www.semanticdesktop.org/ontologies/2007/01/19/nie#identifier)** |
| `CASE_NUMBER_MAX_RETRY` | Times allowed to retry generating a unique ID.          | `150`            

## API

> **GET** `/generate?prefix=FS2020&amount=5`

#### URL Parameters

| PARAMETER  | DESCRIPTION                                  | DEFAULT |
|--------|----------------------------------------------|---------|
| `amount` | Amount of case-numbers to be generated.      | `1`     |
| `prefix` | Custom prefix to be used in the case-number. | `''`    |

#### Response

```
HTTP/1.1 
200 OK
X-Powered-By: Express
content-type: application/json; charset=utf-8

[
 "FS2020B338C4",
 "FS2020794ADD",
 "FS2020AA255F",
 "FS2020E8CBA0",
 "FS202083670D"
]
```

## Development

For a more detailed look in how to develop a microservices based on
the [mu-javascript-template](https://github.com/mu-semtech/mu-javascript-template), we would recommend
reading "[Developing with the template](https://github.com/mu-semtech/mu-javascript-template#developing-with-the-template)"

### Developing in the `mu.semte.ch` stack

Paste the following snip-it in your `docker-compose.override.yml`:

````yaml  
subsidy-applications-management:
  image: semtech/mu-javascript-template:1.5.0-beta.1
  ports:
    - 8888:80
    - 9229:9229
  environment:
    NODE_ENV: "development"
  volumes:
    - /absolute/path/to/your/sources/:/app/
````