const port = 8000;
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();


const key = process.env.KEY;
const sendData = {apiKey: process.env.API_KEY}

app.use(express.json());
app.use(cors())

app.post('/google-api', (req, res) => {
	const gotData = req.body;
	if(req.method == 'POST' && gotData.key == key ){
	res.send(sendData);
}
	else{

	res.send("hoppala!!!");

}

});

app.listen(port, () => {
	console.log(`server is running on port ${port}`);
})
