const mongoose = require ('mongoose')
require('dotenv').config();


module.exports = async () => {


    try {
      await mongoose.connect(process.env.MONGO_URI)
      console.log('connected to Db mongoDb')
    }

    catch (err) {
      console.log('connection failed', err)
    }
}