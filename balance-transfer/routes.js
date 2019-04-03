var express = require('express'),
	app = express.Router()
const multer = require('multer');
var ext
var path = require('path')
var fs = require('fs')
let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		var dir = 'uploads/' + file.originalname;
		ext = path.extname(file.originalname);

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir)
			mkdirp(dir + '/.version', function (err) {
				if (err) console.error(err)
				else {
					console.log('pow!')
					fs.writeFile(dir + '/.version/' + 'latestVersion.json', "", (err) => {
						if (!err) {
							console.log('done');
						}
					});

				}
			});
		}
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now().toString() + ext);
	}
});
let upload = multer({
	storage: storage
});
var Request = require('request')
var h
var mkdirp = require('mkdirp');


const md5File = require('md5-file/promise')
app.post('/upload', upload.single('file'), function (req, res) {
	if (!req.file) {
		console.log("No file received");
		return res.send({
			success: false
		});

	} else {
		hashfile(req)
	}
});

function hashfile(req) {
	md5File(req.file.path).then(hashres => {
		h = hashres
		var uploadedFile = req.file;
		const stats = fs.statSync('uploads/' + req.file.originalname + '/.version/' + 'latestVersion.json')
		const fileSizeInBytes = stats.size
		if (fileSizeInBytes === 0) {
			// file is uploaded for the firstTime
			uploadedFile["hash"] = h;
			uploadedFile["version"] = 1
			uploadedFile["author"] = req.username;
			fs.writeFileSync('uploads/' + req.file.originalname + '/.version/' + 'latestVersion.json', JSON.stringify(uploadedFile), 'utf-8');
			uploadDocument(uploadedFile, h, req.headers.authorization);
		} else {
			var read = fs.readFileSync('uploads/' + req.file.originalname + '/.version/' + 'latestVersion.json', 'utf8');
			var currentVersion = JSON.parse(read)
			if (h === currentVersion.hash) {
				//same file is uploaded
				fs.unlinkSync('uploads/' + req.file.originalname + '/' + req.file.filename)
			} else {
				currentVersion["path"] = req.file.path
				currentVersion["filename"] = req.file.filename
				currentVersion["hash"] = h;
				currentVersion["version"] = currentVersion.version + 1
				currentVersion["author"] = req.username;
				fs.writeFileSync('uploads/' + req.file.originalname + '/.version/' + 'latestVersion.json', JSON.stringify(currentVersion), 'utf-8');
				uploadDocument(currentVersion, h, req.headers.authorization);
			}
		}
	})
}
var growl = require('growl')

function uploadDocument(req, hash, header) {
	var uploadedby = req["author"]
	var timestamp = Date.now().toString()

	Request.post({
		"headers": {
			"authorization": header,
			"content-type": "application/json"
		},
		//json: true,
		"url": "http://localhost:4000/channels/mychannel/chaincodes/mycc",
		"body": JSON.stringify({
			"peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
			"fcn": "upload",
			"args": [
				req["filename"],
				timestamp,
				uploadedby,
				hash,
				req["mimetype"],
				req["path"],
				req["originalname"],
				req["version"].toString()
			]


		})
	}, (error, response, body) => {
		if (body) {

			console.log(` body from request ${body}`)
			var body_ = JSON.stringify(body, null, 4);
			var x = JSON.parse(body_)
			console.log(x)
			growl(x)

		}

		if (error) {
			console.log(`Error:${error}`);
		}
	});
}

var allDocumentsData
// display all the file in download list
app.post('/alldocuments', async (req, res) => {

	console.log(req.body)

	Request.post({
		"headers": {
			"authorization": req.headers.authorization,
			"content-type": "application/json"
		},
		"url": "http://localhost:4000/channels/mychannel/chaincodes/mycc",
		"body": JSON.stringify(req.body)
	}, (error, response, body) => {
		if (body) {
			var body_ = JSON.stringify(body, null, 4);
			var x = JSON.parse(body_)
			growl(x)
			var p = JSON.parse(x);
			allDocumentsData = p.data;
			res.send(p.data)
		}

		if (error) {
			console.log(`Error in /api/alldocuments:${error}`);
		}
	});

})


//invokes the chaincode and get the file path
app.get('/downloadfile', async (req, res) => {
	//downloadfile(req, res)
	downloadfileverifyhash(req, res)
})


function downloadfileverifyhash(req, res) {
	var reqestedFileHash
	md5File(req.query.path).then(hashres => {
		console.log(hashres)
		reqestedFileHash = hashres;
		
		Request.post({
			"headers": {
				"authorization": req.headers.authorization,
				"content-type": "application/json"
			},
			//json: true,
			"url": "http://localhost:4000/channels/mychannel/chaincodes/mycc",
			"body": JSON.stringify({
				"peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
				"fcn": "getHistoryForDocumnent",
				"args": [
					req.query.Key
				]
	
	
			})
		}, (error, response, body) => {
			if (body) {
				var x = JSON.parse(body)
				console.log(x["data"])
				for (i=0;i<Object.keys(x.data).length;i++)
				{
					console.log(x["data"][i].hash)
					if (reqestedFileHash===x["data"][i].hash ){
						console.log(`hash matched  ${reqestedFileHash}` )
						res.sendFile(x["data"][i].path,{ root: __dirname })
					}
					else {
						
					
					}
				}
	
			}
	
			if (error) {
				console.log(`Error:${error}`);
			}
		});
	
	});

	
	

}
module.exports = app