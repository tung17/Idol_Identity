// idol

let allIdols = 
[
	"Ngọc Trinh",
    "Bà tưng",
    "Hường Hana",
    "Hoàng Thùy Linh",
    "Elly Trần",
    "Thuỷ Top",
    "Tâm Tít",
    "Midu",
    "Miu Lê",
    "Chi Pu",
    "Khả Ngân",
    "Angela Phương Trinh"
];

// lay anh tu api bing
async function getImage(query) {
    console.log(`Begin getting images for ${query}`);
    var key = 'ef1d1b22018d472b8d4c169f1c3959ee'; // Thay bằng API Key của bạn
  
    // Gọi API, truyền key vào header, lấy kết quả trả về dạng 
    var url = `https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${query}&count=30`;
    var result = await fetch(url, {
        method: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': key
        }
    }).then(rs => rs.json());

    console.log(`Finish getting images for ${query}`);

    // Lọc bớt, chỉ lấy link thumbnail và link ảnh
    return result.value.map(vl => {
        return { thumbnail: vl.thumbnailUrl, image: vl.contentUrl };
    });
}

function downloadJson(jsonObject)
{
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonObject));
	var dlAnchorElem = document.createElement('a');
	dlAnchorElem.setAttribute("href", dataStr);
	dlAnchorElem.setAttribute("download", "idols.json");
	dlAnchorElem.click();
}

// chay chuong trinh

async function rundata()
{
	let index = 1;
    let idolWithImage = [];

    for(let idol of allIdols)
    {
    	var images = await getImage(idol);

    	idolWithImage.push(
    	{
    		id:index++,
    		name:idol,
    		images:images
    	});

    }

    console.log(idolWithImage);

    downloadJson(idolWithImage);
}