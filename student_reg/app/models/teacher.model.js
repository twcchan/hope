// Define the schema Teacher
module.exports = mongoose => {
  const Teacher = mongoose.model(
    "teacher",
    mongoose.Schema(
      {
        email: { type: String, required: true, unique: true }
      },
      { timestamps: true }
    )
  );

  return Teacher;
};