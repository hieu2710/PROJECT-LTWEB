const sql = require('./data')
const bodyParser = require('body-parser');
var express = require('express');
var app = express();
const path = require('path');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    sql.executeSQL(`select * from SANPHAM `,(recordset)=> {
        var result = "";
        //console.log(recordset);
        recordset.recordsets[0].forEach(rows => {
            result +=  
            `    <div class="card body-similar-card products" style="width: 14.9rem;  margin-left: 1%; ">
                            <img  src='img/${rows['Hinh']}' class="card-img-top body-similar-cart-img" alt="...">
                            <div class="card-body">
                                <p class="card-text body-similar-cart-price">${rows['DonGia']}00.000₫</p>
                              <h5 class="card-title body-similar-cart-tittle">${rows['TenSP']}</h5>
                              <a href="/detail/${rows['MaSP']}"  class="btn body-similar-btn-detail">Xem chi tiết</a>
                              <a href="cart"  onclick="addtoCart_(${rows['MaSP']})" class="btn body-similar-btn-add"><i class="fas fa-shopping-cart"></i></a>

                              <a href="#" onclick="addtoWishlist(${rows['MaSP']})" class="btn body-similar-btn-like"><i class="far fa-heart"></i></a>
                            </div>
                        </div>`;
        });
        res.send(result);
    })
});


app.get('/cart',function(req,res){
    res.sendFile(__dirname+"/cart.html");
});




function shoppingCART(arrProductID,cb) {
    sql.executeSQL(`SELECT * FROM SANPHAM WHERE MaSP in ${arrProductID}`,  (recordset)=> {
        if(recordset.recordsets[0] == undefined || recordset.recordsets[0].length === 0){
            cb("Giỏ hàng trống");
        }    
        else{
            var result =  "";
            recordset.recordsets[0].forEach(rows => {
                result+=`<div class="products-cart clsproduct" productId="${rows['MaSP']}" price="${rows['DonGia']}">
                <img id="img" src='img/${rows['Hinh']}' style="height: 180px;width: 190px;" alt="">
                <div class="inf-image">
                    <p class="name-product" >${rows['TenSP']}</p>
                    <p class="price" style="color: #D10024; font-weight: 700;">${rows['DonGia']}00.000₫</p>
                    <input type="number" min="0" max="100" class="inp-quanity">
                </div>
                <div class="btn-close">
                    <a href="cart"><button class="close" onclick="DelProduct(${rows['MaSP']})"> <i class="fas fa-times icon-close"></i></button></a>
                </div>
            </div> `;

            })
        }
        cb(result);
    });
}

function WISHLIST(arrProductID,cb) {
    sql.executeSQL(`SELECT * FROM SANPHAM WHERE MaSP in ${arrProductID}`,  (recordset)=> {
        if(recordset.recordsets[0] == undefined || recordset.recordsets[0].length === 0){
            cb("WishLIST trống");
        }    
        else{
            var result =  "";
            recordset.recordsets[0].forEach(rows => {
                result+=`<div class="body-wish-product row">
                <div class="body-wish-product-if col-7">
                    <img style="    height: 180px;width: 190px;float: left;" src='img/${rows['Hinh']}' alt="">
                    <p class="body-wish-product-if-name">${rows['TenSP']}</p>
                    <a href="wish"><button class="body-wish-product-if-del" onclick="DelProductWish(${rows['MaSP']})">Xoá</button></a>
                </div>
                <div class="body-wish-product-add-cart col-5">
                    <div class="add-product">
                        <input class="add-product-inp" type="number" name="" id="" min="0" max="100">
                        <button class="add-product-btn" onclick="addtoCart_(${rows['MaSP']})">THÊM VÀO GIỎ HÀNG</button>                  
                    </div>
                </div>
            </div>`;

            })
        }
        cb(result);
    });
}


async function buy(MaKH,arrProduct){
    await sql.executeSQLSync(`insert into HOADON (MaKH,NgayLapHD) values ('${MaKH}',getdate())`); 
        var data = await sql.executeSQLSync(`select @@IDENTITYD as MaHD`); 
            console.log(data.recordsets[0][0])
            arrProduct.forEach(async item => {
                await sql.executeSQLSync(`insert into CTHOADON (MaHD,MaSP,SoLuong,DonGia)
                values('1','${item.MaSP}','${item.SoLuong}','${item.DonGia}')`);        
                })           
}
async function wish(MaKH,arrProduct){
    await sql.executeSQLSync(`insert into HOADON (MaKH,NgayLapHD) values ('${MaKH}',getdate())`); 
        var data = await sql.executeSQLSync(`select @@IDENTITYD as MaHD`); 
            console.log(data.recordsets[0][0])
            arrProduct.forEach(async item => {
                await sql.executeSQLSync(`insert into CTHOADON (MaHD,MaSP,SoLuong,DonGia)
                values('1','${item.MaSP}','${item.SoLuong}','${item.DonGia}')`);        
                })           
}

module.exports = {
    shoppingCART: shoppingCART,
    buy: buy,
    WISHLIST: WISHLIST,
    wish:wish,
}
app.post('/buy',async function(req, res){
    await shoppingCART(req.body.MaKH,req.body.arrProduct);
        res.send("thành công");
    });
