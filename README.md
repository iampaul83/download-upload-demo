# upload download example

## install and run

```bash
# install node dependency
npm install

# run server
node index.js
```

## 上傳

### API

#### `/upload`

content-type: multipart/form-data
body: [multipart/form-data encoded data]

#### `/upload-single`

content-type: {{ mime type of file }} / application/octet-stream
body: [binary file data]


### cURL

```bash
# multipart/form-data
curl -X POST \
      -F "file=@sendFile.js" \
      http://localhost:8080/upload

# body
curl -X POST \
      -H "content-type: text/javascript" \
      -H "x-file-name: sendFile.js" \
      --data-binary "@sendFile.js" \
      http://localhost:8080/upload-single
```


### 瀏覽器

http://localhost:8080/

上傳方式：

- form: `/upload`
- body: `/upload-single`
