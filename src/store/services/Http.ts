import { store } from '..';
import { BASEURL } from '../../constants';
import { removeItem } from '../../utils/localStorage';
import { serialize } from '../../utils/utils';
import { resetUserState } from '../actions/UserActions';

const request = (
	method: 'get' | 'post' | 'put' | 'patch' | 'delete',
	endpoint: string,
	params: any = {},
	headers: any = {},
	formData: any = false
) => {
	const { token, device_id } = store.getState().userReducer;

	if (token) headers['Authorization'] = `Bearer ${token}`;
	if (device_id) headers['X-Device-ID'] = device_id;
	if (!formData) {
		headers['Content-Type'] = 'application/json';
	} else {
		headers['Content-Type'] = 'multipart/form-data';
	}

	let url: string = `${BASEURL}${endpoint}`;
	const config = {
		method,
		headers: {
			Accept: 'application/json',
			...headers,
		},
		body: params,
	};

	if (method === 'get') {
		if (Object.keys(params).length > 0) url = url.concat(`?${serialize(params)}`);
		delete config.body;
	}

	console.log(url, config);

	return fetch(url, config)
		.then((res) => res.json())
		// .then((res) => res)
		.then(async (res) => {
			if (res?.message === "Unauthenticated.") {
				console.log("User Unauthenticated → Logging out...");
	
				await removeItem('key');
				store.dispatch(resetUserState());
	
				return null;
			}			
	
			return res;
		})
		.catch((err) => {
			console.log('err', err);
			return err;
		});
};

export const get = (url: string, params = {}, headers: any = {}) => request('get', url, params, headers);

export const post = (url: string, params = {}, headers: any = {}, formData: any = false) => request('post', url, params, headers, formData);

export const deleting = (url: string, params = {}, headers: any = {}) => request('delete', url, params, headers);
