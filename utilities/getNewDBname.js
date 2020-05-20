// const User = require("./../models/User.js")

module.exports = (name, email, DBlist) => {

    for(i = name.length - 1; i > 0 ; i--) {
        name = name.replace(".","").replace("@","").replace("_","").replace("-","").replace("!","").replace("#","").replace("$","").replace("^","").replace("&","").replace("?","").replace("=","").replace("/","").replace("-","").replace("+","").replace("*","").replace("'","").replace(",","").replace(")","").replace("(","").replace('"',"").replace("|","").replace("{","").replace("`","").replace(">","").replace("<","").replace(";","").replace(":","").replace("]","").replace("[","").replace("@","")     
    }

    for(i = email.length - 1; i > 0 ; i--) {
        email = email.replace(".","").replace("@","").replace("_","").replace("-","").replace("!","").replace("#","").replace("$","").replace("^","").replace("&","").replace("?","").replace("=","").replace("/","").replace("-","").replace("+","").replace("*","").replace("'","").replace(",","").replace(")","").replace("(","").replace('"',"").replace("|","").replace("{","").replace("`","").replace(">","").replace("<","").replace(";","").replace(":","").replace("]","").replace("[","").replace("@","")     
    }

    name = name.toLowerCase()
    email = email.toLowerCase()


    let DBname = email
    let DBnameOkey
    let overSized
    do {
        DBnameOkey = 1
        overSized = 0
        DBlist.forEach(listedDB => {
            if(listedDB == DBname) {
                DBnameOkey = 0
                console.log('same DBname found')
            }  
          
        });
        if(byteLength(DBname) > 37) {
            console.log(byteLength(DBname), 'size in loop')
            DBnameOkey = 0
            overSized = 1
        }

        if(!DBnameOkey && !overSized) {
            DBname = DBname + Math.floor(Math.random() * 1000)
        } else if(!DBnameOkey && overSized) {
            DBname = DBname.slice(0, 29)
        }

    } while(!DBnameOkey || overSized) 

    function byteLength(str) {
        // returns the byte length of an utf8 string
        var s = str.length;
        for (var i=str.length-1; i>=0; i--) {
          var code = str.charCodeAt(i);
          if (code > 0x7f && code <= 0x7ff) s++;
          else if (code > 0x7ff && code <= 0xffff) s+=2;
          if (code >= 0xDC00 && code <= 0xDFFF) i--; 
        }
        return s;
    }

   
    console.log(DBname, 'email as DB?')
    console.log(byteLength(DBname),'size in byte') 

    return DBname 
    
}

    
