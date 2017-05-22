//Module dependencies
var nodemailer = require('nodemailer'),
    fs = require('fs'),
    Converter = require('csvtojson').Converter,
    converter = new Converter({});

//constructor
function BulkEmailBot(name, email, service, password, fromAddress){
    this.name = name,
    this.email = email,
    this.service = service,
    this.password = password,
    this.fromAddress = fromAddress
}

//email bot methods

BulkEmailBot.prototype = {
    //configure transport object
    createTransporter: function(user, cb){
        var transporter = nodemailer.createTransport({
            service: user.service,
            auth: {
                user: user.email,
                pass: user.password
            }
        });
        cb(transporter);
    },

    //configure mail options
    setMailOptions: function(recipient, user, message, cb){
        var mailOptions = {
            to: { name: recipient.fName + " " + recipient.lName, address: recipient.email },
            from: user.fromAddress,
            subject: message.subject,
            text: message.text
        };
        cb(mailOptions);
    },

    //send email
    sendMail: function(user, recipient, message, cb){
        var self = this;
        self.createTransporter(user, function(transporter){
            self.setMailOptions(recipient, user, message, function(mailOptions){
                transporter.sendMail(mailOptions, cb);
            })
        })
    },

    //import recipients from CSV file and send email for each
    bulkSend: function(file, message, cb){
        var self = this;
        fs.createReadStream(file).pipe(converter);

        converter.on("end_parsed", function(recipients){
            recipients.forEach(function(recipient){
                message.text = message.template.replace(/[$](\w+)(?!\w)/, recipient.fName);
                self.sendMail(self, recipient, message, cb);
            })
        })
    }

};

module.exports = BulkEmailBot;
