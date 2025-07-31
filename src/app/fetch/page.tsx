'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Search, ExternalLink, User, MapPin, Briefcase, Eye, RefreshCw, Check, ChevronsUpDown, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  image?: string;
  description?: string;
}

interface Vacancy {
  key: string;
  value: string;
}

// interface SearchResponse {
//   results: SearchResult[];
//   searchTime?: number;
//   totalResults?: number;
// }

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // Vacancy dropdown state
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState('');
  const [vacancyOpen, setVacancyOpen] = useState(false);
  const [vacanciesLoading, setVacanciesLoading] = useState(false);

  const router = useRouter();

  // Fetch vacancies on component mount
  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    setVacanciesLoading(true);
    try {
      const response = await fetch('https://n8n.srv869586.hstgr.cloud/webhook/vacancies', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vacancies');
      }

      const data: Vacancy[] = await response.json();
      setVacancies(data || []);
    } catch (err) {
      console.error('Error fetching vacancies:', err);
      // Set some sample data for demo purposes
    //   setVacancies([
    //     { key: "Software Developer", value: "The Software Developer plays a critical role in the end-to-end delivery of high-quality digital solutions." },
    //     { key: "Data Scientist", value: "Analyze complex data sets to identify trends and insights that drive business decisions." },
    //     { key: "DevOps Engineer", value: "Manage infrastructure and deployment pipelines for scalable applications." }
    //   ]);
    } finally {
      setVacanciesLoading(false);
    }
  };

  const handleVacancySelect = (vacancyKey: string) => {
    const selectedVacancyData = vacancies.find(v => v.key === vacancyKey);
    if (selectedVacancyData) {
      setSelectedVacancy(vacancyKey);
      setSearchQuery(selectedVacancyData.value);
      setVacancyOpen(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with your actual API endpoint
       const formData = new FormData();
      formData.append("jd", searchQuery);
      


      const response = await fetch('https://n8n.srv869586.hstgr.cloud/webhook/96338d64-1e9c-4771-8676-de80132a0a73', {
        method: 'POST',

        body: formData,
      });

      if (!response.ok) {
       
        throw new Error('Failed to fetch search results');
      }

      const data: SearchResult[] = await response.json();
      console.log('Search results:', data);
      setSearchResults(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // For demo purposes, set sample data
      setSearchResults([
        {
          kind: "customsearch#result",
          title: "Anthony Weathers - Full-Stack Software Engineer | Python | Java ...",
          htmlTitle: "Anthony Weathers - Full-Stack <b>Software Engineer</b> | <b>Python</b> | <b>Java</b> ...",
          link: "https://www.linkedin.com/in/anthony-weathers-4316101a9",
          snippet: "Full-Stack Software Engineer | Python | Java | React | Javascript | Node.js ... LinkedIn. View Anthony Weathers' profile on LinkedIn, a professional ...",
          htmlSnippet: "Full-Stack <b>Software Engineer</b> | <b>Python</b> | <b>Java</b> | <b>React</b> | <b>Javascript</b> | <b>Node</b>.<b>js</b> ... <b>LinkedIn</b>. View Anthony Weathers&#39; profile on <b>LinkedIn</b>, a professional&nbsp;...",
          formattedUrl: "https://www.linkedin.com/in/anthony-weathers-4316101a9",
          htmlFormattedUrl: "https://www.<b>linkedin.com/in</b>/anthony-weathers-4316101a9",
          image: "https://media.licdn.com/dms/image/v2/D5603AQHn1gWmRiLnJw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1716404690524?e=2147483647&v=beta&t=vez1Ha6ZjN2jds5JNc7tLhucLXk0kULHkSMAbeoc6jY",
          description: "Full-Stack Software Engineer | Python | Java | React | Javascript | Node.js | PostgreSQL | Software Developer continually looking to improve skills, learn and try out new technologies. · A software engineer always trying to learn new skills, knowledge and improve. Current skills/technologies: Languages | Python | Javascript | Java | C++ | Matlab | CSS | HTML5 | SQL Frameworks & Libraries | Flask | Flask-Login | Flask-WTForms | Jinja | Jest | Selenium Database & Industry Tools | PostgreSQL | Git | Github | AWS | React · Experience: One Community Global · Education: Devmountain · Location: Fresno · 500+ connections on LinkedIn. View Anthony Weathers' profile on LinkedIn, a professional community of 1 billion members."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const extractSkills = (description: string) => {
    const skillPatterns = [
      /Languages?\s*\|\s*([^·]+)/i,
      /Frameworks?\s*&?\s*Libraries?\s*\|\s*([^·]+)/i,
      /Database\s*&?\s*Industry\s*Tools?\s*\|\s*([^·]+)/i,
      /Technologies?\s*:?\s*([^·]+)/i,
    ];

    const skills: string[] = [];
    skillPatterns.forEach(pattern => {
      const match = description.match(pattern);
      if (match) {
        const skillList = match[1].split('|').map(skill => skill.trim()).filter(skill => skill);
        skills.push(...skillList);
      }
    });

    return [...new Set(skills)].slice(0, 8); // Remove duplicates and limit to 8 skills
  };

  const extractLocation = (description: string) => {
    const locationMatch = description.match(/Location:\s*([^·]+)/i);
    return locationMatch ? locationMatch[1].trim() : null;
  };

  const extractExperience = (description: string) => {
    const experienceMatch = description.match(/Experience:\s*([^·]+)/i);
    return experienceMatch ? experienceMatch[1].trim() : null;
  };

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl));
  };

  const isImageBroken = (imageUrl: string) => {
    return imageErrors.has(imageUrl);
  };

  const gotoAddJobDescription = () => {

    // Navigate to the job description page
    router.push('/add-job-description');

    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Talent Search</h1>
          <p className="text-gray-600">Find and explore professional profiles</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Vacancy Selector */}
            <div className='flex flex-row gap-3 w-full' >
                <div className='flex-1'>

 <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Job Description Template (Optional)
              </Label>
              <Popover open={vacancyOpen} onOpenChange={setVacancyOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={vacancyOpen}
                    className="w-full justify-between"
                    disabled={vacanciesLoading}
                  >
                    {vacanciesLoading ? (
                      <span className="flex items-center">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Loading job templates...
                      </span>
                    ) : selectedVacancy ? (
                      vacancies.find((vacancy) => vacancy.key === selectedVacancy)?.key
                    ) : (
                      "Select job description template..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search job templates..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No job template found.</CommandEmpty>
                      <CommandGroup>
                        {vacancies.map((vacancy) => (
                          <CommandItem
                            key={vacancy.key}
                            value={vacancy.key}
                            onSelect={() => handleVacancySelect(vacancy.key)}
                          >
                            {vacancy.key}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedVacancy === vacancy.key ? "opacity-100" : "opacity-0"
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
                 <div className="flex items-end">
                <Button 
                  onClick={gotoAddJobDescription} 
                  className="bg-teal-600 hover:bg-teal-700 h-fit"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Job Description
                </Button>
              </div>
             
            </div>

            {/* Search Input */}
            <div className="flex flex-col sm:flex-col gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                  Job Description or Search Criteria
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <Textarea
                    id="search"
                    placeholder="Enter job description or search criteria for professionals (e.g., Software Engineer with Python, React, and 5+ years experience)"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSearchQuery(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => e.key === 'Enter' && !e.shiftKey && handleSearch()}
                    className="pl-10 pr-4 min-h-[100px] resize-y"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  disabled={loading || !searchQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700 h-fit"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">Error: {error}</p>
            <p className="text-sm text-red-600 mt-1">Showing sample data for demo purposes.</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result, index) => {
                const skills = result.description ? extractSkills(result.description) : [];
                const location = result.description ? extractLocation(result.description) : null;
                const experience = result.description ? extractExperience(result.description) : null;

                return (
                  <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      {/* Profile Header */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          {result.image && !isImageBroken(result.image) ? (
                            <Image
                              src={result.image}
                              alt="Profile"
                              width={64}
                              height={64}
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                              onError={() => handleImageError(result.image!)}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {result.title.replace(' - Full-Stack Software Engineer | Python | Java ...', '')}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {result.snippet}
                          </p>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="space-y-2 mb-4">
                        {location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {location}
                          </div>
                        )}
                        {experience && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                            {experience}
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      {skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Key Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {skills.slice(0, 4).map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-sm"
                              >
                                {skill}
                              </span>
                            ))}
                            {skills.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-sm">
                                +{skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-3">
                                {result.image && !isImageBroken(result.image) ? (
                                  <Image
                                    src={result.image}
                                    alt="Profile"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 rounded-full object-cover"
                                    onError={() => handleImageError(result.image!)}
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                                <span>{result.title}</span>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {result.description && (
                                <div>
                                  <h4 className="font-semibold mb-2">Description</h4>
                                  <p className="text-gray-700 leading-relaxed">{result.description}</p>
                                </div>
                              )}
                              {skills.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Skills & Technologies</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, skillIndex) => (
                                      <span
                                        key={skillIndex}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-sm"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="pt-4 border-t">
                                <a
                                  href={result.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  View LinkedIn Profile
                                </a>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="sm" 
                          asChild
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <a
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            LinkedIn
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {searchResults.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Start Your Search</h3>
            <p className="text-gray-600">Enter keywords to find professional profiles</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Searching...</h3>
            <p className="text-gray-600">Finding matching profiles</p>
          </div>
        )}
      </div>
    </div>
  );
}
