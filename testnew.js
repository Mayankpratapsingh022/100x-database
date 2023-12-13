const { Users } = require("./models");

async function createModels() {
  const user1 = await Users.create({
    id: "6",
    displayName: "veronica",
    username: "veron",
    email: "veron@example.com",
    password: "#er34", // replace with a hashed password
    bio: "I am strongest.",
    location: "Vatican city",
    webiste: "https://veron.com",
    profilePicUrl: "https://veron.com/profile.jpg",
    headerPicUrl: "https://veron.com/cover.jpg",
    dateOfBirth: new Date(req.body.Datee),
  });

  // const user2 = await User.create({
  //   id: "2",
  //   name: "Betty",
  //   username: "betty",
  //   email: "betty@example.com",
  //   passwordHash: "#er34", // replace with a hashed password
  //   bio: "I am beautiful.",
  //   location: "Riverdal city",
  //   website: "https://betty.com",
  //   profilePicture: "https://betty.com/profile.jpg",
  //   coverPicture: "https://betty.com/cover.jpg",
  //   dateOfBirth: new Date("1996-09-23"),
  // });

  // const Post1 = await Post.create({
  //   id: "1",
  //   content: "I am strongest.",
  //   type: "post",
  //   postedAt: new Date(),
  //   userId: user1.id,
  //   isRepost: false,
  //   createdAt: new Date(),
  // });

  // const Post2 = await Post.create({
  //   id: "2",
  //   content: "I am beautiful.",
  //   type: "post",
  //   postedAt: new Date(),
  //   userId: user2.id,
  //   isRepost: false,
  //   createdAt: new Date(),
  // });

  // const Follow = await UserFollow.create({
  //   id: "1",
  //   followerId: user1.id,
  //   followedId: user2.id,
  //   followedAt: new Date(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // });

  // const Like = await PostLike.create({
  //   id: "1",
  //   userId: user1.id,
  //   postId: Post1.id,
  //   likedAt: new Date(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // });
}

createModels();
