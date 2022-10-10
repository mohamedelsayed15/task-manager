const bcrypt = require('bcryptjs')
async function fun() {
    const password = 'red'
    const hashed = await bcrypt.hash(password, 8)
    const ismatch = await bcrypt.compare("red",hashed)
    console.log(ismatch)
    console.log(hashed)
    
}

fun()