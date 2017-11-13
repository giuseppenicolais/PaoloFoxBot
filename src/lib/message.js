export default class Message {

	constructor(msg){
		this.from = msg.from;
		this.text = msg.text;
		this.user = msg.user;
		this.username = msg.user.username;
		this.chat_id = msg.chat_id;
	}

	static mapMessage(msg){
		//console.log(msg)
		return {
			from: msg.from.id,
			text: msg.text,
			chat_id: msg.chat.id,
			user: {
				username: msg.from.username,
				firstName: msg.from.first_name,
				lastName: msg.from.last_name
			}
		}
	}
}