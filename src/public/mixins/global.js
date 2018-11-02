export default {
  methods: {
    /**
     * 日期格式化
     * @param input 输入的值
     * @param format 格式
     * @returns {string}
     */
    _dateFormat(_value, _format) {
      if (!_value) return _value;
      let value = _value;
      if (Object.prototype.toString.call(value) !== '[object Date]') {
        value = value.replace(/-/g, '/');
      }
      if (!isNaN(value)) {
        value = parseInt(value);
      }
      value = new Date(value);
      let format = _format || 'yyyy-MM-dd hh:mm:ss';
      let args = {
        'M+': value.getMonth() + 1,
        'd+': value.getDate(),
        'h+': value.getHours(),
        'm+': value.getMinutes(),
        's+': value.getSeconds(),
        'q+': Math.floor((value.getMonth() + 3) / 3), // quarter
        S: value.getMilliseconds()
      };
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (String(value.getFullYear())).substr(4 - RegExp.$1.length));
      for (let i in args) {
        if (args.hasOwnProperty(i)) {
          let n = args[i];
          if (new RegExp('(' + i + ')').test(format)) format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? n : ('00' + n).substr((String(n)).length));
        }
      }
      return format;
    },
    /**
     * 格式化数字
     * @param number    传进来的数字
     * @param places    保留的小数点位数，默认为2位
     * @param symbol    货币称号，默认为人民币
     * @param thousand  千位符
     * @param decimal   小数点
     * @param return
     */
    _currency(_number, _places, symbol = '$', thousand = ',', decimal = '.') {
      let number = _number || 0;
      let places = !isNaN(Math.abs(_places)) ? _places : 2;
      let negative = number < 0 ? '-' : '';
      let i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(places), 10));
      let j = i.length;

      j = j > 3 ? j % 3 : 0;
      return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '');
    },
    /**
     * 加法计算
     * @param a
     * @param b
     * @returns {number}
     */
    add(a, b) {
      var c, d, e;
      try {
        c = a.toString().split('.')[1].length;
      } catch (f) {
        c = 0;
      }
      try {
        d = b.toString().split('.')[1].length;
      } catch (f) {
        d = 0;
      }
      e = Math.pow(10, Math.max(c, d));
      return (this.mul(a, e) + this.mul(b, e)) / e;
    },
    /**
     * 乘法计算
     * @param a
     * @param b
     * @returns {number}
     */
    mul(a, b) {
      let c = 0;
      let d = a.toString();
      let e = b.toString();
      try {
        c += d.split('.')[1].length;
      } catch (f) {
      }
      try {
        c += e.split('.')[1].length;
      } catch (f) {
      }
      return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
    },
    /**
     * 减法计算
     * @param a
     * @param b
     * @returns {number}
     */
    sub(a, b) {
      var c, d, e;
      try {
        c = a.toString().split('.')[1].length;
      } catch (f) {
        c = 0;
      }
      try {
        d = b.toString().split('.')[1].length;
      } catch (f) {
        d = 0;
      }
      e = Math.pow(10, Math.max(c, d));
      return (this.mul(a, e) - this.mul(b, e)) / e;
    },
    /**
     * 除法计算
     * @param a
     * @param b
     * @returns {*|number}
     */
    division(a, b) {
      let c;
      let d;
      let e = 0;
      let f = 0;
      try {
        e = a.toString().split('.')[1].length;
      } catch (g) {
      }
      try {
        f = b.toString().split('.')[1].length;
      } catch (g) {
      }
      c = Number(a.toString().replace('.', ''));
      d = Number(b.toString().replace('.', ''));
      return this.mul(c / d, Math.pow(10, f - e));
    }
  }
};
