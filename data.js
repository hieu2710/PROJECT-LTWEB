var sql = require("mssql/msnodesqlv8");
function executeSQL(strSql,cb) {
    var config = {
        user: 'sa',
        password: '123456',
        server: 'DESKTOP-BC5C1UG\\TRANHIEU',
        database: 'WebBanLinhKien(2)',
        driver: "msnodesqlv8",
        options: {
            encrypt: false,
            trustedConnection: true,
        },
    };
    var connectSQL = new Promise((resolve,reject)=>{
        sql.connect(config, function(err,db){
            if(err) reject(err);
            var request = new sql.Request();
                resolve(request)
        });
    });
    connectSQL.then((request)=>{
        return new Promise((resolve, reject) =>{
            request.query(strSql, function(err, recordset){
                if (err) reject(err)
                resolve(recordset);
            });
        }).then((recordset)=>{
            cb(recordset);
        }).catch(err =>{
            console.log(err);
        })
    })
}
function executeSQLSync(strSql) {
    var config = {
        user: 'sa',
        password: '123456',
        server: 'DESKTOP-BC5C1UG\\TRANHIEU',
        database: 'WebBanLinhKien(2)',
        driver: "msnodesqlv8",
        options: {
            encrypt: false,
            trustedConnection: true,
        },
    };
  var connectSQL = new Promise((resolve,reject )=>{
      sql.connect(config, function(err,db){
          if (err) reject (err);
          var request = new sql.Request();
            request.query(strSql, function(err, recordset){
                if (err) reject (err)
                resolve(recordset);
            })
    })
  })
  return connectSQL;
}

module.exports = {
    executeSQL : executeSQL,
    executeSQLSync : executeSQLSync
}