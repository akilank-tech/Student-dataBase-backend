const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const Student = require("./models/student")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/student")

    .then(() => {
        console.log("MongoDB Connected Successfully")
    }).catch((error) => {
        console.log("MongoDB Connection Failed", error)
    })

app.post("/addstudent", async (req, res) => {
    const newStudent = new Student({
        name: req.body.name,
        age: req.body.age,
        course:req.body.course,
        status:req.body.status
    })
    await newStudent.save()
    res.send("Student Added Successfully.")
})

app.post("/addstudents",async (req,res)=>{
    await Student.insertMany(req.body)
    res.send("Multible Students Added.")
})

app.get("/students",async (req,res)=>{
    const studentList= await Student.find()
    res.send(studentList)
})

app.get("/search/:course",async(req,res)=>{
    const result = await Student.find({
        course:req.params.course
    })
    res.send(result)
})

app.put("/update/:id", async (req,res)=>{
    await Student.findByIdAndUpdate(
        req.params.id,{status:req.body.status}
    )
    res.send("Student Updated Successfully.")
})

app.put("/updateall",async (req,res)=>{
    await Student.updateMany(
        {status:"Active"},
        {$set:{status:"Completed"}}
    )
    res.send("All Active Students Updated.")
})

app.delete("/delete/:id",async (req,res)=>{
    await Student.findByIdAndDelete(req.params.id)
    res.send("Student Deleted Successfully.")
})

app.delete("/deleteall", async (req,res)=>{
    await Student.deleteMany({})
    res.send("All Students Deleted.")
})

app.get("/operators/:type",async (req,res)=>{
    const type =req.params.type
    let result =[]
    if (type === "gt"){
        result =await Student.find({age:{$gt:18}})
    }
    else if(type === "lt"){
        result =await Student.find({age:{$lt:25}})
    }
    else if(type === "in"){
        result= await Student.find({course:{$in:["MERN Stack","React JS"]}})
    }
    else if (type === "and"){
        result = await Student.find({$and:[{age:{$gt:18}},
            {status:"Active"}
        ]})
    }
    else if (type==="or"){
        result = await Student.find({
            $or:[
                {course:"MERN Stack"},
                {course:"React JS"}
            ]
        })
    }
    else if (type==="exists"){
        result=await Student.find({
           status:{$exists: true}
        })
    }
    res.send(result)
})
app.listen(5000,()=>{
    console.log("Server Running on Port 5000")
})