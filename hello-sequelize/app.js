const Sequelize = require('sequelize');
const config = require('./config');

// 开始
console.log('Init sequelize...');

// 创建一个sequelize对象实例:
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

// 定义模型pet, 告诉sequelize如何映射数据库表:
var Pet = sequelize.define('pets', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    gender: Sequelize.BOOLEAN,
    birth: Sequelize.STRING(10),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
    version: Sequelize.BIGINT
}, {
    timestamps: false
});

var now = Date.now();
// 方法一：用Promise对象方式操作Gaffey:
// 添加数据:
// INSERT INTO pets VALUES (concat('g-',unix_timestamp()),'Gaffey',false,'2007-07-07',unix_timestamp(),unix_timestamp(),0);
Pet.create({
    id: 'g-' + now,
    name: 'Gaffey',
    gender: false,
    birth: '2007-07-07',
    createdAt: now,
    updatedAt: now,
    version: 0
}).then(function (p) { // 添加数据完成后:
    console.log('*** Inserted: ' + JSON.stringify(p));
    // 查询数据:
    // SELECT * FROM pets WHERE name='Gaffey';
    Pet.findAll({
        where: {
            name: 'Gaffey'
        }
    }).then(function (pets) { // 查询操作完成后:
        console.log(`*** ${pets.length} pets selected.`);
        for (let p of pets) {
            console.log(JSON.stringify(p));
            // 更新数据:
            // UPDATE pets SET gender=NOT gender,updatedAt=unix_timestamp()+1,version=version+1 WHERE name='Gaffey';
            p.gender = ! p.gender;
            p.updatedAt = Date.now();
            p.version ++;
            p.save().then(function () { // 更新操作完成后:
                console.log(`*** Pet ${p.name} updated.`);
                // 删除数据:
                // DELETE FROM pets WHERE name='Gaffey' AND version=3;
                if (p.version == 3) {
                    p.destroy().then(function () { // 删除操作完成后:
                        console.log(`*** Pet ${p.name} deleted.`);
                    });
                }
            });
        }
    });
}).catch(function (err) {
    console.log('*** Insert failed: ' + err);
});

// 方法二：用ES7的async/await方式操作Odie:
(async () => {
    // 添加数据:
    // INSERT INTO pets VALUES (concat('d-',unix_timestamp()),'Odie',false,'2008-08-08',unix_timestamp(),unix_timestamp(),0);
    var dog = await Pet.create({
        id: 'd-' + now,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
        createdAt: now,
        updatedAt: now,
        version: 0
    });
    console.log('*** Inserted: ' + JSON.stringify(dog));
    // 查询数据:
    // SELECT * FROM pets WHERE name='Odie';
    var pets = await Pet.findAll({
        where: {
            name: 'Odie'
        }
    });
    console.log(`*** ${pets.length} pets selected.`);
    for (let p of pets) {
        console.log(JSON.stringify(p));
        // 更新数据:
        // UPDATE pets SET gender=NOT gender,updatedAt=unix_timestamp()+1,version=version+1 WHERE name='Odie';
        p.gender = ! p.gender;
        p.updatedAt = Date.now();
        p.version ++;
        await p.save();
        console.log(`*** Pet ${p.name} updated.`);
        // 删除数据:
        // DELETE FROM pets WHERE name='Odie' AND version=3;
        if (p.version === 3) {
            await p.destroy();
            console.log(`*** Pet ${p.name} deleted.`);
        }
    }
})();