const bcrypt = require('bcrypt');
const { ValCode } = require('../models');
const { sendEmail } = require('./emails')

const passwordChange = async (user,oldPass,newPass) => {
    let change;
    if(newPass) {
        change = newPass ? await bcrypt.compare(oldPass,user.password) : null;
    }
};

const verifyCode = async (email, user, val, clientMessage) => {

    let url, subject, msg;
    const eightDigitCode = Math.random().toString(36).substring(2,10);
    const year = new Date().getFullYear();

    const userName = await user.fullName;

    const emailCode = new ValCode({
        email, 
        code: eightDigitCode,
        ownerId: user._id,
        message: clientMessage
    }).save();
    
    if(val) {
    
        subject = "Portfolio Password Reset Code";
        msg = `
            <div>
                <p>Greetings, ${userName}!</p>
                <h3>Code: <h2>${eightDigitCode}</h2></h3>
                <p>Please use the provided code to change your password. You will need to update your accout with a new password. This passcode is only available for <b>20 minutes</b>.</p>
            </div>
        `
    }

    if(!val) {
        url = `${process.env.URL}/validated/${eightDigitCode}`
        subject = "Please Verify Your Email"
        msg = `
            <div style="border: 1px solid black; padding: .5em;">
                <p>Greetings, ${userName}!</p>
                <article>
                    <p>Thank you for sending a message to me! This email is meant to help verify that you are, indeed, you. Once you have click the provided link below, the message will be sent to me.</p>
                    <p>With that said, you can be sure that this should be the only time this will be needed. Once verified, you can send me messages as needed to keep that line of communication open. I look forward to working with you!</p>
                </article>
                <hr/>
                <h2>Verification Link:</h2>
                <p>Please click this <a href="${url}" target="_blank">link</a>.</p>
                <p>If that link doesn't work, please copy and paste this into your address bar of your browser: 
                <br/>${url}</p>

                <hr/>
                <h4>Here is your original message: </h4>
                <span>
                    ${clientMessage}
                </span>
                <p>This is only for your reference and doesn't need to be updated moving forward.</p>
                <p>Thank you for your time!</p>
                <footer style="background-color: lightgrey; text-align: center;">ericjwinebrenner.com &copy; ${year} </footer>
            </div>
        `
    }

    sendEmail(user, subject, msg);

}

module.exports = {
    passwordChange, verifyCode
}