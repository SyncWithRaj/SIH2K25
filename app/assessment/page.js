"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// --- Main Assessment Component ---
export default function Assessment() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [answers, setAnswers] = useState({
    favoriteSubjects: "",
    learningStyle: { theoretical: false, practical: false, handsOn: false, group: false, independent: false },
    academicProject: "",
    projectRole: "",
    projectChallenges: "",
    technicalSkills: "",
    professionalGrowthAreas: "",
    stayingUpToDate: "",
    successMeaning: "",
    fiveYearPlan: "",
    jobValues: { salary: false, workLifeBalance: false, growth: false, impact: false, stability: false, people: false },
    industryChallenges: "",
    companyCulture: "",
    hobbies: "",
    hobbyImportance: "",
    hobbyInfluence: "",
    instituteRanking: { rank1: "", rank2: "", rank3: "" },
  });

  // EFFECT TO FETCH EXISTING ASSESSMENT DATA
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        fetch(`/api/assessment?userId=${user.id}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.answers) {
              setAnswers(data.answers);
            }
          })
          .catch(err => console.error("Failed to fetch assessment, starting fresh:", err))
          .finally(() => setIsLoading(false));
      } else {
        // If Clerk is loaded but there's no user, stop loading.
        setIsLoading(false);
      }
    }
  }, [isLoaded, user]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent, e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [name]: value },
    }));
  };

  const handleCheckboxChange = (parent, name) => {
    setAnswers((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [name]: !prev[parent][name] },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, answers }),
      });
      if (!res.ok) throw new Error("Failed to save assessment");
      
      router.push("/profile");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return (
          answers.favoriteSubjects.trim() !== '' &&
          answers.academicProject.trim() !== '' &&
          answers.projectRole.trim() !== '' &&
          answers.projectChallenges.trim() !== '' &&
          answers.technicalSkills.trim() !== '' &&
          answers.professionalGrowthAreas.trim() !== '' &&
          answers.stayingUpToDate.trim() !== ''
        );
      case 2:
        return (
          answers.successMeaning.trim() !== '' &&
          answers.fiveYearPlan.trim() !== '' &&
          answers.industryChallenges.trim() !== '' &&
          answers.companyCulture.trim() !== ''
        );
      case 4:
        return answers.instituteRanking.rank1 && answers.instituteRanking.rank2 && answers.instituteRanking.rank3;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
    } else {
      alert("Please fill out all required fields marked with * before proceeding.");
    }
  };

  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  const steps = [
    "Academics & Skills",
    "Career Aspirations",
    "Personal Interests",
    "Institute Selection",
  ];

  if (isLoading) {
    return <main className="min-h-screen bg-slate-50 flex items-center justify-center"><p>Loading Assessment...</p></main>;
  }
  
  if (!user) {
    return <main className="min-h-screen bg-slate-50 flex items-center justify-center"><p>Please sign in to take the assessment.</p></main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 mt-18">
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep > index ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}
              >
                {currentStep > index ? '✓' : index + 1}
              </div>
              <p className={`ml-3 font-medium ${currentStep > index ? 'text-indigo-600' : 'text-slate-500'}`}>{step}</p>
              {index < steps.length - 1 && <div className="flex-1 h-1 mx-4 bg-slate-200"></div>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl p-8 sm:p-12">
          {currentStep === 1 && <Step1Academic data={answers} onTextChange={handleTextChange} onCheckboxChange={handleCheckboxChange} />}
          {currentStep === 2 && <Step2Career data={answers} onTextChange={handleTextChange} onCheckboxChange={handleCheckboxChange} />}
          {currentStep === 3 && <Step3Personal data={answers} onTextChange={handleTextChange} />}
          {currentStep === 4 && <Step4Institute data={answers} onNestedChange={handleNestedChange} />}

          <div className="mt-12 pt-6 border-t flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-2 rounded-lg font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-opacity ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            {currentStep < 4 ? (
              <button type="button" onClick={nextStep} className="px-8 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700">
                Next
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className={`px-8 py-2 rounded-lg font-bold text-white transition-colors ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                {isSubmitting ? "Submitting..." : "Submit Assessment"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

// --- Helper Components ---
const Question = ({ label, children }) => (
  <label className="block mb-8">
    <span className="text-gray-800 font-semibold text-lg">{label}</span>
    <div className="mt-3">{children}</div>
  </label>
);

const CheckboxCard = ({ name, label, isChecked, onChange }) => (
  <label
    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isChecked ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-300 bg-white hover:border-indigo-400'}`}
    onClick={(e) => { e.preventDefault(); onChange(name); }}
  >
    <input type="checkbox" className="hidden" checked={isChecked} readOnly />
    <span className={`font-medium ${isChecked ? 'text-indigo-800' : 'text-slate-700'}`}>{label}</span>
  </label>
);

// --- Step Components ---
const baseInputStyles = "w-full border border-slate-300 bg-white p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500";

const Step1Academic = ({ data, onTextChange, onCheckboxChange }) => (
  <div className="animate-fadeIn space-y-8">
    <h2 className="text-3xl font-bold text-slate-800 mb-8">Academic Background & Skills</h2>
    <Question label="What were your favorite subjects in 11th and 12th, and what interested you most?*">
      <textarea name="favoriteSubjects" value={data.favoriteSubjects} onChange={onTextChange} className={`${baseInputStyles} h-28`} required />
    </Question>
    <Question label="How do you prefer to learn?">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries({ theoretical: "Theoretical concepts", practical: "Real-world problems", handsOn: "Hands-on projects", group: "Group collaboration", independent: "Independent research" }).map(([key, label]) => (
          <CheckboxCard key={key} name={key} label={label} isChecked={data.learningStyle[key]} onChange={(name) => onCheckboxChange("learningStyle", name)} />
        ))}
      </div>
    </Question>
    <Question label="Describe a significant academic project or task you've worked on.*">
      <div className="space-y-4">
        <textarea name="academicProject" value={data.academicProject} onChange={onTextChange} placeholder="What was the project?" className={`${baseInputStyles} h-20`} required />
        <textarea name="projectRole" value={data.projectRole} onChange={onTextChange} placeholder="What was your role?" className={`${baseInputStyles} h-20`} required />
        <textarea name="projectChallenges" value={data.projectChallenges} onChange={onTextChange} placeholder="What challenges did you face and how did you overcome them?" className={`${baseInputStyles} h-28`} required />
      </div>
    </Question>
    <Question label="What specific technical skills do you have? (e.g., Python, SQL, AutoCAD)*">
      <input type="text" name="technicalSkills" value={data.technicalSkills} onChange={onTextChange} className={baseInputStyles} required />
    </Question>
    <Question label="What are your biggest areas for professional growth? (e.g., public speaking)*">
      <input type="text" name="professionalGrowthAreas" value={data.professionalGrowthAreas} onChange={onTextChange} className={baseInputStyles} required />
    </Question>
    <Question label="How do you stay up-to-date with new developments in your field?*">
      <textarea name="stayingUpToDate" value={data.stayingUpToDate} onChange={onTextChange} className={`${baseInputStyles} h-24`} required />
    </Question>
  </div>
);

const Step2Career = ({ data, onTextChange, onCheckboxChange }) => (
  <div className="animate-fadeIn space-y-8">
    <h2 className="text-3xl font-bold text-slate-800 mb-8">Career Aspirations</h2>
    <Question label="What does 'success' mean to you personally?*">
      <textarea name="successMeaning" value={data.successMeaning} onChange={onTextChange} className={`${baseInputStyles} h-28`} required />
    </Question>
    <Question label="Where do you realistically see yourself in five years?*">
      <textarea name="fiveYearPlan" value={data.fiveYearPlan} onChange={onTextChange} className={`${baseInputStyles} h-28`} required />
    </Question>
    <Question label="What are the most important values in a future job?">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries({ salary: "High salary", workLifeBalance: "Work-life balance", growth: "Growth opportunities", impact: "Making an impact", stability: "Job stability", people: "Working with people" }).map(([key, label]) => (
          <CheckboxCard key={key} name={key} label={label} isChecked={data.jobValues[key]} onChange={(name) => onCheckboxChange("jobValues", name)} />
        ))}
      </div>
    </Question>
    <Question label="What are the primary challenges or opportunities in the industry you want to enter?*">
      <textarea name="industryChallenges" value={data.industryChallenges} onChange={onTextChange} className={`${baseInputStyles} h-28`} required />
    </Question>
    <Question label="What kind of company culture are you looking for?*">
      <textarea name="companyCulture" value={data.companyCulture} onChange={onTextChange} className={`${baseInputStyles} h-28`} required />
    </Question>
  </div>
);

