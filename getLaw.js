const http = require('http');
const url = require('url');

function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return Math.floor(Math.random() * arguments[0] + 1);     //返回0-max的随机整数
        case 2:
            var min = arguments[0],
                max = arguments[1];
            if (arguments[0] - arguments[1] > 0) {
                min = arguments[1];
                max = arguments[0];
            }
            return Math.floor(Math.random() * (max - min + 1) + min);      //返回min-max的随机整数
        default:
            return 0;
    }
}

function getLaw() {
    let law = require('./CivilLaw.json');
    let bian = Object.keys(law)[randomNum(0, 6)];
    let zhang1 = Object.keys(law[bian]);
    let zhang = zhang1[randomNum(0, zhang1.length - 1)]
    let tiao = law[bian][zhang];
    let res = law[bian][zhang][randomNum(0, Object.keys(tiao).length)]
    while (!res) {
        res = law[bian][zhang][randomNum(0, Object.keys(tiao).length)];
    }
    return "《民法典》" + bian + " —— " + zhang + ":\n" + res
}

function getLaw1() {
    let law = require('./xingfa.json');
    let bian = Object.keys(law)[randomNum(0, 1)];
    let zhang1 = Object.keys(law[bian]);
    let zhang = zhang1[randomNum(0, zhang1.length - 1)]
    let tiao = law[bian][zhang];
    let res = law[bian][zhang][randomNum(0, Object.keys(tiao).length)]
    while (!res) {
        res = law[bian][zhang][randomNum(0, Object.keys(tiao).length)];
    }
    return "《刑法》" + bian + " —— " + zhang + ":\n" + res
}

// 创建createServer方法用于接受http客户端请求及返回响应的http服务器程序
http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
    let query = url.parse(req.url, true);
    if (query.query.search) {
        let q = query.query.search.split("-");
        if (q[0] === "刑法") {
            let law = require('./xingfaTiao.json');
            law.forEach(i => {
                if (i.match(q[1])) {
                    res.write(i + "\n——————————————\n");
                }
            })
            res.end()
        } else if (q[0] === "民法典") {
            let law = require('./CivilLawTiao.json');
            law.forEach(i => {
                if (i.match(q[1])) {
                    res.write(i + "\n——————————————\n");
                }
            })
            res.end()
        } else {
            res.end("无效参数")
        }
    } else {
        if (randomNum(0, 1)) {
            let res1 = getLaw();
            while (!res1) {
                res1 = getLaw();
            }
            if (res1) {
                res.end(res1);
            }
        } else {
            let res1 = getLaw1();
            while (!res1) {
                res1 = getLaw1();
            }
            if (res1) {
                res.end(res1);
            }
        }
    }
}).listen(8886);