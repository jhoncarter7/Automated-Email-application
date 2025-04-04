import Sequence from "../models/Sequence.js";
import { agenda } from "../config/agenda.js"; 

const saveAndScheduleSequence = async (req, res) => {
   
    const { nodes, edges, leadEmail, delay } = req.body;
console.log( "delaylskdnvjskdbvnmsbvdb" ,delay, typeof delay)
    // Basic validation
    if (!Array.isArray(nodes) || !Array.isArray(edges) || nodes.length === 0) {
        return res.status(400).json({ error: "Missing or invalid nodes or edges in request body" });
    }

    if (!leadEmail || typeof leadEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail)) {
         return res.status(400).json({ error: "Missing or invalid leadEmail in request body" });
    }


    try {
        const sequence = new Sequence({
            delay,
            nodes,
            edges,
            leadEmail: leadEmail 
        });
        await sequence.save();
        console.log(`Sequence ${sequence._id} for ${leadEmail} saved successfully.`);

        let scheduledCount = 0;

        for (const node of nodes) {
            if (node?.data?.type === "email" && node.data.label && node.id) {
                const parts = node.data.label.split("\n");
                const subjectLine = parts[0] || "";
                const emailBody = parts.slice(1).join("\n").trim();
                const subject = subjectLine.replace("Subject:", "").trim();

                const emailAddress = leadEmail; 
               
               
                const scheduleTime = new Date(Date.now() + 60 * 1000 * `${Number(delay)}`);

                console.log(`Scheduling email for node ${node.id}: To ${emailAddress} at ${scheduleTime}`);

                try {
                     const job = await agenda.schedule(scheduleTime, "sendEmail", {
                        sequenceId: sequence._id,
                        nodeId: node.id,
                        emailAddress, 
                        subject: subject,
                        emailBody: emailBody,
                    });
                     console.log(`Successfully scheduled job "${job.attrs.name}" with ID: ${job.attrs._id} for node ${node.id}`);
                     scheduledCount++;
                } catch(scheduleError) {
                     console.error(`Error scheduling email job for node ${node.id}:`, scheduleError);
                }

            } else {
                 console.warn(`Skipping node - missing data, not an email type, or missing ID:`, { id: node?.id, type: node?.data?.type, label: node?.data?.label ? 'Exists' : 'Missing' });
            }
        } 

        res.status(200).json({
             message: `Sequence ${sequence._id} saved for ${leadEmail} and ${scheduledCount} email jobs scheduled successfully`,
             sequenceId: sequence._id
        });

    } catch (error) {
        console.error(`Error saving sequence for ${leadEmail} and scheduling jobs:`, error);
        
        if (error.code === 11000) { 
             return res.status(409).json({ error: `Sequence for email ${leadEmail} might already exist.` });
        }
        res.status(500).json({ error: "Failed to save sequence or schedule jobs" });
    }
};

export { saveAndScheduleSequence };
