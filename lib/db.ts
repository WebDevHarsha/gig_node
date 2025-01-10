import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;
// const MONGODB_URI="mongodb+srv://vasriharsha:Ut0yt3ipatMYrGEY@doodle-diary.f1edz.mongodb.net/?retryWrites=true&w=majority"
const MONGODB_URI="mongodb+srv://harsha:harsha@node.umk2h.mongodb.net/?retryWrites=true&w=majority&appName=Node"

const connect=async ()=>{
    const connectionState=mongoose.connection.readyState;
  
    if(connectionState===1){
        console.log("Already connected to the database");
        return;
    }

    if(connectionState===2){
        console.log("connecting to the database");
        return;
    }

    try{
        mongoose.connect(MONGODB_URI!,{
            dbName:"gigNode",
            bufferCommands:true
        });
        console.log("Connected to the database");
    }catch(err){
        console.error("Error:",err);
        throw new Error("Error connecting to the database");
    }
}


export default connect;

// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
// }

// async function connect() {
//   const opts: mongoose.ConnectOptions = {
//     serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
//     autoIndex: false, // Recommended for production
//     maxPoolSize: 10, // Limit number of connections
//   };

//   try {
//     const connection = await mongoose.connect(MONGODB_URI!, opts);
//     console.log('MongoDB connected successfully');
//     return connection;
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     throw error;
//   }
// }

// export default connect;