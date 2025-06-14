const Message = require("../models/Message");
const Chat = require("../models/Chat");


const sendMessage = async (req, res) =>{
const {content, chatId} =req.body;
if(!content || !chatId){
    return res.status(400).json({message: "all fields are required"});
    }
    
    try{
        const newMessage= await Message.create({
            sender: req.user._id,
            content,
            chat:chatId,

        })
         const populatedMessage = await newMessage.populate("sender", "username email");
    await populatedMessage.populate("chat");
    await Chat.findByIdAndUpdate(chatId, { lastMessage: populatedMessage });

    }catch(error){
         res.status(500).json({ message:"server error", error: err.message});
    }

}
const getMessages = async (req, res) => {
    const {chatId} = req.params;
    try{
        const messages = await messages.find({ chat:chatId})
            .populate("sender", "username email")
            .populate("chat");
            res.status(200).json(messages);

    } catch(error){
        res.status(500).json({message: "server error", error: error.message});
    }
}
module.exports = { sendMessage,getMessages };