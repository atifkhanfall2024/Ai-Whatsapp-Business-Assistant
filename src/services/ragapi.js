const { default: axios } = require("axios")

const FastApiCall = async(query)=>{
    
    try {
        
        const res = await axios.post(process.env.FastApi , {query} , {withCredentials:true})
        //console.log(res.data);
        return res.data

    } catch (error) {
        console.log(error);
    }
}

module.exports =  FastApiCall