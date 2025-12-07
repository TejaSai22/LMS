const bcrypt = require('bcrypt');

async function test() {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password', salt);
        console.log('Hash:', hash);
        const match = await bcrypt.compare('password', hash);
        console.log('Match:', match);
    } catch (err) {
        console.error('Bcrypt Error:', err);
    }
}

test();
