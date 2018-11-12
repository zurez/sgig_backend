

const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const contents= fs.readFileSync(path.resolve(__dirname, "../data/sample_data.json"));
const db=JSON.parse(contents);
/*******************FILTER****************************/ 

const filter_kwords=[
"budgetTypeName",
"experienceLevelName",
"gigTypeName",
"companyName",
"visaStatusName"
];

function extract_filters() {
	//Create object

	filters=[] 
	filter_kwords.map(function(e,i) {
		filters.push({
			tag:e,
			name:e.replace("Name","").replace(/([a-z])([A-Z])/g, '$1 $2'),
			elements:[]
		})
	})
	db.map(function(e,i){
		
	})

	return filters;
}

module.exports.filter=function filter() {
	return new Promise(function(resolve,reject){
		try{
			
			resolve(extract_filters())
		}
		catch(e){
			reject(e)
		}
	})
}
