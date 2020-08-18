export default (array: any[], key: string) => {
  const result = [[array[0]]];

  for (let i = 1; i < array.length; i++) {
    if (array[i][key] === array[i - 1][key]) {
      result[result.length - 1].push(array[i]);
    } else {
      result.push([array[i]]);
    }
  }

  return result;
};
