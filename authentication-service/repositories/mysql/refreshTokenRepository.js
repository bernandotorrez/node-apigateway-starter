const { RefreshToken } = require('../../models');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const BadRequestError = require('../../exceptions/BadRequestError');

class RefreshTokenRepository {
  constructor () {
    this._model = RefreshToken;
  }

  async addRefreshToken ({ token }) {
    const data = {
      token
    };

    try {
      return await this._model.create(data);
    } catch (error) {
      throw new InvariantError('Add Refresh Token Failed');
    }
  }

  async verifyRefreshToken ({ token }) {
    if (token === '' || token === undefined) {
      throw new BadRequestError('Refresh Token not Provided');
    }

    const refreshToken = await this._model.findOne({
      where: {
        token
      }
    });

    if (!refreshToken) {
      throw new AuthenticationError('Refresh Token not Valid');
    }

    return refreshToken;
  }

  async deleteRefreshToken ({ token }) {
    await this.verifyRefreshToken({ token });

    try {
      const deleteToken = await this._model.destroy({
        where: {
          token
        }
      });

      return deleteToken;
    } catch (error) {
      throw new InvariantError('Delete Refresh Token Failed');
    }
  }
}

module.exports = new RefreshTokenRepository();
