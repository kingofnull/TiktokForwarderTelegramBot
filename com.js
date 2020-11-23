const TelegramBot = require('node-telegram-bot-api');


const {botToken,channel} = require('./config');;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(botToken, {polling: false});

module.exports.botToken = botToken;

module.exports.sendToChannel = async (tiktokPost, BroadcastLog) => {

    //REGION bitly url shorter
    /*const bitlyAccessToken = 'f60809a303e8c4aecfdc170a62f0f435df0430c4';
          var bitly = require('bitly-node-api')(bitlyAccessToken);
       bitly.bitlinks.createBitlink({long_url: videoUrl}).then(lr => {
       if (!lr.link) {
           return;
       }
       console.log(p.id, videoUrl);

       ;
       //console.log(p.authorMeta);


   })*/
    //END REGION

    let r = await bot.sendMessage(channel,
        `${tiktokPost.text}\n\n` +
        `<code>User: ${tiktokPost.authorMeta.name}</code>\n` +
        (tiktokPost.musicMeta.musicAuthor !== tiktokPost.authorMeta.name ? `<code>Music: ${tiktokPost.musicMeta.musicAuthor} - ${tiktokPost.musicMeta.musicName}</code>` : '') +
        `<a href="${tiktokPost.videoUrl}">+</a>`,
        {parse_mode: 'HTML'}
    )

    console.log(tiktokPost.webVideoUrl);
    console.log(r.message_id, r.chat.id);
    BroadcastLog.create({
        ...tiktokPost,
        web_url: tiktokPost.webVideoUrl,
        chat_id: r.chat.id,
        message_id: r.message_id,
        createTime: Date.now()
    });

    return r;
}



