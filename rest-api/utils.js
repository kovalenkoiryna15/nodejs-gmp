export function getParsedUrl(url, host) {
  return new URL(url, `http://${host}`);
}

export function getPathList(url, host) {
  const { pathname } = getParsedUrl(url, host);

  return pathname.split('/');
}