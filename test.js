var BulkEmailBot = require('./lib/bulkemailbot'),
    userEmail = 'YOUR EMAIL ADDRESS',
    userPassword = 'YOUR PASSWORD',
    userService = 'Gmail',
    userName = 'First Last',
    fromAddress = 'Name <example@email.com>',
    user = new BulkEmailBot(userName, userEmail, userService, userPassword, fromAddress);

// write your subject line and email message here.
// $fName is currently the only supported replacement text
var message = {
    subject: 'Hey',
    template: 'Hi $fName, thanks for the interview!'
};

//sends individually personalized email to each list member
user.bulkSend('./recipients.csv', message, function(err, data){
    if(err){
        console.log(err);
    } else {
        console.log('Message sent to ', data.envelope.to);
    }
});
