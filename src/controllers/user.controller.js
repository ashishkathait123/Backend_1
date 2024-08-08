import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.1.js";
import { User } from "../models/user.model.js";
import { uploadonCloudnary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateRefreshToken();
    const refreshToken = user.generateAccessToken();
    user.refreshToken = refreshToken; // for save the token in the database
    await user.save({ validateBeforeSave: false }); // here we used "validateBeforeSave" for avoid the required fields like uesername etc
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      console.log(
        "something went wrong while generating AccessToken or RefreshToken "
      )
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  //validation - not empty
  // check if user already exists : username , email
  // check for images, check for avtar
  //upload them to cloudnary , avtar
  //create user object - create entry in db
  //remove password and refresh token field from reponse
  //check for user creation
  //return response

  const { FullName, password, email, username } = req.body;
  if (
    [FullName, password, email, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, console.log("all fields are required"));
  }
  const exsistedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (exsistedUser) {
    throw new ApiError(409, console.log("User name or email already exist"));
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  // let coverImageLocalPath;

  // if(req.files && Array.isArray(req.files.coverImage)&& req.files.converImage.length >0){
  //     coverImageLocalPath = req.files.converImage[0].pat
  // }

  if (!avatarLocalPath) {
    throw new ApiError(403, console.log("Avatar image is required"));
  }
  const avatar = await uploadonCloudnary(avatarLocalPath);
  const coverImage = await uploadonCloudnary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, console.log("avatar file is required"));
  }
  const user = await User.create({
    FullName,
    avatar: avatar.url,
    converImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(
      500,
      console.log("Something went wrong while registering the user")
    );
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdUser,
        console.log("User registered successfully")
      )
    );
});

//Login ------------------->
// req body -> data
// username or email
// find user
// password check
// access and refresh token
// send cookie

const loginUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  if (!(email || username)) {
    throw new ApiError(400, console.log("user name or email is required"));
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, console.log(" user does not exsist"));
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(402, console.log(" user's invalid credintials"));
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

//logout ---->
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export { registerUser, logoutUser, loginUser };
