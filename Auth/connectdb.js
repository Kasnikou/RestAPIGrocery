const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://kasnikouskaya:q2t8JXLVN6MZg2K0@cluster0.soxq2t8.mongodb.net/GelosGrocerydb?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB Atlas");

    // Access the list of collections
    connection.connection.on("open", function () {
      connection.connection.db.listCollections().toArray(function (err, names) {
        if (err) {
          console.error("Error fetching collections:", err);
        } else {
          console.log("Existing collections:", names);
        }
      });
    });
  } catch (error) {
    console.error("Connection error:", error);
  }
};

module.exports = connectToDatabase;
connectToDatabase();
