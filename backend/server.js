import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import mpesa_routes from './routes/mpesa_routes.js'
import handleUSSD from './ussddelivery/customerUssd.js'
dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.use("/mpesa", mpesa_routes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)


// LOGISTICS PART
app.post('/ussd', (req, res) => {
  console.log("session started")
  const { phoneNumber, text } = req.body;
  let response = '';
  if (text === '') {
    response = 'CON Welcome to our delivery service. Choose an option:\n1. Place an Order\n2. Track an Order\n3. Contact Support';
  } else if (text === '1') {
    response = 'CON Please enter your order details:';
  } else if (text === '2') {
    response = 'CON Please enter your order number:';
  } else if (text === '3') {
    response = 'CON Please enter your query:';
  }
  // Add more conditions here to handle other user inputs

  console.log(response);
  res.set('Content-Type', 'text/plain');
  res.send(response);
});

// app.post('/sms', (req, res) => {
//   const { phoneNumber, message } = req.body;
//   sendSMS(phoneNumber, message);
//   res.send('SMS sent successfully');
// }
// );

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
