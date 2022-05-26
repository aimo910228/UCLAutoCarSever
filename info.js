function whitch_info(Data) {
    return new Promise((resolve, reject) => {
        let info = [];
        let distances = [];
        let val_json = {};
        for (key in Data) {
            // console.log(key);
            var num = parseFloat(Data[key]);
            distances.push(num);
            switch (key) {
                case 'an1':
                    info.push('151, 99');
                    break
                case 'an2':
                    info.push('113, 63')
                    break
                case 'bettery':
                    info.push('151, 26')
                    break
                case 'an4':
                    info.push('136, 0')
                    break
                case 'an9':
                    info.push('100, 7')
                    break
                case 'an10':
                    info.push('73, 7')
                    break
                case 'an15':
                    info.push('0, 14')
                    break
                case 'an20':
                    info.push('46, 14')
                    break
                case 'ans21':
                    info.push('14, 7')
                    break
                case 'ans22':
                    info.push('164,1')
                    break
            }
        }
        val_json = { Data, info, distances };
        // console.log(val_json);
        resolve(val_json);
        // dealWithInfo().then((val) => {
        //     resolve(val);
        // });
    })
}

module.exports.whitch_info = whitch_info;
