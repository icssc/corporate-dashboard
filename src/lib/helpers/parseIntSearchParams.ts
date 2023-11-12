const parseIntSearchParams = (url: URL, name: string) => {
  const value = url.searchParams.get(name);

  return value ? parseInt(value) : undefined;
};

export default parseIntSearchParams;
