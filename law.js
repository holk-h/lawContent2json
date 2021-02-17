const mammoth = require('mammoth');
let CivilLaw = {};
const fs = require('fs')

const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}


mammoth.extractRawText({path: "./minfadian.docx"})
    .then(function (result) {
        let text = result.value; // The raw text
        let RawLaws = text.split('\n');
        let laws = RawLaws.filter((i) => {
            return i !== '';
        })

        //小条款并入大条款
        laws.forEach((i, j) => {
            if (/^（.）.*/.test(i)) {
                laws[j] = laws[j - 1] + '\n' + laws[j];
                delete laws[j - 1];
            }
        })

        laws.forEach((i, j) => {
            if (!(/^（.）.*/.test(i)||/^第.{1,8}章/.test(i)||/^第.{1,8}节/.test(i)||/^第.{1,8}编/.test(i)||/^第.{1,8}条/.test(i))) {
                laws[j] = laws[j - 1] + '\n' + laws[j];
                delete laws[j - 1];
            }
        })

        //去除空元素
        let formatLaws = laws.filter((i) => {
            return i.length !== 0;
        })

        //编 章 节 条
        formatLaws.forEach((i, j) => {
            if (/^第.编/.test(i)) {
                CivilLaw[i] = {};
            }
        })
        let zhang = formatLaws.filter((i, j) => {
            return /^第.{1,4}章/.test(i)
        })
        let s = [];
        zhang.forEach((i, j) => {
            if (/^第一章/.test(zhang[j])) {
                s.push(j);
            }
        })
        s.forEach((i, j) => {
            zhang.splice(i + j, 0, "f")
        })
        let zhang1 = zhang.join().split("f")
        zhang1.shift();
        let zhangJie = [];
        zhang1.forEach((i) => {
            zhangJie.push(i.split(','))
        })
        zhangJie.forEach((i) => {
            i.shift();
            i.forEach((j, k) => {
                if (j === '') delete i[k]
            })
        })


        let keys = Object.keys(CivilLaw);
        keys.forEach((i, l) => {
            zhangJie.forEach((x, p) => {
                if (l == p) {
                    x.forEach((y) => {
                        CivilLaw[i][y] = {};
                    })
                }
            })
        })

        let tiao1 = formatLaws.filter((i)=>{
            return (/^第.{1,8}条/.test(i) || /^第.{1,4}章/.test(i))
        })
        tiao1.forEach((i,j)=>{
            if (/^第.{1,5}章/.test(i)){
                tiao1[j] = "lalalalala"
            }
        })
        let tiao2 = tiao1.join().split("lalalalala")
        tiao2.shift();
        tiao2.forEach((i,j)=>{
            if (/^,/.test(i)){
               tiao2[j] = tiao2[j].substr(1);
            }
        })

        let order = 0;
        keys.forEach((i, l) => {
            zhangJie.forEach((x, p) => {
                if (l == p) {
                    x.forEach((y,q) => {
                        CivilLaw[i][y] = tiao2[order].split(',');
                        CivilLaw[i][y].pop();
                        order++
                    })
                }
            })
        })

        let tiao3 = [];
        formatLaws.forEach((i)=>{
            if(/^第.{1,8}条/.test(i)){
                tiao3.push(i)
            }
        })
        console.log(tiao3)
        storeData(tiao3,'./CivilLawTiao.json')

    }).done();