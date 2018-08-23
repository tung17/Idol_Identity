var request = require('sync-request');
var idols = require('./filtered-idols');
var idolPerson = require('./idol-persons.json');
var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

let key ='f9733f324634462182c44b5b7c6726b2';

let groupId = 'vav-idols';

var result;

function detect(imageUrl)
{
	console.log(`Begin to detect face from imae:${imageUrl}`);
	let url = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
	var res = request('POST',url,{
		headers:{
			'Ocp-Apim-Subscription-Key':key
		},
		json:{
			url:imageUrl
		}
	});

	if(res.statusCode==200)
	{
		var result = JSON.parse(res.getBody('utf-8'));
		console.log(`Found ${result.length} face`);
		console.log(result);
		return result;
	}
	else
	{
		console.log('ERROR');
	}
}

function identify(faceIds) {
    console.log(`Begin to identity face.`);
    let url = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/identify';
    var res = request('POST', url, {
        headers: {
            'Ocp-Apim-Subscription-Key': key
        },
        json: {
            "personGroupId": groupId,
            "faceIds": faceIds,
            "maxNumOfCandidatesReturned": 1,
        }
    });

    if (res.statusCode == 200) {
        console.log(`Finish identity face.`);
        console.log(JSON.parse(res.getBody('utf8')));
        return JSON.parse(res.getBody('utf8'));
    } else {
        console.log('Error');
        console.log(res.getBody('utf8'));
    }
}

function recognize(imageUrl)
{
	console.log(`Begin recognize images ${imageUrl}`);
	var detectedFaces = detect(imageUrl);
	if(detectedFaces.length == 0)
	{
		console.log("Can't detect any face");
		return;
	}
	var identifiedResult = identify(detectedFaces.map(face => face.faceId));
	var allIdols = identifiedResult.map(result=>{
		//lay vi tri khon mat
		result.face = detectedFaces.filter(face=>face.faceId==result.faceId)[0].faceRectangle;
		//tim idol tu DB
		if(result.candidates.length>0)
		{
			let idolID = result.candidates[0].personId;
			let idol = idolPerson.filter(idol=>idol.personId == idolID)[0];
			result.idol =
			{
				id:idol.userData,
				name:idol.name
			};
		}
		else
		{
			result.idol =
			{
				id:0,
				name:'Unknown'
			};
		}
		return result;		
	});
	return allIdols;
}
//recognize('https://2sao.vietnamnetjsc.vn/images/2018/03/17/13/25/ngoc-trinh-490.jpg?width=272');


var server = http.createServer((req,res)=>{
	var uriData = url.parse(req.url);
	var path = uriData.pathname;
	console.log(path);
	console.log(typeof(path));
	if(path =="/idol")
	{
		let body = '';
		  req.on('data', (chunk) => {
		    body += chunk;
		  });
		  req.on('end', () => {
		      let data = body;
		      let queryData = querystring.parse(data);
		      result = recognize(queryData.link);
		      console.log(result[0]);
		      // write back something interesting to the user:
		      	res.end(result[0].idol.name);
		    	}
		  );
	}
	else if(path =='/' || path =='/favicon.ico')
	{
		console.log(path)
		fs.readFile('./index.html',(error,content)=>
		{
			res.writeHead(200,{'Content-Type': 'text/html'
	            });
			res.write(content);
			res.end();
		});
	}
	else if(path =='/style.css')
	{
		console.log(path)
		fs.readFile('./style.css',(error,content)=>
		{
			res.writeHead(200,{'Content-Type': 'text/css'
	            });
			res.end(content);
		});
	}
});
server.listen(8000);