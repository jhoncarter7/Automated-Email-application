import Agenda from "agenda";
import transporter from "./nodemailer.js"; 


// --- Initialize Agenda ---

const agenda = new Agenda({
    db: { address: process.env.MONGODB_URI, collection: 'agendaJobs' }, 
    processEvery: '10 seconds' 
});

agenda.define("sendEmail", { priority: 'high', concurrency: 10 }, async (job) => {
    
    console.log(`--- Starting job ${job.attrs.name} (${job.attrs._id}) ---`);
    const { emailAddress, subject, emailBody } = job.attrs.data;

    if (!emailAddress || !subject || !emailBody) {
        console.error(`Job ${job.attrs._id} missing data:`, job.attrs.data);
        throw new Error("Missing required email data (address, subject, or body)");
    }

    try {
        console.log(`Attempting to send email via job ${job.attrs._id} to ${emailAddress}`);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: emailAddress,
            subject: subject,
            text: emailBody,
        });
        console.log(`Email successfully sent by job ${job.attrs._id} to ${emailAddress}`);
    } catch (emailError) {
        console.error(`Job ${job.attrs._id} failed to send email to ${emailAddress}:`, emailError);
      
        throw emailError;
    }
});

// --- Agenda Event Listeners ---
agenda.on("error", (err) => {
    console.error("Agenda experienced an error:", err);

});


agenda.on('start', job => {
  console.log(`Job ${job.attrs.name} (${job.attrs._id}) starting`);
});

// Listener for job success
agenda.on('success', job => {
  console.log(`Job ${job.attrs.name} (${job.attrs._id}) completed successfully`);
});


agenda.on('fail', (err, job) => {
  console.error(`Job ${job.attrs.name} (${job.attrs._id}) failed with error:`, err);
});


const startAgenda = async () => {
    await agenda.start();
    console.log("Agenda processing started.");
};

// Function to stop Agenda gracefully
const stopAgenda = async () => {
    try {
        await agenda.stop();
        console.log("Agenda stopped gracefully.");
    } catch (stopError) {
        console.error("Error stopping Agenda:", stopError);
    }
};

export { agenda, startAgenda, stopAgenda };
