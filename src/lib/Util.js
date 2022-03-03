const dateFormat = (iso8601Date) => {
  const date = new Date(iso8601Date);

  return date.toLocaleTimeString(undefined, {
    timeZoneName: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export { dateFormat };
