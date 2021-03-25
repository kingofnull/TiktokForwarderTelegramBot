const {tall}=require('tall');
const TikTokScraper = require('tiktok-scraper');
const TelegramBot = require('node-telegram-bot-api');

const {BroadcastLog,db} = require('./model');
const {sendToChannel,botToken} = require('./com');

const bot = new TelegramBot(botToken, {polling: true});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    
	//regex match to find share URL
	let m=/((https?|ftp):\/\/[^\s/$.?#].[^\s]*)/.exec(msg.text);
	
    if(!m){
        bot.sendMessage(chatId, 'I can not find the url in your message.',{reply_to_message_id:msg.message_id});
    }else{
        bot.sendMessage(chatId, 'I\'m working on it ...',{reply_to_message_id:msg.message_id});

        let shortUrl=m[1];
        const url = await tall(shortUrl);
        try {
            const post = (await TikTokScraper.getVideoMeta(url, {})).collector.pop();
			
			console.log('POST:',post);
			
		
			
            

            let msg_data={};
            let post_record=await BroadcastLog.findOne({where: {id: post.id}});
			
			//if url foung in database try to forward it
            if(post_record){
                console.log(`Already exists: ${post.id}`);
                msg_data={message_id:post_record.message_id,chat:{id:post_record.chat_id}};
				
            }else{//if is new send to cache channel and then forward it
				
                console.log(`Sending: ${post.id}`);
                msg_data=await sendToChannel(post,BroadcastLog);
            }

            let r=await bot.forwardMessage(chatId, msg_data.chat.id, msg_data.message_id)


            console.log(r);
        } catch (error) {
            console.log(error);
        }
        console.log()
    }

    // send a message to the chat acknowledging receipt of their message

});
/*


// Trending feed
(async () => {
    tall('https://vm.tiktok.com/ZMJSY8gvV/')
        .then(unshortenedUrl => console.log('Tall url', unshortenedUrl))
        .catch(err => console.error('AAAW 👻', err))

    try {
        await db.sync();

        // const posts = await TikTokScraper.user.trend('lang=en', {number: 10});
        const posts = await TikTokScraper.trend('lang=fa', {number: 2, noWaterMark: true});

        posts.collector.forEach(p => {
            if (!p.videoUrl) {
                return;
            }

            //console.log(p)
            BroadcastLog
                .count({where: {id: p.id}})
                .then(count => {
                    sendToChannel(p);
                    // process.exit();
                    if (!count) {//if not exist!

                    } else {
                        console.log(`Already exists: ${p.id}`);
                    }
                });


        });

    } catch (error) {
        console.log(error);
    }
})();
*/
