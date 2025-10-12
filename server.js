require('dotenv').config({ debug: true })
console.log("MONGO_URI:", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { exec } = require('child_process'); // For auto-opening browser
const bodyParser = require("body-parser"); 

const app = express();

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// Below all the app.use methods
app.use(session({
    secret : "any long secret key",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());



// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({extended:true})); 

const morgan = require('morgan');
app.use(morgan('dev'));  // More detailed HTTP request logging


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));



 const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(passportLocalMongoose); 

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));    
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/logs", require("./routes/logRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("Project Collaboration Tool is running");
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Auto-open browser
  if (process.env.NODE_ENV !== 'production') {
    const url = `http://localhost:${PORT}`;
    console.log(`Attempting to open browser at ${url}`);
    
    const command = process.platform === 'win32' 
      ? `start ${url}`
      : process.platform === 'darwin'
        ? `open ${url}`
        : `xdg-open ${url}`;
    
    exec(command, (error) => {
      if (error) {
        console.log('Could not auto-open browser. Please manually visit:', url);
      }
    });
  }
});