// Define the schema Student
module.exports = mongoose => {
  const Student = mongoose.model(
    "student",
    mongoose.Schema(
      {
        email: { type: String, required: true, unique: true },
        suspended: { type: String, required: false, default: false }
      },
      { timestamps: true }
    )
  );

  return Student;
};