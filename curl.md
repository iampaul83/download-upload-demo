```bash

curl -X "POST" "http://localhost:8080/rest/api" \
     -H "content-type: application/json" \
     --data-binary "@test.json"


curl -X POST http://localhost:8080/upload-single \
     --data-binary "@image.jpg"

curl -X POST http://localhost:8080/urlencoded \
     --data-binary "@urlencoded.txt"
      
```