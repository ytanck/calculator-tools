var format = {
    truncate: function (num, decimal = 2) {
        var numStr = (num * 1.0).toFixed(decimal + 1);
        return parseFloat(numStr.substring(0, numStr.length - 1));
    }
}

export default {
    truncate: format.truncate
}