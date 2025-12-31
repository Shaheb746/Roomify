// models/state.js
import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true
  }
});

export default mongoose.model("State", stateSchema);
