// models/city.js
import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true
  }
});

export default mongoose.model("City", citySchema);