app.post('/wish',async function(req, res){
        await WISHLIST(req.body.MaKH,req.body.arrProduct);
            res.send("thành công");
        });
 




app.post('/getCart',function(req, res){
    shoppingCART(req.body.arrProductID,(result) => {
        res.send(result);
    });
});  
app.post('/getWish',function(req, res){
    WISHLIST(req.body.arrProductID,(result) => {
        res.send(result);
    });
});

 


app.get('/tang', function (req, res){
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
    sql.connect(config, function(err,db){
        console.log(db);
        if (err) console.log(err);
   
        sql.executeSQL(`SELECT * FROM SANPHAM ORDER BY DonGia ASC `, function (err,recordset){
            if(err) console.log(err)
            var result = "";
            recordset.recordsets[0].forEach(rows => {
                result +=`    <div class="card body-similar-card" style="width: 14.9rem;  margin-left: 1%; ">
                           <img  src='img/${rows['Hinh']}' class="card-img-top body-similar-cart-img" alt="...">
                           <div class="card-body">
                               <p class="card-text body-similar-cart-price">${rows['DonGia']}00.000₫</p>
                             <h5 class="card-title body-similar-cart-tittle">${rows['TenSP']}</h5>
                             <a href="/detail/${rows['MaSP']}"  class="btn body-similar-btn-detail">Xem chi tiết</a>
                             <a href="#" class="btn body-similar-btn-add"><i class="fas fa-shopping-cart"></i></a>                     
                             <a href="#" class="btn body-similar-btn-like"><i class="far fa-heart"></i></a>
                           </div>
                       </div>`;
                    });
            res.send(result);

        });

    });

});
app.get('/giam', function (req, res){
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
    sql.connect(config, function(err,db){
        console.log(db);
        if (err) console.log(err);
        sql.executeSQL(`SELECT * FROM SANPHAM ORDER BY DonGia DESC `, function (err,recordset){
            if(err) console.log(err)

            var result = "";

            recordset.recordsets[0].forEach(rows => {
                result +=`    <div class="card body-similar-card" style="width: 14.9rem;  margin-left: 1%; ">
                           <img  src='img/${rows['Hinh']}' class="card-img-top body-similar-cart-img" alt="...">
                           <div class="card-body">
                               <p class="card-text body-similar-cart-price">${rows['DonGia']}00.000₫</p>
                             <h5 class="card-title body-similar-cart-tittle">${rows['TenSP']}</h5>
                             <a href="/detail/${rows['MaSP']}"  class="btn body-similar-btn-detail">Xem chi tiết</a>
                             <a href="#" class="btn body-similar-btn-add"><i class="fas fa-shopping-cart"></i></a>                     
                             <a href="#" class="btn body-similar-btn-like"><i class="far fa-heart"></i></a>
                           </div>
                       </div>`;
                    });
            res.send(result);

        });

    });

});

app.get('/getdetail/:id', function (req, res) {
    sql.executeSQL(`select * from SANPHAM where MaSP ='${req.params.id}'`, (recordset) => {
         var row = recordset.recordsets[0][0];
            res.send(row);
    });
});
app.get('/detail/:id',function(req,res){
    res.sendFile(__dirname+"/detail.html");
});
app.get('/index',function(req,res){
    res.sendFile(__dirname+"/index.html");
});
app.get('/laptop',function(req,res){
    res.sendFile(__dirname+"/laptop.html");
});
app.get('/maytinh',function(req,res){
    res.sendFile(__dirname+"/computer.html");
});
app.get('/linhkienpc',function(req,res){
    res.sendFile(__dirname+"/pc.html");
});
app.get('/manhinh',function(req,res){
    res.sendFile(__dirname+"/screen.html");
});
app.get('/banphimchuot',function(req,res){
    res.sendFile(__dirname+"/keymouse.html");
});
app.get('/tainghe',function(req,res){
    res.sendFile(__dirname+"/earphone.html");
});
app.get('/wish',function(req,res){
    res.sendFile(__dirname+"/wish.html");
});
// Link truy cap đăng nhập`
app.get('/dangnhap', (req,res)=>{
    res.sendFile(__dirname +"/dangnhap.html");
})
// Xử lý đăng nhập
function dangnhap(username,password,cb) {
    sql.executeSQL(`SELECT * FROM NGUOIDUNG WHERE EMAIL = '${username}' and MatKhau= '${password}' `, (recordset)=> {
            cb(recordset.recordset[0]);
    });
}
app.post('/getdangnhap', (req,res)=>{
    
    dangnhap(req.body.username,req.body.password, (user) =>{
        console.log("Đăng nhập thành công")
        res.send(user);
    })
});
app.get('/dangky', function (req,res){
    res.sendFile(__dirname +"/dangky.html");
})
//Xử lý đăng ký 
// function dangky(username,password,cb) {
//     sql.executeSQL(`INSERT INTO NGUOIDUNG(MatKhau,EMAIL) VALUES ('${password}','${username}' `,(recordset)=> {
    
//             cb(recordset.recordset);
//     });
// }

// app.post('/getdangky',function (req,res){   
//     dangky(req.body.username,req.body.password,(user) =>{
//         res.send(user);
//     })
// });

module.exports = {
    dangnhap : dangnhap ,
    
}


var server = app.listen(3009, function (){
    console.log('Server is running...');
});
 





