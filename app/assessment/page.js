"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// --- SVG Icons ---
const Icon = ({ className = 'w-6 h-6', children }) => <span className={`inline-block ${className}`}>{children}</span>;
const CheckIcon = () => <Icon><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg></Icon>;
const SpinnerIcon = () => <Icon className="w-12 h-12 text-indigo-500"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4"></path></svg></Icon>;


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
                            // Deep merge to ensure new fields are not lost if saved data is old
                            setAnswers(prev => ({...prev, ...data.answers}));
                        }
                    })
                    .catch(err => console.error("Failed to fetch assessment, starting fresh:", err))
                    .finally(() => setIsLoading(false));
            } else {
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
        if (!validateStep()) {
            alert("Please ensure all priority criteria are unique before submitting.");
            return;
        }
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
                const { rank1, rank2, rank3 } = answers.instituteRanking;
                return rank1 && rank2 && rank3;
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
    
    const animationStyles = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
    `;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center justify-center text-center p-4">
                <SpinnerIcon />
                <h1 className="text-2xl font-semibold text-slate-700 mt-4">Loading Assessment...</h1>
                <p className="text-slate-500">Please wait while we fetch your data.</p>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-3xl font-bold text-slate-800">Welcome to the Assessment</h1>
                <p className="text-slate-600 mt-2">Please sign in to begin shaping your future career path.</p>
                <button onClick={() => router.push('/sign-in')} className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105">
                    Sign In
                </button>
            </main>
        );
    }

    return (
        <>
            <style>{animationStyles}</style>
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center py-12 px-4 mt-20" >
                <div className="w-full max-w-4xl">
                    <div className="mb-10 px-4">
                        <div className="flex items-center">
                            {steps.map((step, index) => (
                                <React.Fragment key={index}>
                                    <div className="flex flex-col items-center text-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${currentStep > index ? "bg-green-500 text-white" : currentStep === index + 1 ? "bg-indigo-600 text-white scale-110 shadow-lg" : "bg-slate-200 text-slate-500"}`}>
                                            {currentStep > index ? <CheckIcon /> : index + 1}
                                        </div>
                                        <p className={`mt-2 text-xs md:text-sm font-semibold transition-colors ${currentStep >= index + 1 ? 'text-indigo-600' : 'text-slate-500'}`}>{step}</p>
                                    </div>
                                    {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 transition-colors duration-500 ${currentStep > index + 1 ? "bg-green-500" : "bg-slate-200"}`}></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 sm:p-12 border border-slate-200/80">
                        <div key={currentStep}>
                            {currentStep === 1 && <Step1Academic data={answers} onTextChange={handleTextChange} onCheckboxChange={handleCheckboxChange} />}
                            {currentStep === 2 && <Step2Career data={answers} onTextChange={handleTextChange} onCheckboxChange={handleCheckboxChange} />}
                            {currentStep === 3 && <Step3Personal data={answers} onTextChange={handleTextChange} />}
                            {currentStep === 4 && <Step4Institute data={answers} onNestedChange={handleNestedChange} />}
                        </div>

                        <div className="mt-12 pt-6 border-t flex justify-between items-center">
                            <button
                                type="button"
                                onClick={prevStep}
                                className={`px-6 py-3 rounded-lg font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all transform hover:scale-105 ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={currentStep === 1}
                            >
                                Previous
                            </button>
                            {currentStep < 4 ? (
                                <button type="button" onClick={nextStep} className="px-8 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                                    Next Step
                                </button>
                            ) : (
                                <button type="submit" disabled={isSubmitting} className={`px-8 py-3 rounded-lg font-bold text-white transition-colors flex items-center gap-2 ${isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl"}`}>
                                    {isSubmitting && <SpinnerIcon className="w-5 h-5" />}
                                    {isSubmitting ? "Submitting..." : "Submit Assessment"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

// --- Helper Components ---
const Question = ({ label, children, isRequired = false }) => (
    <div className="block mb-8">
        <span className="text-gray-800 font-semibold text-lg">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
        </span>
        <div className="mt-3">{children}</div>
    </div>
);

const CheckboxCard = ({ name, label, isChecked, onChange }) => (
    <label
        className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center group ${isChecked ? 'border-indigo-600 bg-indigo-50/70 shadow-md' : 'border-slate-300 bg-white hover:border-indigo-400'}`}
        onClick={(e) => { e.preventDefault(); onChange(name); }}
    >
        <input type="checkbox" className="hidden" checked={isChecked} readOnly />
        <span className={`font-medium transition-colors ${isChecked ? 'text-indigo-800' : 'text-slate-700 group-hover:text-indigo-700'}`}>{label}</span>
        {isChecked && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                <CheckIcon />
            </div>
        )}
    </label>
);

// --- Step Components ---
const baseInputStyles = "w-full border border-slate-300 bg-white/50 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm";
const baseTextareaStyles = `${baseInputStyles} resize-none`;

const Step1Academic = ({ data, onTextChange, onCheckboxChange }) => (
    <div className="animate-fadeIn space-y-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Academic Background & Skills</h2>
        <Question label="What were your favorite subjects in 11th and 12th, and what interested you most?" isRequired>
            <textarea name="favoriteSubjects" value={data.favoriteSubjects} onChange={onTextChange} className={`${baseTextareaStyles} h-28`} required />
        </Question>
        <Question label="How do you prefer to learn?">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries({ theoretical: "Theoretical", practical: "Practical", handsOn: "Hands-on", group: "Group work", independent: "Independent" }).map(([key, label]) => (
                    <CheckboxCard key={key} name={key} label={label} isChecked={data.learningStyle[key]} onChange={(name) => onCheckboxChange("learningStyle", name)} />
                ))}
            </div>
        </Question>
        <Question label="Describe a significant academic project or task you've worked on." isRequired>
            <div className="space-y-4">
                <textarea name="academicProject" value={data.academicProject} onChange={onTextChange} placeholder="What was the project?" className={`${baseTextareaStyles} h-20`} required />
                <textarea name="projectRole" value={data.projectRole} onChange={onTextChange} placeholder="What was your role?" className={`${baseTextareaStyles} h-20`} required />
                <textarea name="projectChallenges" value={data.projectChallenges} onChange={onTextChange} placeholder="What challenges did you face and how did you overcome them?" className={`${baseTextareaStyles} h-28`} required />
            </div>
        </Question>
        <div className="grid md:grid-cols-2 gap-8">
            <Question label="What specific technical skills do you have?" isRequired>
                <input type="text" name="technicalSkills" placeholder="e.g., Python, SQL, AutoCAD" value={data.technicalSkills} onChange={onTextChange} className={baseInputStyles} required />
            </Question>
            <Question label="Biggest areas for professional growth?" isRequired>
                <input type="text" name="professionalGrowthAreas" placeholder="e.g., public speaking, leadership" value={data.professionalGrowthAreas} onChange={onTextChange} className={baseInputStyles} required />
            </Question>
        </div>
        <Question label="How do you stay up-to-date with new developments in your field?" isRequired>
            <textarea name="stayingUpToDate" value={data.stayingUpToDate} onChange={onTextChange} className={`${baseTextareaStyles} h-24`} required />
        </Question>
    </div>
);

const Step2Career = ({ data, onTextChange, onCheckboxChange }) => (
    <div className="animate-fadeIn space-y-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Career Aspirations</h2>
        <Question label="What does 'success' mean to you personally?" isRequired>
            <textarea name="successMeaning" value={data.successMeaning} onChange={onTextChange} className={`${baseTextareaStyles} h-28`} required />
        </Question>
        <Question label="Where do you realistically see yourself in five years?" isRequired>
            <textarea name="fiveYearPlan" value={data.fiveYearPlan} onChange={onTextChange} className={`${baseTextareaStyles} h-28`} required />
        </Question>
        <Question label="What are the most important values in a future job?">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries({ salary: "High salary", workLifeBalance: "Work-life balance", growth: "Growth", impact: "Impact", stability: "Stability", people: "Teamwork" }).map(([key, label]) => (
                    <CheckboxCard key={key} name={key} label={label} isChecked={data.jobValues[key]} onChange={(name) => onCheckboxChange("jobValues", name)} />
                ))}
            </div>
        </Question>
        <Question label="Primary challenges or opportunities in your desired industry?" isRequired>
            <textarea name="industryChallenges" value={data.industryChallenges} onChange={onTextChange} className={`${baseTextareaStyles} h-28`} required />
        </Question>
        <Question label="What kind of company culture are you looking for?" isRequired>
            <textarea name="companyCulture" value={data.companyCulture} onChange={onTextChange} className={`${baseTextareaStyles} h-28`} required />
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
            <textarea name="hobbyImportance" value={data.hobbyImportance} onChange={onTextChange} className={`${baseTextareaStyles} h-28`} />
        </Question>
        <Question label="How has this hobby influenced your perspective or academic work?">
            <textarea name="hobbyInfluence" value={data.hobbyInfluence} onChange={onTextChange} className={`${baseTextareaStyles} h-28`} />
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
            <Question label="When choosing a college, please rank your top three criteria." isRequired>
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
