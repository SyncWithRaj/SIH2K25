import mongoose from 'mongoose';
import College from '../models/College.js';

// ⬇️ ⬇️ ⬇️ PASTE YOUR MONGODB CONNECTION STRING HERE ⬇️ ⬇️ ⬇️
const MONGODB_URI = "mongodb+srv://rajr127655_db_user:rajribadiya@sih.ll6cny4.mongodb.net/?retryWrites=true&w=majority&appName=SIH";
// ⬆️ ⬆️ ⬆️ PASTE YOUR MONGODB CONNECTION STRING HERE ⬆️ ⬆️ ⬆️

const rawData = `
### Anant National University
* *Address:* Sanskardham Campus, Bopal-Ghuma-Sanand Road, Ahmedabad - 382115, Gujarat
* *Contact No:* +91 79 3530 2000
* *Email:* info@anu.edu.in
* *Website:* www.anu.edu.in
* *University:* Anant National University (Private)
* *Fees:* Approx. ₹3,50,000 - ₹4,50,000 per year for B.Des
* *Facilities:* Boys Hostel: Yes, Girls Hostel: Yes, Mess: Yes, Transportation: Yes
| Branch Name | Intake 2025-26 | Government Seats | Board | Category | Closing Rank (Round-3) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Bachelor of Design (B.Des) | 0 | 0 | AnantU Entrance Exam | N/A | 0 |
| Bachelor of Architecture (B.Arch) | 0 | 0 | NATA | N/A | 0 |
| Bachelor of Technology (B.Tech) | 0 | 0 | JEE Main | N/A | 0 |
***
### L.D. College of Arts
* *Address:* Navrangpura, Ahmedabad, Gujarat - 380009
* *Contact No:* 079-26306752
* *Email:* ldcar Ahmedabad-ce@gujarat.gov.in
* *Website:* www.ldarts.org
* *University:* Gujarat University
* *Fees:* Approx. ₹1,200 per year
* *Facilities:* Boys Hostel: No, Girls Hostel: No, Mess: No, Transportation: No
| Branch Name | Intake 2025-26 | Government Seats | Board | Category | Closing Rank (Round-3) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| B.A. - English | 0 | 0 | Merit Based | N/A | 0 |
| B.A. - Gujarati | 0 | 0 | Merit Based | N/A | 0 |
| B.A. - Economics | 0 | 0 | Merit Based | N/A | 0 |
| B.A. - History | 0 | 0 | Merit Based | N/A | 0 |
| B.A. - Psychology | 0 | 0 | Merit Based | N/A | 0 |
| M.A. - English | 0 | 0 | Merit Based | N/A | 0 |
| M.A. - Hindi | 0 | 0 | Merit Based | N/A | 0 |
`;

const parseAndInsertData = async () => {
    if (MONGODB_URI === "your_mongodb_connection_string_goes_here") {
        throw new Error("Please paste your actual MONGODB_URI into the script.");
    }

    console.log("Attempting to connect to the database...");
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected for seeding...");

    try {
        const collegeBlocks = rawData.split('***').filter(block => block.trim() !== "");
        for (const block of collegeBlocks) {
            const collegeNameMatch = block.match(/### (.*)/);
            if (!collegeNameMatch) continue;
            const name = collegeNameMatch[1].trim();

            const getDetail = (regex) => {
                const match = block.match(regex);
                return match ? match[1].trim() : null;
            };

            const address = getDetail(/\* \*Address:\* (.*)/);
            const contactNo = getDetail(/\* \*Contact No:\* (.*)/);
            const email = getDetail(/\* \*Email:\* (.*)/);
            const websiteMatch = block.match(/\* \*Website:\* \[(.*?)\]\(.*?\)/) || block.match(/\* \*Website:\* (www\..*)/);
            const website = websiteMatch ? websiteMatch[1].trim() : null;
            const university = getDetail(/\* \*University:\* (.*)/);
            const fees = getDetail(/\* \*Fees:\* (.*)/);
            const facilitiesRaw = getDetail(/\* \*Facilities:\* (.*)/);

            const facilities = {
                boysHostel: /Boys Hostel:\s*Yes/i.test(facilitiesRaw),
                girlsHostel: /Girls Hostel:\s*Yes/i.test(facilitiesRaw),
                mess: /Mess:\s*Yes/i.test(facilitiesRaw),
                transportation: /Transportation:\s*Yes/i.test(facilitiesRaw)
            };
            
            const tableMatch = block.match(/\| :--- \|([\s\S]*)/);
            const branches = [];
            if (tableMatch && tableMatch[1]) {
                const tableRows = tableMatch[1].trim().split('\n');
                for (const row of tableRows) {
                    const cols = row.split('|').map(col => col.trim());
                    if (cols.length > 6 && cols[1]) {
                        branches.push({
                            branchName: cols[1],
                            intake: parseInt(cols[2], 10) || 0,
                            governmentSeats: parseInt(cols[3], 10) || 0,
                            board: cols[4],
                            category: cols[5],
                            closingRank: parseFloat(cols[6]) || 0
                        });
                    }
                }
            }

            const collegeData = { name, address, contactNo, email, website, university, fees, facilities, branches };
            await College.findOneAndUpdate(
                { name: collegeData.name },
                collegeData,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`✅ Successfully processed: ${name}`);
        }
    } catch (error) {
        console.error("❌ Error during seeding process:", error);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
};

parseAndInsertData().catch(err => {
    console.error("❌ Seeding script failed to start:", err);
});