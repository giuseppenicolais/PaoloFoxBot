var UserService = function(){

    const UserDao = require('../model/user');

    var _insertUser = function(user){
         UserDao.upsert(user, (doc) => {
                console.log('user registered %j ', user)
            }, (err) => {
                console.error('Error during inserting the user: ' + err)
            })
    }

	return {
        insertUser: _insertUser
    }
}()

module.exports = UserService;