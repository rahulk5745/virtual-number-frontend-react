import Cookies from 'js-cookie';
const checkStatus = response => {
	if (response.ok) {

		if (response.status == 200) {
			return response.json();
		} else {
			return { error: 'No data found' };
		}
		//return response;
	} else {
		// Incase token expired

		if (response.status == '401') {
			return response.json().then(res => {
				if (res.message === 'Token Not Valid.' || res.message === 'Token Expired') {
					console.log('Token Not Valid/Expired.')
					Cookies.set('userId', '');
					Cookies.set('token', '');
					//window.location.reload();
					window.location.href = "/";
					return;

				} else {
					// console.log(res);
					return res;
				}

			}
			);

		} else {

			if (response.statusText !== '') {
				let errorText = '';
				if (response.statusText !== '') {
					errorText = response.statusText;
				} else {	
					errorText = response.error;
				}
				const error = new Error(errorText);
				error.response = response;
				throw error;

			} else {
				throw JSON.stringify(response.json());
				// return response.json();
			}
		}


	}
};

// const parseJSON = res => res.json();

const Fetcher = {
	get: (path, params) => {

		const token = Cookies.get('token');
		if (typeof params == 'undefined' || params === '') {
			params = {};
		}
		if (typeof token !== 'undefined') {
			params.headers = { 'Authorization': 'Bearer ' + token }
		}

		return fetch(path, params)
			.then(checkStatus)
		//.then( parseJSON )

	},

	post: (path, params) => {

		const token = Cookies.get('token');
		if (typeof params === 'undefined' || params === '') {
			params = {};
		}
		if (typeof params.headers == 'undefined') {
			params.headers = {};
		}

		// check for login request
		if (typeof params.headers.Authorization === 'undefined' && typeof token !== 'undefined') {
			params.headers['Authorization'] = 'Bearer ' + token;
		}

		return fetch(path, params)
			.then(checkStatus)
		//.then( parseJSON )
	},

};

export { Fetcher };