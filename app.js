//Call dependencies
const csvFilePath='tactic.csv';
const csv=require('csvtojson')
const fs = require('fs')
const fetch = require('node-fetch')

//Main Entry point
async function main() {
    //The array that is to be returned
    var status = []
    
    //Parse CSV file into a JSON array
    const jsonArray=await csv().fromFile(csvFilePath);

    //Loop through the rows from the CSV
    for (let i =0; i< jsonArray.length; i++)
    {
        //Assign the impression metadata
        let impression = jsonArray[i].impression_pixel_json
        //Assign the tactic id
        let tacticID = jsonArray[i].tactic_id
        //Check that the impression isnt empty
        if (impression != '[]' && impression != 'NULL'){
            //Put everything in a try catch block for debugging
            try{
                //Split the impression on quotes and grab the first URL
                var impressionUrl = impression.split(/(")/)[2]
                //Send an HTTP request with the impressionURl
                const res = await fetch(new URL(impressionUrl));
                //Get the result from the request
                const data = await res.status;
                //Check that the status is 3xx or 4xx
                if (data >= 300 && data <= 499 )
                {
                    //add the url and tactic ID to the return object
                    console.log([impressionUrl, data]);
                    status.push ([impressionUrl, tacticID])
                }
            }
            catch (err)
            {
                //console.log (err)
            }
        }
    }
    console.log("STATUS IS: "+status)
    return status
}

main()