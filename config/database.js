const mongoose = require('mongoose');


let CONNECTION_STRING = ''
 
module.exports = async (app) => {
    try{
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database Connected!');
        
    }catch(err) {
        console.error(err.message);
        process.exit(1)
    }
}
