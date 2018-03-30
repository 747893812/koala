var MAX_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var dateOptions = {
  DAY_SHORT_NAMES: ['日', '一', '二', '三', '四', '五', '六']
};

function isLeapMonth(year, month) {
  return month === 1 && (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0);
}

//examples: getMaxDaysOfMonth(2017, 7) => 31
function getMaxDaysOfMonth(year, month) {
  return isLeapMonth(year, month) ? 29 : MAX_DAYS[month];
}

//example: formatDate(date, 'yyyy-MM-dd hh:mm:ss.SSS');
function formatDate(date, format) {
  format = format || 'yyyy-MM-dd';
  var y = date.getFullYear();
  var o = {
    'M+': date.getMonth() + 1, //月
    'd+': date.getDate(), //日
    'h+': date.getHours(), //时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'S+': date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, ('' + y).substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      var v = void 0;
      if (RegExp.$1.length === 2) {
        v = ('00' + o[k]).substr(('' + o[k]).length);
      } else if (RegExp.$1.length === 3) {
        v = ('000' + o[k]).substr(('' + o[k]).length);
      } else v = o[k];
      format = format.replace(RegExp.$1, v);
    }
  }
  return format;
}

function convertPlainDate(date) {
  if (typeof date === 'string') {
    date = new Date(Date.parse(date.replace(/-/g, '/')));
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    day: dateOptions.DAY_SHORT_NAMES[date.getDay()]
  };
}

var DAY_NAMES = dateOptions.DAY_SHORT_NAMES;

function fillDayRows(year, month, rows) {
  //初始化空的月历数组
  if (!rows.length) {
    for (var i = 0; i < 6; i++) {
      var row = [];
      for (var j = 0; j < 7; j++) {
        row.push(null);
      }
      rows.push(row);
    }
  }
  //当月最大天数
  var maxDays = getMaxDaysOfMonth(year, month);
  //当月1日星期几
  var firstDay = new Date(year, month, 1).getDay();

  var n = 1;
  for (var _i = 0; _i < 6; _i++) {
    for (var _j = 0; _j < 7; _j++) {
      if ((_i !== 0 || _j >= firstDay) && n <= maxDays) {
        if (rows[_i].$set) {
          rows[_i].$set(_j, n);
        } else {
          rows[_i][_j] = n;
        }
        n++;
      } else {
        if (rows[_i].$set) {
          rows[_i].$set(_j, null);
        } else {
          rows[_i][_j] = null;
        }
      }
    }
  }
}

var Calendar = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "calendar" }, [_c('div', { staticClass: "calendar-header" }, [_c('span', [_vm._v(_vm._s(_vm.plainDate.year) + " 年")]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.plainDate.month + 1) + " 月 " + _vm._s(_vm.plainDate.date) + " 日， 星期" + _vm._s(_vm.plainDate.day))])]), _vm._v(" "), _c('div', { staticClass: "bar bar-menu bar-tab" }, [_c('a', { staticClass: "btn btn-link", on: { "click": function click($event) {
          _vm.go(-1, 0);
        } } }, [_vm._v("上一年")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "click": function click($event) {
          _vm.go(0, -1);
        } } }, [_vm._v("上一月")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "click": function click($event) {
          _vm.go(null);
        } } }, [_vm._v("本月")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "click": function click($event) {
          _vm.go(0, 1);
        } } }, [_vm._v("下一月")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "click": function click($event) {
          _vm.go(1, 0);
        } } }, [_vm._v("下一年")])]), _vm._v(" "), _c('table', { staticClass: "calendar-body" }, [_c('thead', _vm._l(_vm.dayNames, function (n, index) {
      return _c('th', { key: index }, [_vm._v(_vm._s(n))]);
    })), _vm._v(" "), _c('tbody', _vm._l(_vm.dayRows, function (row, index) {
      return _c('tr', { key: index }, _vm._l(row, function (date, idx) {
        return _c('td', { key: idx, on: { "click": function click($event) {
              _vm.selectCell(date, idx);
            } } }, [date === _vm.plainDate.date ? _c('a', { staticClass: "date-block active" }, [_vm._v(_vm._s(date))]) : date === _vm.plainToday.date && _vm.plainDate.year === _vm.plainToday.year && _vm.plainDate.month === _vm.plainToday.month ? _c('a', { staticClass: "date-block today" }, [_vm._v(_vm._s(date))]) : date ? _c('a', [_vm._v(_vm._s(date))]) : _vm._e()]);
      }));
    }))])]);
  }, staticRenderFns: [],
  props: ['dateValue'],
  computed: {
    dayNames: function dayNames() {
      return DAY_NAMES;
    }
  },
  data: function data() {
    var today = new Date();
    var plainToday = convertPlainDate(today);
    var plainDate = convertPlainDate(today);
    return {
      view: 'days',
      plainToday: plainToday,
      plainDate: plainDate,
      dayRows: []
    };
  },
  created: function created() {
    var d = this.dateValue;
    if (d) {
      this.plainDate = convertPlainDate(d);
    }
    this.resetCells();
  },

  methods: {
    resetCells: function resetCells() {
      fillDayRows(this.plainDate.year, this.plainDate.month, this.dayRows);
    },
    selectCell: function selectCell(date, idx) {
      if (date) {
        var pd = this.plainDate;
        pd.date = date;
        pd.day = DAY_NAMES[idx];
        this.$emit('datechange', new Date(pd.year, pd.month, pd.date));
      }
    },
    go: function go(diffY, diffM) {
      var y = void 0;
      var m = void 0;
      var pd = this.plainDate;
      if (diffY === null) {
        var pt = this.plainToday;
        y = pt.year;
        m = pt.month;
      } else {
        y = pd.year + diffY;
        m = pd.month + diffM;
      }
      var d = pd.date;
      if (m < 0) {
        y--;
        m = 11;
      } else if (m > 11) {
        y++;
        m = 0;
      }
      var max = getMaxDaysOfMonth(y, m);
      if (d > max) {
        d = max;
      }
      var date = new Date(y, m, d);
      this.plainDate = convertPlainDate(date);
      this.resetCells();
    }
  },
  watch: {
    dateValue: function dateValue(v) {
      this.plainDate = convertPlainDate(v);
      this.resetCells();
    }
  }
};

var calendarInput = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "input-group inset-icon dropdown-group" }, [_c('input', { attrs: { "type": "text", "dropdown-action": "toggle", "readonly": "readonly" }, domProps: { "value": _vm.date } }), _c('span', { staticClass: "input-icon icon icon-event" }), _vm._v(" "), _c('my-calendar', { staticClass: "dropdown", attrs: { "date-value": _vm.date }, on: { "datechange": _vm.dateChange } })], 1);
  }, staticRenderFns: [],
  props: ['value'],
  data: function data() {
    return {
      date: ''
    };
  },

  components: {
    'my-calendar': Calendar
  },
  methods: {
    dateChange: function dateChange(date) {
      this.date = formatDate(date);
      this.$emit('datechange', date);
    }
  },
  watch: {
    'value': function value(v) {
      if (v) {
        var pd = convertPlainDate(v);
        var d = new Date(pd.year, pd.month, pd.date);
        this.date = formatDate(d);
      }
    }
  },
  created: function created() {
    var v = this.value;
    if (v) {
      var pd = convertPlainDate(v);
      var d = new Date(pd.year, pd.month, pd.date);
      this.date = formatDate(d);
    }
  }
};

export default {
  Calendar,
  calendarInput
}
