import { check,validationResult } from "express-validator";


export const registerUserValidator = [
  check("name", "Name is empty").not().isEmpty(),
  check("lastName", "Last name is empty").not().isEmpty(),
  check("userName", "Username is empty").not().isEmpty(),
  check("email", "E-mail is empty").isEmail(),
  check(
    "password",
    "Passwords needs to contain 6 letters and less than 12"
  ).isLength({ min: 6, max: 12 }),
];
export const loginUserValidator = [
  check("email", "E-mail is empty").isEmail(),
  check(
    "password",
    "Passwords needs to contain 6 letters and less than 12"
  ).isLength({ min: 6 }),
];

export const searchUserByUsernameValidator = [
  check("userNameFromSearch", "Search is empty").not().isEmpty(),
];

export const changeUserDataValidator = [
  check("changeUserData", "Input is empty").not().isEmpty(),
];

export const checkActualPasswordValidator = [
  check(
    "passwordToCheck",
    "Password has to be 6 letter and below 12"
  ).isLength({ min: 6, max: 12 }),
];

export const changeUserPasswordValidator = [
  check(
    "newPassword",
    "New password should be 6 letter and below 12"
  ).isLength({ min: 6, max: 12 }),
];

export const createPostValidator = [
  check("textOfThePost", "Text is required").not().isEmpty(),
];

export const searchForPostValidator = [
  check("searchInput", "Search is empty").not().isEmpty(),
];

export const addCommentValidator = [
  check("textOfTheComment", "Text is empty").not().isEmpty(),
];

export const postSchemahandlesError = function (req, res, next) {
    var errors = express-validator.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    }
    else
        next();
};
