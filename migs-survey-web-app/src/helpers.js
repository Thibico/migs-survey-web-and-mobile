
export const make2digit = (num) => {
  if (num >= 10) 
    return num.toString();
  else
    return "0" + num.toString();
}