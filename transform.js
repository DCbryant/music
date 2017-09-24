function toTransform(test) {
    var toDisplay = ['零', '壹','贰','叁','肆','伍','陆','柒','捌','玖']
    var UNITS = ['','拾','佰','仟']
    var BIG_UNITS = ['', '万', '亿'];

    var length = test.toString().split("").length;
    var result = []

    for( var i = 0, j, unit, big; i < length; i++) {
        j = test % 10;
        big = i / 4 >> 0;
        unit = j > 0 ? UNITS[i % 4] : '';
        unit += i % 4 === 0 ? BIG_UNITS[big] : '';
        result.push([toDisplay[j], unit].join(''));
        test = test / 10 >> 0;
    }

    //result = result.reverse().join('');
    //result = result.replace(/零+/g, '零');
    //result = result.replace(/零+([万亿$])/, '$1');
    result = result.reverse();
    for (var i = 0, len = result.length, flag = false, first0; i < len; i++) {
        if (result[i].substr(0, 1) === '零') {
            first0 = flag ? first0 : i;
            if (flag) { // 前面有零了，置为空
                if (result[i].length > 1) {
                    result[i] = result[i].substr(1);
                    result[first0] = '';
                    flag = false;
                } else {
                    result[i] = '';
                }
            } else { // 前面还没零，第一个零
                flag = true;
            }
        } else { // 非零，取消标记
            flag = false;
        }
        if (flag && result[i].length > 1) {
            result[i] = result[i].substr(1);
            flag = false;
        }
    }
    if (flag) { // 最后一位是零
        result = result.filter(pos => !!pos)
        result.pop();
    }

    return result.join('');
}


console.log(toTransform(21123));
console.log(toTransform(1024));
console.log(toTransform(1004));
console.log(toTransform(1000));
console.log(1024 * 1024, toTransform(1024 * 1024));
console.log(toTransform(1008576));
console.log(toTransform(100000));