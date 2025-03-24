const userIdToTrack = '467372767130550278';
const me = '659762420327120936';
let lastStatusChangeTime = 0;
const debounceTime = 100;
let existingMessage = null;
const getCDStamp = (timestamp = Date.now()) => `<t:${Math.round(timestamp / 1000)}:R>`

module.exports = {
    name: 'presenceUpdate',
    async execute(oldPresence, newPresence) {
        if (newPresence.userId === userIdToTrack) {
            const oldStatus = oldPresence ? oldPresence.status : 'offline';
            const newStatus = newPresence ? newPresence.status : 'offline';
    
            const now = Date.now();
            
            if (oldStatus !== newStatus && now - lastStatusChangeTime > debounceTime) {
                lastStatusChangeTime = now;
                const user = await newPresence.client.users.fetch(me);
                if (existingMessage) {
                    existingMessage.edit({content: `${newStatus}, ${getCDStamp(now)}`, ephemeral: true})
                } else {
                    existingMessage = await user.send({content: `${newStatus}, ${getCDStamp(now)}`, ephemeral: true});
                };
                
                user.send(`nigga`).then((msg) => {msg.delete();});
            }
        }
    },
};