function whitch_localtion(Data) {
    return new Promise((resolve, reject) => {
        let point = [];
        let distances = [];
        let val_json = {};
        for (key in Data) {
            // console.log(key);
            var num = parseFloat(Data[key]);
            distances.push(num);
            switch (key) {
                case 'an1':
                    point.push(151, 99);
                    break
                case 'an2':
                    point.push(113, 63)
                    break
                case 'an3':
                    point.push(151, 26)
                    break
                case 'an4':
                    point.push(136, 0)
                    break
                case 'an9':
                    point.push(100, 7)
                    break
                case 'an10':
                    point.push(73, 7)
                    break
                case 'an15':
                    point.push(0, 14)
                    break
                case 'an20':
                    point.push(46, 14)
                    break
                case 'an21':
                    point.push(14, 7)
                    break
                case 'an22':
                    point.push(164, 1)
                    break
            }
        }
        val_json = { Data, point, distances };
        // console.log(val_json);
        distance(point[0], point[1], point[2], point[3], point[4], point[5],
            distances[0], distances[1], distances[2]).then((val) => {
                resolve(val)
            });
    })
}

//A座標(ax,ay),A距離：A
//B座標(bx,by),B距離：B
//C座標(cx,cy),C距離：C
function distance(ax, ay, bx, by, cx, cy, A, B, C) {
    var A = A * 100 - 200;
    var B = B * 100 - 200;
    var C = C * 100 - 200;
    return new Promise((resolve, reject) => {
        //換算距離
        ax = ax * 40;
        ay = ay * 40;
        bx = bx * 40;
        by = by * 40;
        cx = cx * 40;
        cy = cy * 40;
        // console.log(A, B, C);

        //公式
        var a1 = 2 * (bx - ax);
        var b1 = 2 * (by - ay);
        var c1 = Math.pow(A, 2) - Math.pow(B, 2) - Math.pow(ax, 2) - Math.pow(ay, 2) + Math.pow(bx, 2) + Math.pow(by, 2);
        var a2 = 2 * (bx - cx);
        var b2 = 2 * (by - cy);
        var c2 = Math.pow(C, 2) - Math.pow(B, 2) - Math.pow(cx, 2) - Math.pow(cy, 2) + Math.pow(bx, 2) + Math.pow(by, 2);
        fey(a1, b1, c1, a2, b2, c2, ax, ay, A).then((val) => {
            resolve(val)
        });
    })
}

//二元一次方程式解法
function fey(A1, B1, C1, A2, B2, C2, ax, ay, A) {
    return new Promise((resolve, reject) => {
        // console.log(A1, B1, C1, A2, B2, C2);
        var e = A1 * B2 - A2 * B1;
        if (e == 0) {
            if (B1 == B2 == 0) {
                console.log("y系数相同!");
                var x = Math.round(C1 / B1 / 40);
                var y = Math.pow(A, 2) - Math.pow((x - ax), 2)
                var y1 = (Math.abs(Math.sqrt(y)) + ay) / 40
                console.log("y = " + y1 + "\nx = " + x);
            } else {
                console.log("x系数相同!");
                var y = Math.round(C1 / B1 / 40);
                var x = Math.pow(A, 2) - Math.pow((y - ay), 2)
                var x1 = Math.abs(Math.sqrt(x))
                console.log("y = " + y + "\nx = " + x1);
            }
        } else {
            var Y = A1 * C2 - A2 * C1;
            var X = B2 * C1 - B1 * C2;
            var x1 = (C2 - Y / e * B2) / A2;
            var y = Math.round(Y / e / 40);
            var x = Math.round(X / e / 40);
            x1 = Math.round(x1 / 40);
            console.log("y = " + y + "\nx = " + x);
            resolve({ x: x, y: y })
        }
    })
}

module.exports.whitch_localtion = whitch_localtion;
