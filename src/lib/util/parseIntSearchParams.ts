export const parseIntSearchParams = (url: URL, name: string) => {
  const value = url.searchParams.get(name);
  return value ? Number.parseInt(value, 10) : undefined;
};
