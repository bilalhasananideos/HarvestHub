export const serialize = (obj: any | {}) => {
	var str = [];
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
	return str.join('&');
};

export function capitalize(str: string) {
	console.log(typeof str);
	return typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}