const Step3Personal = ({ data, onTextChange }) => (
  <div className="animate-fadeIn space-y-8">
    <h2 className="text-3xl font-bold text-slate-800 mb-8">Personal Interests</h2>
    <Question label="Besides academics, what do you enjoy doing in your spare time?">
      <input type="text" name="hobbies" value={data.hobbies} onChange={onTextChange} className={baseInputStyles} />
    </Question>
    <Question label="Why is this hobby or interest important to you?">
      <textarea name="hobbyImportance" value={data.hobbyImportance} onChange={onTextChange} className={`${baseInputStyles} h-28`} />
    </Question>
    <Question label="How has this hobby influenced your perspective or academic work?">
      <textarea name="hobbyInfluence" value={data.hobbyInfluence} onChange={onTextChange} className={`${baseInputStyles} h-28`} />
    </Question>
  </div>
);

const Step4Institute = ({ data, onNestedChange }) => {
  const allRankingOptions = [
    { value: "cost", label: "Cost & Financial Aid" },
    { value: "location", label: "Location & Campus Environment" },
    { value: "programs", label: "Academic Programs & Faculty" },
    { value: "placement", label: "Placement & Internship Rate" },
    { value: "support", label: "Student Support Services" },
    { value: "campusLife", label: "Campus Life & Extracurriculars" },
  ];

  const { rank1, rank2, rank3 } = data.instituteRanking;

  const optionsForRank1 = allRankingOptions.filter(opt => opt.value !== rank2 && opt.value !== rank3);
  const optionsForRank2 = allRankingOptions.filter(opt => opt.value !== rank1 && opt.value !== rank3);
  const optionsForRank3 = allRankingOptions.filter(opt => opt.value !== rank1 && opt.value !== rank2);

  return (
    <div className="animate-fadeIn space-y-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Institute Selection</h2>
      <Question label="When choosing a college, please rank your top three criteria.*">
        <div className="space-y-4">
          <select name="rank1" value={rank1} onChange={(e) => onNestedChange("instituteRanking", e)} className={baseInputStyles} required>
            <option value="">Select 1st Priority</option>
            {optionsForRank1.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <select name="rank2" value={rank2} onChange={(e) => onNestedChange("instituteRanking", e)} className={baseInputStyles} required>
            <option value="">Select 2nd Priority</option>
            {optionsForRank2.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <select name="rank3" value={rank3} onChange={(e) => onNestedChange("instituteRanking", e)} className={baseInputStyles} required>
            <option value="">Select 3rd Priority</option>
            {optionsForRank3.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </Question>
    </div>
  );
};

