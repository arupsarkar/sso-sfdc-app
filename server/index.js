const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 8080

const app = express()
app.use(express.static(path.resolve(__dirname, '../client/build')))
app.get('/api', async (req, res, next) => {
    console.log('calling api endpoint')
    res.json({message: 'hello from server 2'})
})
app.get('*', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
