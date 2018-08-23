var request = require('sync-request');

var idols = require('./filtered-idols.json');

let key = 'f9733f324634462182c44b5b7c6726b2';

let groupId = 'vav-idols';

function sleep(time)
{
	console.log('Begin sleep');
	var stop = new Date().getTime();
	while(new Date().getTime() < stop +time)
	{
		;
	}

	console.log('End Sleep');
}

function submitIdol(idol)	
{
	let url = `https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/${groupId}/persons`;
	console.log(`Begin submit idol:${idol.id} - ${idol.name}`);
	var res = request('POST',url,{
		headers:{
			'Ocp-Apim-Subscription-Key':key
		},
		json:{
			name: idol.name,
			userData:idol.id
		}
	});

	if(res.statusCode == 200)
	{
		var person = JSON.parse(res.getBody('utf8'));
		console.log(`SUCCESS - Submit idol ${idol.id} - ${idol.name}, personID:${person.personID}`);

		//submit anh cua idol bo 4 anh dau

		for(let i=4;i<	idol.images.length;i++)
		{
			try{
				submitIdolFace(person.personId,idol.images[i].image);
				sleep(4*1000);
			}
			catch(err)
			{
				console.log('ERROR');
				console.log(err);
			}
		}
	}
	else
	{
		console.log(res.getBody('utf8'));
	}
}

function submitIdolFace(personId, faceUrl)
{
	console.log(`Begin submit image ${faceUrl.substring(20,60)} for personID: ${personId}`);
	let url = `https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/${groupId}/persons/${personId}/persistedFaces`;
	var res = request('POST',url,{
		headers:{
			'Ocp-Apim-Subscription-Key': key
		},
		json:{
			url: faceUrl
		}
	});

	if(res.statusCode == 200)
	{
		console.log(`SUCCESS - Submit image ${faceUrl.substring(20,60)} for person id ${personId}.`);
	}
	else
	{
		console.log('ERROR')
	}
}

for(let idol of idols)
{
	submitIdol(idol);
}