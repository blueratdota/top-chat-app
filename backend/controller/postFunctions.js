import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GETTING POSTS
const getFriendsPosts = async (req, res, next) => {
  try {
    const sentRequests = await prisma.friendship.findMany({
      where: { requestingUserId: req.user.id, accepted: true },
      select: {
        acceptingUser: { select: { id: true } }
      }
    });
    const receivedRequests = await prisma.friendship.findMany({
      where: { acceptingUserId: req.user.id, accepted: true },
      select: {
        requestingUser: { select: { id: true } }
      }
    });
    const allFriendsIds = (() => {
      let arr = [];
      sentRequests.forEach((entry) => {
        arr.push(entry.acceptingUser.id);
      });
      receivedRequests.forEach((entry) => {
        arr.push(entry.requestingUser.id);
      });
      return arr;
    })();

    const friendsPosts = await prisma.posts.findMany({
      where: {
        OR: [{ authorId: { in: allFriendsIds } }, { authorId: req.user.id }]
      },
      include: {
        author: { select: { email: true, profile: true } },
        likedByUsers: { select: { email: true, profile: true } },
        comments: {
          select: {
            author: { select: { profile: true, email: true } },
            textContent: true,
            id: true,
            datePosted: true
          },
          orderBy: { datePosted: "asc" }
        }
      },
      orderBy: { datePosted: "desc" }
    });

    res.status(200).json(friendsPosts);
  } catch (error) {
    console.log(error);
  }
};
const getExplorePosts = async (req, res, next) => {
  try {
    const sentRequests = await prisma.friendship.findMany({
      where: { requestingUserId: req.user.id, accepted: true },
      select: {
        acceptingUser: { select: { id: true } }
      }
    });
    const receivedRequests = await prisma.friendship.findMany({
      where: { acceptingUserId: req.user.id, accepted: true },
      select: {
        requestingUser: { select: { id: true } }
      }
    });
    const allFriendsIds = (() => {
      let arr = [];
      sentRequests.forEach((entry) => {
        arr.push(entry.acceptingUser.id);
      });
      receivedRequests.forEach((entry) => {
        arr.push(entry.requestingUser.id);
      });
      return arr;
    })();

    const friendsPosts = await prisma.posts.findMany({
      where: {
        AND: [
          { authorId: { notIn: allFriendsIds } },
          { authorId: { not: req.user.id } }
        ]
      },
      include: {
        author: { select: { email: true, profile: true } },
        likedByUsers: { select: { email: true, profile: true } },
        comments: {
          select: {
            author: { select: { profile: true, email: true } },
            textContent: true,
            id: true,
            datePosted: true
          },
          orderBy: { datePosted: "asc" }
        }
      },
      orderBy: { datePosted: "desc" }
    });

    res.status(200).json(friendsPosts);
  } catch (error) {
    console.log(error);
  }
};
const getUserPosts = async (req, res, next) => {
  const id = req.params.id;
  try {
    const userData = await prisma.user.findUnique({
      where: { id: id },
      select: {
        posts: {
          include: {
            comments: {
              select: {
                author: { select: { profile: true, email: true } },
                textContent: true,
                id: true,
                datePosted: true
              },
              orderBy: { datePosted: "asc" }
            },
            likedByUsers: {
              select: { email: true, profile: true }
            },
            author: { select: { profile: true, email: true } }
          },
          orderBy: { datePosted: "desc" }
        }
      }
    });
    const result = {
      isSuccess: true,
      msg: "Post downloaded",
      data: userData,
      userId: id
    };
    res.status(200).json(result);
  } catch (error) {
    const result = new Error("User post data download failed");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

// CREATING POST
const createPost = async (req, res, next) => {
  try {
    const { textContent } = req.body;
    const fileData = (() => {
      if (req.file) {
        return {
          path: req.file.path,
          name: req.file.originalname,
          filename: req.file.filename,
          fileSize: req.file.size,
          authorId: req.user.id
        };
      } else return null;
    })();
    const post = await prisma.posts.create({
      data: {
        authorId: req.user.id,
        textContent: textContent,
        imageContent: fileData?.filename
      }
    });
    const result = {
      isSuccess: true,
      msg: "Post created",
      data: post
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    const result = new Error("Failed to create post");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

// LIKE A POST
const likePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const user = await prisma.user.findFirst({
      where: { id: req.user.id },
      select: { likedPosts: true }
    });
    console.log(user.likedPosts);

    if (
      user.likedPosts.some((post) => {
        return post.id == postId;
      })
    ) {
      const post = await prisma.user.update({
        where: { id: req.user.id },
        data: { likedPosts: { disconnect: { id: postId } } },
        select: { likedPosts: true }
      });
      const result = {
        isSuccess: true,
        msg: "Post disliked",
        data: post
      };
      res.status(200).json(result);
    } else {
      const post = await prisma.user.update({
        where: { id: req.user.id },
        data: { likedPosts: { connect: { id: postId } } },
        select: { likedPosts: true }
      });
      const result = {
        isSuccess: true,
        msg: "Post liked",
        data: post
      };
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    const result = new Error("Failed to like post");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

// POST A COMMENT ON A POST
const commentPost = async (req, res, next) => {
  try {
    const { postId, comment } = req.body;

    const post = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        comments: {
          create: { textContent: comment, postId: postId }
        }
      }
    });
    const result = {
      isSuccess: true,
      msg: "Comment posted",
      data: post
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    const result = new Error("Failed to post comment");
    result.status = 400;
    result.log = error;
    next(result);
  }
};

export {
  getFriendsPosts,
  getExplorePosts,
  getUserPosts,
  createPost,
  likePost,
  commentPost
};

// DO SOME PAGINATION ON GETTING ALL FRIENDS POSTS
