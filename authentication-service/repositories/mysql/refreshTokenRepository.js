const { RefreshToken } = require('../../models');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class RefreshTokenRepository {
  constructor () {
    this._model = RefreshToken;
  }

  async addRefreshToken (token) {
    try {
      return await this._model.create({ token });
    } catch (error) {
      throw new InvariantError('Add Refresh Token Failed');
    }
  }

  async getRefreshToken (token) {
    if (token === '' || token === undefined) {
      throw new AuthenticationError('Refresh Token not Provided');
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

  async deleteRefreshToken (token) {
    await this.getRefreshToken(token);

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
