import mongoose from "mongoose";

const AssessmentSchema = new mongoose.Schema({
  // Clerk user ID, unique to ensure one assessment per user
  userId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // Detailed and validated structure for the answers
  answers: {
    // Part I: Academic Background and Skills
    favoriteSubjects: { type: String, required: true },
    learningStyle: {
      theoretical: { type: Boolean, default: false },
      practical: { type: Boolean, default: false },
      handsOn: { type: Boolean, default: false },
      group: { type: Boolean, default: false },
      independent: { type: Boolean, default: false },
    },
    academicProject: { type: String, required: true },
    projectRole: { type: String, required: true },
    projectChallenges: { type: String, required: true },
    technicalSkills: { type: String },
    professionalGrowthAreas: { type: String },
    stayingUpToDate: { type: String },
    
    // Part II: Career and Future Aspirations
    successMeaning: { type: String, required: true },
    fiveYearPlan: { type: String, required: true },
    jobValues: {
      salary: { type: Boolean, default: false },
      workLifeBalance: { type: Boolean, default: false },
      growth: { type: Boolean, default: false },
      impact: { type: Boolean, default: false },
      stability: { type: Boolean, default: false },
      people: { type: Boolean, default: false },
    },
    industryChallenges: { type: String },
    companyCulture: { type: String },
    
    // Part III: Personal Interests and Hobbies
    hobbies: { type: String },
    hobbyImportance: { type: String },
    hobbyInfluence: { type: String },
    
    // Part IV: Institute and Placement Selection
    instituteRanking: {
      rank1: { type: String, required: true },
      rank2: { type: String, required: true },
      rank3: { type: String, required: true },
    },
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.models.Assessment || mongoose.model("Assessment", AssessmentSchema);