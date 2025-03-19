export const setCookie = (key: string, value: string, expires: string) => {
    document.cookie = `${key}=${value}; expires=${expires}; path=/;`;
};
