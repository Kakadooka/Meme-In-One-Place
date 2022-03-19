

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const token = "discordBotToken";

client.login(token);

client.on('ready', () =>{alert("test");})


/* moze kiedys sie przydadza te 3 linijki xd

function messageHasAnURL(message){
    return message.attachments.size>0;
}*/



client.on("messageCreate", (message)=>{
   
    console.log(
        (message.attachments.size>0) ?
        message.attachments.first().url :
        message.content
        );
      
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

//Wklada wszystkie guildy i ich kanaly do userGuilds
client.on("ready", () => {

    client.guilds.cache.forEach( (guild) => {

        var tempGuildChannels = [];
        guild.channels.cache.forEach( (channel) => {
            tempGuildChannels.push(new GuildChannels(channel.id, channel.name));
         })
        userGuilds.push(new UserGuilds(guild.id, guild.name, guild.iconURL(), tempGuildChannels));
    })

    document.write(userGuilds[0]);
});
