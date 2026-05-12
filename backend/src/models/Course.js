const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  videoUrl: { type: String },
  duration: { type: Number }, // in minutes
  order: { type: Number, required: true },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lessons: [lessonSchema],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: { type: String, required: true },
    tags: [String],
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    isPublished: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    documents: [
      {
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

courseSchema.virtual("studentCount").get(function () {
  return this.enrolledStudents.length;
});

module.exports = mongoose.model("Course", courseSchema);
