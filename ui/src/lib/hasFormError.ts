const hasFormError = (obj: {
  errors: { [k: string]: any };
  touched: { [k: string]: any };
}): boolean => {
  return Object.keys(obj.touched).some((name) => {
    return obj.touched[name] && obj.errors[name];
  });
};

export default hasFormError;
