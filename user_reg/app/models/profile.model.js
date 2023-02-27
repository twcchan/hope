// Define the schema Profile
module.exports = mongoose => {
  const Profile = mongoose.model(
    "profile",
    mongoose.Schema(
      {
        username: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
      },
      { timestamps: true }
    )
  );

  return Profile;
};