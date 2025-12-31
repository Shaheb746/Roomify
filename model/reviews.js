
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
    comment: {
        type: String
    },
    rating: {
        type: Number,
        min:1, 
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

let Review = mongoose.model("Review", reviewsSchema)

export default Review;