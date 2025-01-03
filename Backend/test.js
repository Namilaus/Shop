const url = 'http://localhost:8000/google-api'

const data = {
	key: 'NaIus'
};

const getApiKey = async () => {
	try {
		const response = await fetch(url, {
			method : 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body : JSON.stringify(data)
		});
		const resData = await response.json();
		return resData;
	}
	catch(error){
		console.error("Error occured",error);
		throw error;
	}
};

getApiKey().then((res)=> {
	console.log(res);
});
