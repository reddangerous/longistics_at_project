import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const connectDB = async () => {
  try {
    const mongourl = process.env.MONGO_URI
    //console.log(mongourl)
    const conn = await mongoose.connect(mongourl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}

export default connectDB
