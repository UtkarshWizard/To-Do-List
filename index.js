import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === 'production' });
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose"; //Imported Mongoose to Store our data.
import _ from "lodash"; // lodash is used for Making the inputs first letter Capital always.

const app = express();
const port = process.env.PORT || 3000;
const dbURL = process.env.DB_URL;
mongoose.connect (dbURL); // Url to connect to mongoose server.

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

app.use (express.static("public"));

app.use (bodyParser.urlencoded({ extended:true}));

const d = new Date();
let day = weekday[d.getDay()];

// let newItems = [];   // previously they were used to store Data 
// let workItems = [];

const itemsSchema = {
    name : String,
};
                           // } These are the scheme which will be followed.
const WorkItemSchema = {
    name : String,
};

const Item = mongoose.model ("Item", itemsSchema);      // } These are the Models using respective schemes.
const Work = mongoose.model ("Work", WorkItemSchema);

const task1 = new Item ({
    name: "Welcome to Your List.",
  });
  
const task2 = new Item ({
    name: "Hit the + to create new Task.",     // } These are the default displayed Tasks.
});
  
const task3 = new Item ({
    name: "<-- Hit this to Delete an item. ",
});

const defaultItems = [task1, task2 , task3];

const ListSchema  = {
    items : [itemsSchema],     // List items Scheme 
};

const List = mongoose.model ("List", ListSchema);   // List items Model

// To Render Homepage with default Items.
app.get("/", (req, res) => {
    
    Item.find()
     .then((items) => {
        if (items.length === 0) {
            Item.insertMany(defaultItems)
             .then(() => {
                console.log ("Succesfully Added");
             })
             .catch((err) => {
                console.log (err);
             });
             res.redirect ("/");
        } else {
            res.render ("index.ejs", {dayname:day , newListItems: items});
        }
     })
     .catch((err) => {
        console.log(err);
     })
});

// To Render Work Page with Default Items.
app.get("/w", (req, res) => {

    Work.find()
    .then((items) => {
       if (items.length === 0) {
           Work.insertMany(defaultItems)
            .then(() => {
               console.log ("Succesfully Added");
            })
            .catch((err) => {
               console.log (err);
            });
            res.redirect ("/w");
       } else {
           res.render ("work.ejs", {dayname:day , newWorkItems: items});
       }
    })
    .catch((err) => {
       console.log(err);
    })
});

// To Switch to To-Do List.
app.post("/submit", (req,res) => {
    res.redirect("/");
});

// To Switch to Work List.
app.post("/work", (req,res) => {
    res.redirect("/w");
});

// To add new Task to To-Do List.
app.post("/add1", (req,res) => {

    const itemName = req.body.fName;

    const newItem = new Item ({
        name : itemName,
    });

    List.find(newItem)
     .then(() => {
        newItem.save(),
        res.redirect("/")
     })
     .catch ((err) => {
        console.log(err)
     })

});

// To add New Task to Work list.
app.post("/add2", (req,res) => {

    const itemName = req.body.wName;

    const newItem = new Work ({
        name : itemName,
    });

    List.find(newItem)
     .then(() => {
        newItem.save(),
        res.redirect("/w")
     })
     .catch ((err) => {
        console.log(err)
     })
});

// To Delete from To-Do.
app.post("/delete" , (req,res) => {

    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove (checkedItemId)
     .then(() => {
        console.log ("Deleted Succesfully.")
     })
     .catch((err) => {
        console.log(err)
     });
     res.redirect("/");
});

// To Delete from Work.
app.post("/deletework" , (req,res) => {

    const checkedItemId = req.body.checkbox;

    Work.findByIdAndRemove (checkedItemId)
     .then(() => {
        console.log ("Deleted Succesfully.")
     })
     .catch((err) => {
        console.log(err)
     });
     res.redirect("/w");
});



app.listen (port, () => {
   console.log(`server is running on port ${port}`)
});