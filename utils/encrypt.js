const bcrypt = require('bcrypt')
const config = require('../config/config.json')

// The greater the saltRounds value is the more difficult to hack
// but also spend more time to encrypt
// Defined in config.json
const saltRounds = process.env['NODE_ENV'] == null ?
    config['development']['saltRounds'] :
    config['production']['saltRounds'];

let encrypt = password => {
    return bcrypt.hashSync(password, saltRounds);
}

let compare = (password,hash) => {
    return !!bcrypt.compareSync(password, hash);
}

module.exports.encrypt =encrypt;
module.exports.compare =compare;