import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // For demo purposes, returning sample data
    // In a real implementation, you would integrate with Google Custom Search API
    // or your preferred search service
    const sampleResults: SearchResult[] = [
      {
        kind: "customsearch#result",
        title: "Anthony Weathers - Full-Stack Software Engineer | Python | Java",
        htmlTitle: "Anthony Weathers - Full-Stack <b>Software Engineer</b> | <b>Python</b> | <b>Java</b>",
        link: "https://www.linkedin.com/in/anthony-weathers-4316101a9",
        snippet: "Full-Stack Software Engineer | Python | Java | React | Javascript | Node.js",
        htmlSnippet: "Full-Stack <b>Software Engineer</b> | <b>Python</b> | <b>Java</b> | <b>React</b> | <b>Javascript</b> | <b>Node</b>.<b>js</b>",
        formattedUrl: "https://www.linkedin.com/in/anthony-weathers-4316101a9",
        htmlFormattedUrl: "https://www.<b>linkedin.com/in</b>/anthony-weathers-4316101a9",
        image: "https://media.licdn.com/dms/image/v2/D5603AQHn1gWmRiLnJw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1716404690524?e=2147483647&v=beta&t=vez1Ha6ZjN2jds5JNc7tLhucLXk0kULHkSMAbeoc6jY",
        description: "Full-Stack Software Engineer | Python | Java | React | Javascript | Node.js | PostgreSQL | Software Developer continually looking to improve skills, learn and try out new technologies. Current skills/technologies: Languages | Python | Javascript | Java | C++ | Matlab | CSS | HTML5 | SQL Frameworks & Libraries | Flask | Flask-Login | Flask-WTForms | Jinja | Jest | Selenium Database & Industry Tools | PostgreSQL | Git | Github | AWS | React · Experience: One Community Global · Education: Devmountain · Location: Fresno · 500+ connections on LinkedIn."
      },
      {
        kind: "customsearch#result", 
        title: "Sarah Johnson - Frontend Developer | React | TypeScript",
        htmlTitle: "Sarah Johnson - <b>Frontend Developer</b> | <b>React</b> | <b>TypeScript</b>",
        link: "https://www.linkedin.com/in/sarah-johnson-frontend",
        snippet: "Frontend Developer specializing in React, TypeScript, and modern web technologies",
        htmlSnippet: "<b>Frontend Developer</b> specializing in <b>React</b>, <b>TypeScript</b>, and modern web technologies",
        formattedUrl: "https://www.linkedin.com/in/sarah-johnson-frontend",
        htmlFormattedUrl: "https://www.<b>linkedin.com/in</b>/sarah-johnson-frontend",
        description: "Frontend Developer with 5+ years of experience building modern web applications. Technologies: Languages | JavaScript | TypeScript | HTML5 | CSS3 | SCSS Frameworks & Libraries | React | Next.js | Vue.js | Angular | Tailwind CSS | Material-UI | Styled Components Database & Industry Tools | Git | GitHub | Webpack | Vite | Jest | Cypress | Figma · Experience: Tech Startup Inc · Education: University of California · Location: San Francisco · 1000+ connections on LinkedIn."
      },
      {
        kind: "customsearch#result",
        title: "Michael Chen - Backend Engineer | Node.js | Python | AWS", 
        htmlTitle: "Michael Chen - <b>Backend Engineer</b> | <b>Node.js</b> | <b>Python</b> | <b>AWS</b>",
        link: "https://www.linkedin.com/in/michael-chen-backend",
        snippet: "Senior Backend Engineer with expertise in scalable systems and cloud architecture",
        htmlSnippet: "Senior <b>Backend Engineer</b> with expertise in scalable systems and cloud architecture",
        formattedUrl: "https://www.linkedin.com/in/michael-chen-backend", 
        htmlFormattedUrl: "https://www.<b>linkedin.com/in</b>/michael-chen-backend",
        description: "Senior Backend Engineer specializing in distributed systems and cloud infrastructure. Technologies: Languages | Python | Node.js | Go | Java | TypeScript | SQL Frameworks & Libraries | Express.js | FastAPI | Django | Flask | GraphQL | REST APIs Database & Industry Tools | PostgreSQL | MongoDB | Redis | Docker | Kubernetes | AWS | Azure | Terraform · Experience: Amazon Web Services · Education: Stanford University · Location: Seattle · 2000+ connections on LinkedIn."
      }
    ];

    // Filter results based on query (simple keyword matching for demo)
    const filteredResults = sampleResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.snippet.toLowerCase().includes(query.toLowerCase()) ||
      (result.description && result.description.toLowerCase().includes(query.toLowerCase()))
    );

    return NextResponse.json({
      results: filteredResults,
      searchTime: 0.45,
      totalResults: filteredResults.length
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/* 
To integrate with Google Custom Search API, replace the sample data section with:

const response = await fetch(
  `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`
);

const data = await response.json();
const results = data.items || [];

return NextResponse.json({
  results: results,
  searchTime: data.searchInformation?.searchTime,
  totalResults: data.searchInformation?.totalResults
});
*/
