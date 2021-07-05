function romanToInt(str) {
    if(str == null) return -1;
    let num = charToInt(str.charAt(0));
    for(let i = 1; i < str.length; i++) {
        let curr = charToInt(str.charAt(i));
        let pre = charToInt(str.charAt(i-1));
        if(curr <= pre){
            num += curr;
        } else {
            num = num - pre*2 + curr;
        }
    }
    return num;
}

function charToInt(char) {
    switch(char) {
        case 'I': return 1;
        case 'V': return 5;
        case 'X': return 10;
        default: return -1;
    }
}

module.exports = {
    romanToInt: romanToInt
}