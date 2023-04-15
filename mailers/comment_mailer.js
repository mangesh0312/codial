const nodemailer = require('../config/nodemailer');

//this is another way of exporting a method

exports.newComment = (comment) =>{
    console.log('inside newComment mailer',comment);

    let htmlString = nodemailer.renderTemplate({comment: comment},'/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
        from: 'mangesh@gmail.com',
        to: comment.user.email,
        subject: "New Comment published",
        html: htmlString
    },(err,info) =>{
        if(err){
            console.log('Error in sending the mail',err); 
            return;
        }
        console.log('Message sent',info);
        return;
    })
}