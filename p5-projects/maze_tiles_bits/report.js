function report_1ofn() {
  if (!do_report) return;
  let bnum = 2n ** BigInt(a_now.length);
  let bstr = ' 0x' + bnum.toString(16).toUpperCase();
  let str = '1 of ' + bnum.toLocaleString('en-US') + bstr + '<br/> ';
  let div = createP('<code style="font-size:16px">' + str + '</code>');
  // div.style('margin-left:2px');
}

function div_report(arr, msg) {
  // console.log('div_report', msg);
  if (!do_report) return;
  if (!a_div) {
    a_div = createP();
  }
  let narr = arr.concat();
  narr.reverse();
  let str = narr.join('');
  let bnum = BigInt('0b' + str);
  // str = bnum.toLocaleString('en-US') + ' ' + msg + '<br/> ';
  let bstr;
  if (bnum >= 256n) {
    bstr = ' 0x' + bnum.toString(16).toUpperCase();
  } else {
    bstr = ' 0b' + bnum.toString(2);
  }
  // &nbsp;
  str = '' + bnum.toLocaleString('en-US') + bstr + '<br/> ';
  report_lines.unshift(str);
  while (report_lines.length > do_report) {
    report_lines.pop();
  }
  a_div.elt.innerHTML = '<code style="font-size:16px">' + report_lines.join('') + '</code>';
}
