let constants = {
    text: {}
};

constants.text.help = `I am *London Alerter*, and will help you during your commute! \n
These are the commands you can use:

/ask _central_ - Ask for the current status of a line 
/ask _commute_ - Ask for the status of your set commute 
/setcommute _central_ _victoria_ - Set your commute by adding lines after the command, you can only have one active commute at a time
/showcommute - Show the commute you have set 
/deletecommute - Delete your current commute. Please note if you delete or change your commute your notification will also be deleted
/setnotification _08:15_ - Set your notification time, you will be notified at the given time Monday to Friday if there is a problem in your commute
/deletenotification - Delete your current notification time
/shownotification - Show the notification you have set 
    
You can also ask me stuff in a more natural way. I will answer!

How is _central_? - Ask for the current status of a line
Show me my commute! - Ask for the current status of your commute`;

constants.text.start = `Hello, I am *London Transporter*. Set up your commute and never be surprised by the status of a line again!
If you want to know how to use me, you can start by using /help`;
constants.text.notification=`First make sure you have set up your commute with /setcommute\n
Then use */setnotification XX:XX* to set a valid hour in a *24 hour format* in multiples of 5 e.g., _09:00_ at which you want me to check if your commute is doing okay!`
constants.text.error = '⚠ There was an error ⚠\n';


module.exports = constants;