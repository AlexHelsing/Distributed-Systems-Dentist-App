export function setCookie(key: string, value: string) {
  document.cookie = key + '=' + value;
}

export function getCookie(key: string) {
  const value = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
  return value ? value.pop() : '';
}

export function deleteCookie(key: string) {
  document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
