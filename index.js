const express = require('express');
require("dotenv").config();
const cors = require('cors')
// const multer = require("multer");
// const path = require('path');

// import files
const connectDB = require("./config/db");

const authRoute = require("./routes/auth")
const postRoute = require("./routes/post")


connectDB();
const app = express();

// middleware
// app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)

// upload files
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "images");
//     },
//     filename: (req, file, cb) => {
//         // const uniqueSuffix=Date.now() + '-' + Math.round(Math.random() * 1E9)
//         // cb(null,file.fieldname + '_' + uniqueSuffix);
//         cb(null, req.body);
    
//     },
// });

// const upload = multer({storage: storage});
// const upload = multer({ dest: 'uploads/' })


// app.post('/profile', upload.single('avatar'), function (req, res, next) {
//     // req.file is the `avatar` file
//     console.log(req.body.file, req.body)
//     // req.body will hold the text fields, if there were any
//   })
  

// app.post("/api/upload", upload.array("files"), async (req, res) => {
//     const files = req.body.files;
//     console.log(files)
//     console.log("files")
//     // const result = await uploadFile(file)
//     // console.log(result)
//     // const description = req.body.description;
//     res.status(200).json({message: "File has been uploaded"})
// })

// app run
app.get("/", (req, res) => {
    res.json({message: "api running..."})
})

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`) )