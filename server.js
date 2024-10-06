const express = require('express');
const { connectDB, sequelize } = require('./config/db');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors'); 

dotenv.config();

const app = express();

connectDB();

sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('Error syncing database:', err);
});

app.use(cors()); 
app.use(bodyParser.json()); 

app.use('/api/auth', require('./routes/auth'));
app.use('/api/', require('./routes/map'));
app.use('/api/', require('./routes/evacuation'));
app.use('/api/', require('./routes/news'));
app.use('/api/', require('./routes/notification'));
app.use('/api/', require('./routes/message'));
app.use('/api/', require('./routes/checklist'));
app.use('/api/', require('./routes/contact'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
