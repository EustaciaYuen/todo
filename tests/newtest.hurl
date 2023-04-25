POST http://localhost:3000/create
{
    "todo": "hello!!",
    "date": "2023-04-23T22:02:01.006Z"
}

HTTP/1.1 302
[Captures]
id: header "Created-Location" regex "([^\/]+$)"

GET http://localhost:3000/all

HTTP/1.1 200
[Asserts]
body contains "{{id}}"

PUT http://localhost:3000/update
{
    "todo": "not sad!!",
    "date": "2023-04-23T22:02:01.006Z",
    "id": "{{id}}"
}

HTTP/1.1 302

DELETE http://localhost:3000/delete/{{id}}

HTTP/1.1 302
[Asserts]
body not contains "{{id}}"