/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const frameworks = [
    {
      value: "software-developer",
      label: "Software Developer",
      details: {years_of_experience: 3, job_title: "Software Developer", job_type: "Full-time",  job_description: "We are seeking a skilled Software Developer to design, build, and maintain high-quality software applications. The ideal candidate has strong proficiency in programming languages such as JavaScript, Python, Java, or C#, and experience with modern frameworks like React, Node.js, or .NET. Responsibilities include writing clean, efficient code, collaborating with cross-functional teams, debugging, and participating in all phases of the software development lifecycle. Familiarity with databases, REST APIs, Git, and web security best practices is essential. A degree in Computer Science or related field is preferred, along with knowledge of cloud platforms, DevOps practices, and Agile methodologies.", },
    },
    {
      value: "data-scientist",
      label: "Data Scientist",
      details: {years_of_experience: 2, job_title: "Data Scientist", job_type: "Part-time", job_description: "Analyze data and build predictive models.", },
    },
    {
      value: "product-manager",
      label: "Product Manager",
      details: {years_of_experience: 3, job_title: "Product Manager", job_type: "Contract", job_description: "Oversee product development and strategy.", },
    },
    {
      value: "ux-designer",
      label: "UX Designer",
      details: {years_of_experience: 4, job_title: "UX Designer", job_type: "Internship", job_description: "Design user interfaces and improve user experience.", },
    },
    {
      value: "devops-engineer",
      label: "DevOps Engineer",
      details: {years_of_experience: 5, job_title: "DevOps Engineer", job_type: "Freelance", job_description: "Manage infrastructure and deployment processes.", },
    },
    {
      value: "qa-tester",
      label: "QA Tester",
      details: {years_of_experience: 6, job_title: "QA Tester", job_type: "Full-time", job_description: "Ensure the quality of software applications through testing.", },
    },
    {
      value: "accountant",
      label: "Accountant",
      details: {years_of_experience: 5, job_title: "Accountant", job_type: "Full-time", job_description: "Manage financial records and ensure compliance with regulations.", },
    }
  ];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedFramework, setSelectedFramework] = useState(
    frameworks[0].details
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    setIsUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("data", selectedFile);
      formData.append("job_title", selectedFramework.job_title);
      formData.append("job_type", selectedFramework.job_type);
      formData.append("job_description", selectedFramework.job_description);
      formData.append("years_of_experience", selectedFramework.years_of_experience.toString());
      formData.append("vacancy", value);

      const response = await fetch(
        "https://n8n.srv869586.hstgr.cloud/webhook/00f0b559-febf-479f-8c0e-e1fe8f64c502",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setResult("Error uploading file: " + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="grid w-full max-w-sm items-center gap-3">

          {/* <Label>Select vacancy </Label> */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {value
                  ? frameworks.find((framework) => framework.value === value)
                      ?.label
                  : "Select vacancy..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search vacancy..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No vacancy found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setSelectedFramework(
                            currentValue === value
                              ? frameworks[0].details
                              : frameworks.find((f) => f.value === currentValue)!.details
                          );
                          setOpen(false);
                        }}
                      >
                        {framework.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === framework.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="resume">Resume (PDF only)</Label>
          <Input
            id="resume"
            onChange={handleFileChange}
            type="file"
            accept="application/pdf"
          />
        </div>

        {/* <input 
          type="file" 
          onChange={handleFileChange}
          title="Select a file to upload"
          className="file-input file-input-bordered file-input-primary w-full max-w-xs" 
        /> */}
        <Button onClick={handleSubmit} disabled={isUploading || !selectedFile}>
          {isUploading ? "Uploading..." : "Evaluate Resume"}
        </Button>

        {result && (
          <div className="mt-4 p-6 border rounded-lg max-w-2xl bg-gray-50">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Resume Analysis Result</h3>
            
            {/* Applicability Score */}
            <div className="mb-4 p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Applicability Score:</span>
                <span className={`text-xl font-bold px-3 py-1 rounded-full ${
                  result.applicability >= 80 ? 'bg-green-100 text-green-800' :
                  result.applicability >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {result.applicability}%
                </span>
              </div>
              {result.applicability_clarification && (
                <div className="mt-3 pt-3 border-t">
                  <span className="font-medium text-gray-700">Clarification:</span>
                  <p className="text-sm text-gray-600 mt-1">{result.applicability_clarification}</p>
                </div>
              )}
            </div>

            
            {/* Experience Match */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Years of experience</h4>
              <div className="bg-white p-3 rounded-lg border space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Candidate years of experience:</span>
                  <span>{result.years_of_experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Required years of experience:</span>
                  <span>{result.years_of_experience_required} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Years of experience Match:</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    result.years_of_experience >= result.years_of_experience_required
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.years_of_experience >= result.years_of_experience_required ? 'Match' : 'No Match'}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Personal Information</h4>
              <div className="bg-white p-3 rounded-lg border space-y-1">
                <div><span className="font-medium">Name:</span> {result.name}</div>
                <div><span className="font-medium">Email:</span> {result.email}</div>
                <div><span className="font-medium">Phone:</span> {result.phone}</div>
                <div><span className="font-medium">Education:</span> {result.education}</div>
              </div>
            </div>


            {/* Languages */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Languages</h4>
              <div className="bg-white p-3 rounded-lg border space-y-1">
                <div><span className="font-medium">English:</span> {result.english}</div>
                {result.french && <div><span className="font-medium">French:</span> {result.french}</div>}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm">{result.skills}</p>
              </div>
            </div>

            {/* Experience Summary */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Experience Summary</h4>
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm">{result.experience}</p>
              </div>
            </div>

            {/* Job Information */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Position Applied For</h4>
              <div className="bg-white p-3 rounded-lg border space-y-2">
                <div><span className="font-medium">Job Title:</span> {result.job_title}</div>
                <div><span className="font-medium">Job Type:</span> {result.job_type}</div>
                <div className="mt-2">
                  <span className="font-medium">Job Description:</span>
                  <p className="text-sm mt-1 text-gray-600">{result.job_description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
