// Define the schema Registration
module.exports = mongoose => {
  const Registration = mongoose.model(
    "registration",
    mongoose.Schema(
      {
        teacherEmail: { type: String, required: true },
        studentEmail: { type: String, required: true },
      },
      { timestamps: true }
    )
  );

  Registration.schema.index({ teacherEmail: 1, studentEmail: 1 }, { unique: true });

  return Registration;
};