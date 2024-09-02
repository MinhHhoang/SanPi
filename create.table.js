const Employees = require('./models/employee.model'); 
const Factories = require('./models/factory.model'); 
const Products = require('./models/product.model'); 
const Customers = require('./models/customer.model'); 
const Bookings = require('./models/booking.model'); 
const Settings = require('./models/setting.model'); 
const Schedules = require('./models/schedule.model'); 
const ReminderCares = require('./models/remindercare.model'); 
const BookingDetail = require('./models/bookingdetail.model'); 
const sequelize = require('./models/connection');


// Sync all models with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables synchronized successfully.');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

module.exports = sequelize