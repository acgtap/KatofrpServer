import knex from 'knex';
const db = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    port : 3306,
    user : 'frps',
    password : 'frps',
    database : 'frps'
  }
});

// {
//   access_token: 'E9F55DF1648851CFCAAFB2C7EA1F1C5C',
//   code: 0,
//   faceimg: 'https://thirdqq.qlogo.cn/ek_qqapp/AQBcJqkcicrHkpialorkoHtp1CoibJNNg4Mlv6hHIADaxcYkXyEAokI9KqGjMsGW6efCsdwGlbSUfYYc9mU3xzthhuUa9NcmvlbFowWISD7U2pqXpA856jA1CJPKcsmUQ/100',
//   gender: '男',
//   ip: '113.249.165.105',
//   location: null,
//   msg: 'succ',
//   nickname: 'www.',
//   social_uid: '1A02475C9F940948E48D6FDB66F4836E',
//   type: 'qq',
//   isPro: false
// }
// db.schema.createTable('user', (table) => {
//   table.increments('id') //id自增
//   table.integer('code') //age 整数
//   table.string('faceimg')
//   table.string('gender')
//   table.string('ip')
//   table.string('location')
//   table.string('msg')
//   table.string('nickname')
//   table.string('social_uid')
//   table.string('type')
//   table.boolean('isPro') //isPro 布尔
//   table.string('access_token')
//   table.string('outtime')
//   table.timestamps(true,true) //创建时间和更新时间
// }).then(() => {
//   console.log('创建成功')
// })
export default db;