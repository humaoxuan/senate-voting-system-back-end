const argon2 = require('argon2')

let encrypt = password => {
    let hash = "";
    try {
        hash = argon2.hash(password);
    } catch (err) {
        console.log(err);
    }
    return hash;
}

let compare = async (password,hash) => {
    try {
        if (await argon2.verify(hash, password)) {
            // password match
            return true;
        } else {
            // password did not match
            return false;
        }
    } catch (err) {
        // internal failure
        console.log(err);
    }
}

module.exports.encrypt =encrypt;
module.exports.compare =compare;