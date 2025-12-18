// Utilities to parse timestamps and format them to India Standard Time (Asia/Kolkata)
export function parseToDate(input) {
  if (input === undefined || input === null) return new Date();
  if (typeof input === 'number') return new Date(input);
  if (!isNaN(Number(input))) {
    let n = Number(input);
    // If length <= 10 assume seconds
    if (String(input).length <= 10) n = n * 1000;
    return new Date(n);
  }
  const d = new Date(input);
  return isNaN(d.getTime()) ? new Date() : d;
}

// Return string DD-MM-YYYY HH:mm:ss IST
export function formatToIST(input) {
  const date = parseToDate(input);
  // Use Intl to format in Asia/Kolkata
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = fmt.formatToParts(date).reduce((acc, p) => { acc[p.type] = p.value; return acc }, {});
  const dd = parts.day;
  const mm = parts.month;
  const yyyy = parts.year;
  const hh = parts.hour;
  const min = parts.minute;
  const ss = parts.second;
  return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss} IST`;
}

// Return YYYY-MM-DD for comparing dates in IST
export function istDateYMD(input) {
  const date = parseToDate(input);
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' });
  return fmt.format(date); // yyyy-mm-dd
}
