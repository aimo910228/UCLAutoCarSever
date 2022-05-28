function whitch_info(Data) {
    return new Promise((resolve, reject) => {
        let info = '';
        let distances = [];
        let val_json = {};
        switch (Data.battery) {
            case 'Electricity_A':
                info = '電量：0%~25%';
                break;
            case 'Electricity_B':
                info = '電量：25%~50%';
                break;
            case 'Electricity_C':
                info = '電量：50%~75%';
                break;
            case 'Electricity_D':
                info = '電量：75%~100%';
                break;
        }
        val_json = { Data, info, distances };
        resolve(info);
        // console.log(val_json);
    })
}

module.exports.whitch_info = whitch_info;
