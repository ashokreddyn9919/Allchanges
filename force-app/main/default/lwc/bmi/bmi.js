const getBMI = function(weightinKg, heightinMt){
    alert('test')
    try{
        return weightinKg/(heightinMt*heightinMt);
    } catch(error){
        return undefined;
    } 
}

export{getBMI};