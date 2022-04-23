const venom = require("venom-bot");
const fs = require('fs')
const mime = require('mime-types')
const fsPromisses = require('fs/promises');
const { time } = require("console");

venom
  .create({
    session: "main",
    multidevice: false,
    disableWelcome : true
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage( async (message) => {
    console.log(message);
    if (message.body.toLowerCase() === "hi" && message.isGroupMsg === false) {
      client
        .sendText(message.from, "Irmão, tu me deixa em paz, sai daqui")
        .then((result) => {
          console.log("Result: ", result);
        }).catch((erro) =>{console.error('erro: ', erro)});
    }
    
    //this part verifies if the message has a attachment, 
    if (message.isMedia === true || message.isMMS === true) {
    const buffer = await client.decryptFile(message);
    
    const fileDir = `./media/${message.sender.name}`;
    const fileName = `./media/${message.sender.name}/${message.mediaData['text']}.${mime.extension(message.mimetype)}`;
    //this set up variables to use as roots. it will be used to separate users media by folder and 

    fs.writeFile(fileName, buffer, (err) => {
      if (err){
          fsPromisses.mkdir(fileDir).catch((err) =>{
              console.log(err)
              time.sleep(3)

              fs.writeFile(fileName, buffer, (err) => {
                   console.log("Could not download the file. error: ", err)
                });
          })
      }
    });
  }
    

 
  });
}
