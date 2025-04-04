import mongoose from "mongoose";


const SequenceSchema = new mongoose.Schema({
  leadEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  delay:{
   type: Number,
   required: true
  },
  nodes: { type: Array, required: true }, 
  edges: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
});



const Sequence = mongoose.model("Sequence", SequenceSchema);

export default Sequence;
