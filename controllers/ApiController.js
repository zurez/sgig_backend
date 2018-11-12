

const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const contents= fs.readFileSync(path.resolve(__dirname, "../data/sample_data.json"));
const db=JSON.parse(contents);
/*******************FILTER****************************/ 

var filter_kwords=[
"budgetTypeName",
"experienceLevelName",
"gigTypeName",
"profile.companyName",
"profile.visaStatusName"
];

function extract_filters() {

	filters=[]
	filter_kwords.map(function(e_kword,i) {
		keys=e_kword.split(".")
		keys_length=keys.length
		elements=db.map(function(e_db,i_db) {
			ret=""
			switch(keys_length){
				case 1:
				 ret=e_db[keys[0]]
				 break;
				case 2:
				ret=e_db[keys[0]][keys[1]]
				break;
				case 3:
				ret=e_db[keys[0]][keys[1]][keys[2]]
				break;
				default:
				ret=""
				break;
			}
			return ret
		})

		filters.push({
			tag:e_kword,
			name:e_kword.replace("Name","").replace(/([a-z])([A-Z])/g, '$1 $2'),
			elements:elements.filter(function(e,i,el){if(el.indexOf(e)==i)return e}).sort()
		})
	})

	return filters;
}

module.exports.filter=function filter() {
	return new Promise(function(resolve,reject){
		try{
		
			
			resolve(extract_filters())
		}
		catch(e){
			reject({error:e.message})
		}
	})
}
