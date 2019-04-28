const express = require('express')
const app = express()

app.get('*', function (req, res) {
  res
    .status(200)
    .send({
      errors: [],
      data: 'Hello World'
    })
})

const port = process.env.PORT || 4000

app.listen(port, function () {
  console.log(`API server running on port ${port}`)
})