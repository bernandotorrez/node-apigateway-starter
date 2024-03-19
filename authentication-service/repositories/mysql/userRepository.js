const {
  User
} = require('../../models');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ConflictError = require('../../exceptions/ConflictError');

class UserRepository {
  constructor () {
    this._model = User;
  }

  async login ({
    username,
    password
  }) {
    const user = await this._model.findOne({
      where: {
        username
      }
    });

    if (!user || user == null) {
      throw new NotFoundError('Username not found');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new InvariantError('Username or Password is Incorrect');
    }

    return user;
  }

  async register ({
    username,
    password,
    level = 'User'
  }) {
    const user = await this._model.findOne({ where: { username } });
    if (user) {
      throw new ConflictError('Username already Exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this._model.create({
        uuid: uuidv4(),
        username,
        password: hashedPassword,
        level
      });

      return user;
    } catch (error) {
      throw new InvariantError('Failed Register User');
    }
  }

  async getUserByUsername ({
    username
  }) {
    return this._model.findOne({
      where: {
        username
      }
    });
  }
}

module.exports = new UserRepository();
