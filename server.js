const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const token = "discordToken";

client.login(token);

client.on('ready', () =>{console.log("redi")})


function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }


client.on("messageCreate", (message)=>{
   var link = "";
    if(message.attachments.size>0){
        link = message.attachments.first().url;
    }
    else if(isValidHttpUrl(link)){
        link = message.content;
    }
    else{
        return;
    }
    
    

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongoConnectionLink";

    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("db");
    var myobj = {content:link,
    channel:
        {channel_id:{"$numberLong":message.channelId},
        channel_name:message.channel.name,
        guild:{guild_id:{"$numberLong":message.guildId},
            guild_name:message.guild.name,
            guild_avatar:message.guild.iconURL()}},
            message_id:message.id};
    dbo.collection("meme").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("done.");
        db.close();
    });
    });
         
}
);



var GuildChannels = class {
    constructor(channelId, channelName){
        this.channelId = channelId;
        this.channelName = channelName;
    }
    
}

var UserGuilds = class {
    
    constructor(guildId, guildName, guildAvatar, guildChannels){
        this.guildId = guildId;
        this.guildName = guildName;
        this.guildAvatar = guildAvatar;
        this.guildChannels = guildChannels;

    }

}

var userGuilds = [];
function returnAllGuilds(){

    client.guilds.cache.forEach( (guild) => {

        var tempGuildChannels = [];
        guild.channels.cache.forEach( (channel) => {
            if(channel.type === "GUILD_TEXT"){
            tempGuildChannels.push(new GuildChannels(channel.id, channel.name));
            }
         })
         
        userGuilds.push(new UserGuilds(guild.id, guild.name, guild.iconURL(), tempGuildChannels));
    })
    return userGuilds;
}

const express = require('express');
const path = require('path');
const app = new express();

app.use(express.static('static'));
app.use('/css', express.static(__dirname + 'static/css'))

app.get('/', function(request, response){
    response.sendFile('index.html', { root: __dirname });
    
});


var writeAllGuildsJS = "    for (var i = 0; i < allGuilds.length/2; i++){" +
	"        document.write(\"<center><img src='\"+allGuilds[i].guildAvatar+\"' style='text-align: center;border-radius: 100%; height: 75px;'><br><section style='text-align: center; font-size:38px; font-family: Clipangle;color:rgb(50,50,50);'>\"+allGuilds[i].guildName+\"</section>\");" +
	"        for (var j = 0; j < allGuilds[i].guildChannels.length; j++){" +
	"            document.write(\"<section style='text-align: center; font-size:19px; font-family: Verdana;color:rgb(100,100,100);'>\"+allGuilds[i].guildChannels[j].channelName+\"</section>\");" +
	"        } document.write(\"<br><br><br><br></br>\")"+
	"}";


app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');

var MongoClient = require('mongodb').MongoClient;
var url = "mongoConnectionLink";

    app.post('/', function(req, res) {


    MongoClient.connect(url, function(err, db) {

        if (err) throw err;
        var dbo = db.db("db");
        dbo.collection("meme").find({}).toArray(function(err, result) {
          if (err) throw err;

            db.close();
            var writeAllMemesJS =  "for(var i = allMemes.length-1; i >= 0 ; i--){"+
                "if(allMemes[i].content.endsWith('.mp4')){"+
                    "document.write(\"<img id='avatar' section style='text-align: center' src='\"+allMemes[i].channel.guild.guild_avatar+\"'><br><section section style='text-align: center' id='guildName'>\"+allMemes[i].channel.guild.guild_name+\"<br><section section style='text-align: center' id='channelName'>\"+allMemes[i].channel.channel_name+\"<br><video id='video' controls> <source src='+allMemes[i].content+' type='video/mp4'></source></video><br>\");"+
                "}"+
                "else{"+
                    "document.write(\"<br><center><img  id='avatar' section style='text-align: center;border-radius: 100%; height: 75px; width:75px;' src='\"+allMemes[i].channel.guild.guild_avatar+\"'>"+
                    "<br><b><section style='text-align: center; font-size:38px; font-family: Clipangle;color:rgb(50,50,50);' id='guildName'>\"+allMemes[i].channel.guild.guild_name+\"</b>"
                    +"<br><section section style='text-align: center; font-size:19px; font-family: Verdana;color:rgb(100,100,100);' id='channelName'>\"+allMemes[i].channel.channel_name+\""
                    +"<br><br><img section style='text-align: center;border-radius: 25px;' id='meme' src='\"+allMemes[i].content+\"'><br><br><br><br><br>\");"+
                "}"+
            "};";
            res.send("<script type='text/javascript'> var allMemes = JSON.parse('"+JSON.stringify(result)+"'); "+writeAllMemesJS+" </script>");
        });
      })
    });







