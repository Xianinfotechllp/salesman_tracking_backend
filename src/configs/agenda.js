const Agenda = require("agenda");

const agenda = new Agenda({
  db: { address: process.env.DB_URI, collection: "agendaJobs" },
  processEvery: "30 seconds", 
});


module.exports = agenda;


require("../jobs/reminderJobs");

(async function () {
  await agenda.start();
  console.log("✅ Agenda started successfully");

  agenda.on("start", (job) => {
    console.log(`🟢 Job started: ${job.attrs.name}`);
  });

  agenda.on("success", (job) => {
    console.log(`✅ Job finished: ${job.attrs.name}`);
  });

  agenda.on("fail", (err, job) => {
    console.log(`❌ Job failed: ${job.attrs.name}`, err);
  });

  // setTimeout(async () => {
  //   await checkScheduledJob("send-follow-up-notification");
  // }, 5000);

})();

//function to see scheduled jobs

async function checkScheduledJob(jobName) {
   try {
     const jobs = await agenda.jobs({ name: jobName });
     if (jobs.length > 0) {
       console.log(`✅ Job "${jobName}" is scheduled.`);
       jobs.forEach((job) => {
         console.log(`🔹 Next run at: ${job.attrs.nextRunAt}`);
       });
     } else {
      console.log(`❌ Job "${jobName}" is not scheduled.`);
     }
   } catch (err) {
     console.error("❌ Error checking scheduled jobs:", err);
   }
 }
