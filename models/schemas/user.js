const bcrypt = require('bcryptjs');
const { Schema, SchemaTypes } = require('mongoose');

const SALT_FACTOR = 10;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      default: 'Guest',
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Email is required'],
      validate(value) {
        const re = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;
        return re.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 20,
    },
    avatar: {
      type: String,
    },
    googleId: {
      type: String,
    },
    books: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'book',
      },
    ],
    training: {
      type: SchemaTypes.ObjectId,
      ref: 'training',
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = bcrypt.genSaltSync(SALT_FACTOR);
  this.password = bcrypt.hashSync(this.password, salt, null);
  next();
});

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = userSchema;
