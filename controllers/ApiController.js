

const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const contents= fs.readFileSync(path.resolve(__dirname, "../data/sample_data.json"));
const db=JSON.parse(contents).filter(function(e,i,el){if(el.indexOf(e)==i)return e});


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

/**************************SEARCH***********************************************/ 


function search_by_query(search_query) {
	return new Promise(function(resolve,reject){
		if (!search_query || search_query=="") {
			resolve(db)
		}

		try{
			filtered=db.filter(function(e,i){
				if (JSON.stringify(e).indexOf(search_query)!=-1) {
					return true;
				}
			})

			resolve(filtered)
		}
		catch(e){
			resolve([])
		}
	})
}

function search_by_filter(filterObject,db) {
	return new Promise(function(resolve,reject) {
	
		flag=filter_kwords.length
		filtered=db.filter(function(e,i){
			/*
				"budgetTypeName",
"experienceLevelName",
"gigTypeName",
"profile.companyName",
"profile.visaStatusName"
			*/ 
			var count=0;
			if (filterObject['budgetTypeName']&&filterObject['budgetTypeName'].length>0 && 
				filterObject['budgetTypeName'].indexOf(e['budgetTypeName'])!=-1) {
				count++
			}else if(!filterObject['budgetTypeName']|| filterObject['budgetTypeName'].length<1){
				count++
			}
			if(filterObject['gigTypeName']&&filterObject['gigTypeName'].length>0&&
				filterObject['gigTypeName'].indexOf(e['gigTypeName'])!=1){
				count++
			}else if(!filterObject['gigTypeName']|| filterObject['gigTypeName'].length<1){
				count++
			}
			if(filterObject['profile.companyName']
				&&filterObject['profile.companyName'].length>0&&
				filterObject['profile.companyName'].indexOf(e['profile']['companyName'])!=-1){
				count++
			}else if(!filterObject['profile.companyName']|| filterObject['profile.companyName'].length<1){
				count++
			}
			if(filterObject['profile.visaStatusName']
				&&filterObject['profile.visaStatusName'].length>0&&
				filterObject['profile.visaStatusName'].indexOf(e['profile']['visaStatusName'])!=-1){
				count++
			}else if(!filterObject['profile.visaStatusName']|| filterObject['profile.visaStatusName'].length<1){
				count++
			}
			if (filterObject['experienceLevelName']&&filterObject['experienceLevelName'].length>0 && 
				filterObject['experienceLevelName'].indexOf(e['experienceLevelName'])!=-1) {
				count++
			}else if(!filterObject['experienceLevelName']|| filterObject['experienceLevelName'].length<1){
				count++
			}
			
			if (count>=flag) {return true}
		})
		resolve(filtered)
	})
	
	

}
module.exports.search=function search(search_query,filter) {
	return new Promise(function(resolve,reject){
		try{
			search_by_query(search_query).then(function(result){
				search_by_filter(filter,result).then(function(final_result){
					resolve(final_result)
				})
			})
		}catch(err){
			reject({error:err.message})
		}
		
	})
}
