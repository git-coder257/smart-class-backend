var compressjs = require('compressjs');

class compress {
    constructor (hello){
        this.text = ""

        this.separate_with = '~';
        this.encodable = this.get_map('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.');
        this.base10 = this.get_map('0123456789')

        this.algorithm = compressjs.Lzp3
    }

    handlecompress = (text) => {
        let data = new Buffer.from(text, "utf8")

        let compressedData = this.algorithm.compressFile(data)

        return this.encodeNums(compressedData)
    }

    handledecompress = (decompressedDataParams) => {
        let decompressedData = this.decodeNums(decompressedDataParams)

        var decompressed = this.algorithm.decompressFile(decompressedData);

        var data = new Buffer.from(decompressed).toString('utf8');

        return data
    }

    get_map(s) {
        let d = {}
        for (var i=0; i<s.length; i++) {
            d[s.charAt(i)] = i}
        d.length = s.length
        d._s = s
        return d
    }
    
    baseconvert(number, fromdigits, todigits) {
        var number = String(number)
        
        let neg

        if (number.charAt(0) == '-') {
            number = number.slice(1, number.length)
            neg=1}
        else {
            neg=0}
    
        var x = 0
        for (var i=0; i<number.length; i++) {
            var digit = number.charAt(i)
            x = x*fromdigits.length + fromdigits[digit]
        }
    
        let res = ""
        while (x>0) {
            let remainder = x % todigits.length
            res = todigits._s.charAt(remainder) + res
            x = parseInt(x/todigits.length)
        }
    
        if (neg) res = "-"+res
        return res
    }
    
    encodeNums(L) {
        var r = []
        for (var i=0; i<L.length; i++) {
             r.push(this.baseconvert(L[i], this.base10, this.encodable))
        }
        return r.join(this.separate_with)
    }
    
    decodeNums(s) {
        var r = []
        var s = s.split(this.separate_with)
        for (var i=0; i<s.length; i++) {
             r.push(parseInt(this.baseconvert(s[i], this.encodable, this.base10)))
        }
        return r
    }
}

module.exports = {compress: compress}
// let compressInstance = new compress()

// let compressedData = compressInstance.handlecompress(text)

// let decompressedData = compressInstance.handledecompress(compressedData)