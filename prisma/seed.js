const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const samplePosts = [
  {
    title: "New Academic Year 2025-26 Admissions Open",
    content: `
      <h2>Admissions Now Open for Academic Year 2025-26</h2>
      <p>We are excited to announce that admissions for the academic year 2025-26 are now open across all departments. This year, we are introducing new programs and enhanced facilities to provide students with cutting-edge education.</p>
      
      <h3>Key Highlights:</h3>
      <ul>
        <li>New AI and Machine Learning specialization</li>
        <li>Updated curriculum aligned with industry standards</li>
        <li>Enhanced laboratory facilities</li>
        <li>Increased scholarship opportunities</li>
      </ul>
      
      <h3>Application Process:</h3>
      <p>Applications can be submitted online through our portal. Please ensure all required documents are uploaded before the deadline.</p>
      
      <p><strong>Important:</strong> Candidates must meet the minimum CGPA requirement to be eligible for admission.</p>
    `,
    excerpt: "Admissions for 2025-26 are now open with new programs and enhanced facilities. Apply online before the deadline.",
    tags: ["admissions", "academic", "announcement", "2025-26"],
    department: "Admissions Office",
    LastSubmittedAt: new Date('2025-12-31T23:59:59Z'),
    CGPA: 7.5
  },
  {
    title: "Computer Science Department Workshop on Cloud Computing",
    content: `
      <h2>Cloud Computing Workshop - AWS Certification Prep</h2>
      <p>The Computer Science Department is organizing a comprehensive workshop on Cloud Computing focusing on AWS certification preparation.</p>
      
      <h3>Workshop Details:</h3>
      <ul>
        <li><strong>Duration:</strong> 5 days intensive program</li>
        <li><strong>Mode:</strong> Hybrid (Online + Offline)</li>
        <li><strong>Certification:</strong> AWS Solutions Architect Associate prep</li>
        <li><strong>Hands-on Labs:</strong> Real-world projects included</li>
      </ul>
      
      <h3>Topics Covered:</h3>
      <p>EC2, S3, RDS, Lambda, VPC, CloudFormation, Security Best Practices, Cost Optimization, and more.</p>
      
      <h3>Prerequisites:</h3>
      <p>Basic understanding of networking and programming concepts. Students should have completed at least 4 semesters.</p>
    `,
    excerpt: "Join our 5-day Cloud Computing workshop focusing on AWS certification preparation with hands-on labs and real-world projects.",
    tags: ["workshop", "cloud-computing", "aws", "certification", "computer-science"],
    department: "Computer Science",
    LastSubmittedAt: new Date('2025-10-15T17:00:00Z'),
    CGPA: 6.0
  },
  {
    title: "Annual Technical Fest 'TechnoVision 2025' Announcement",
    content: `
      <h2>TechnoVision 2025 - Innovate, Create, Celebrate!</h2>
      <p>Get ready for the most anticipated event of the year! TechnoVision 2025 is here with bigger and better competitions, workshops, and exhibitions.</p>
      
      <h3>Event Categories:</h3>
      <ul>
        <li><strong>Coding Competitions:</strong> Hackathons, Algorithm contests, App development</li>
        <li><strong>Robotics:</strong> Line following, Maze solving, Battle bots</li>
        <li><strong>Electronics:</strong> Circuit designing, Arduino projects</li>
        <li><strong>Web Development:</strong> Frontend challenges, Full-stack projects</li>
        <li><strong>AI/ML:</strong> Data science competitions, Neural network challenges</li>
      </ul>
      
      <h3>Special Attractions:</h3>
      <ul>
        <li>Guest lectures by industry experts</li>
        <li>Startup pitch competition with real funding opportunities</li>
        <li>Tech exhibition showcasing student innovations</li>
        <li>Cultural nights and entertainment programs</li>
      </ul>
      
      <h3>Prizes Worth:</h3>
      <p>₹5,00,000+ in cash prizes, internship opportunities, and certificates from leading tech companies.</p>
    `,
    excerpt: "TechnoVision 2025 is here! Join us for coding competitions, robotics, AI/ML challenges, and prizes worth ₹5,00,000+",
    tags: ["tech-fest", "competition", "hackathon", "robotics", "ai-ml", "event"],
    department: "Student Activities",
    LastSubmittedAt: new Date('2025-10-30T18:00:00Z'),
    CGPA: null
  },
  {
    title: "Scholarship Opportunities for Meritorious Students",
    content: `
      <h2>Merit-Based Scholarship Program 2025</h2>
      <p>We are pleased to announce multiple scholarship opportunities for deserving students based on academic excellence and financial need.</p>
      
      <h3>Available Scholarships:</h3>
      <ul>
        <li><strong>Excellence Scholarship:</strong> 100% tuition fee waiver</li>
        <li><strong>Merit Scholarship:</strong> 50% tuition fee waiver</li>
        <li><strong>Need-Based Aid:</strong> Variable amount based on family income</li>
        <li><strong>Sports Scholarship:</strong> For outstanding athletes</li>
        <li><strong>Research Scholarship:</strong> For students involved in research projects</li>
      </ul>
      
      <h3>Eligibility Criteria:</h3>
      <p>Students must maintain the minimum CGPA requirement throughout the scholarship period. Additional criteria may apply for specific scholarships.</p>
      
      <h3>Application Process:</h3>
      <ol>
        <li>Fill the online application form</li>
        <li>Submit required documents</li>
        <li>Attend the interview (if shortlisted)</li>
        <li>Await final results</li>
      </ol>
      
      <p><em>Don't miss this opportunity to support your educational journey!</em></p>
    `,
    excerpt: "Multiple scholarship opportunities available including 100% tuition fee waivers for meritorious students. Apply now!",
    tags: ["scholarship", "financial-aid", "merit", "education", "opportunity"],
    department: "Financial Aid Office",
    LastSubmittedAt: new Date('2025-11-30T23:59:59Z'),
    CGPA: 8.0
  },
  {
    title: "Industry Internship Drive - Summer 2025",
    content: `
      <h2>Summer Internship Opportunities 2025</h2>
      <p>Leading companies are visiting our campus for summer internship recruitment. This is an excellent opportunity to gain real-world experience and enhance your resume.</p>
      
      <h3>Participating Companies:</h3>
      <ul>
        <li>Tech Giants: Google, Microsoft, Amazon, Meta</li>
        <li>Indian IT Leaders: TCS, Infosys, Wipro, HCL</li>
        <li>Startups: Various funded startups in AI, Fintech, Healthcare</li>
        <li>Core Companies: L&T, Siemens, ABB, Schneider Electric</li>
        <li>Consulting: McKinsey, BCG, Deloitte</li>
      </ul>
      
      <h3>Internship Domains:</h3>
      <ul>
        <li>Software Development</li>
        <li>Data Science & Analytics</li>
        <li>Product Management</li>
        <li>Digital Marketing</li>
        <li>Research & Development</li>
        <li>Business Strategy</li>
      </ul>
      
      <h3>Selection Process:</h3>
      <p>Companies will conduct online assessments, technical interviews, and HR rounds. Prepare well and make the most of this opportunity!</p>
    `,
    excerpt: "Summer 2025 internship drive with top companies including Google, Microsoft, and leading startups. Multiple domains available.",
    tags: ["internship", "placement", "summer", "industry", "career"],
    department: "Placement Cell",
    LastSubmittedAt: new Date('2025-10-20T17:00:00Z'),
    CGPA: 7.0
  },
  {
    title: "Library Digital Resources and New Book Arrivals",
    content: `
      <h2>Enhanced Library Services - Digital Resources Update</h2>
      <p>Our library has significantly expanded its digital resources and received new book shipments across various departments.</p>
      
      <h3>New Digital Resources:</h3>
      <ul>
        <li><strong>IEEE Xplore Digital Library:</strong> Full access to research papers</li>
        <li><strong>ACM Digital Library:</strong> Computing and IT resources</li>
        <li><strong>Springer Nature:</strong> Science and engineering journals</li>
        <li><strong>O'Reilly Learning Platform:</strong> Tech books and courses</li>
        <li><strong>JSTOR:</strong> Academic journals across disciplines</li>
      </ul>
      
      <h3>Recent Book Acquisitions:</h3>
      <ul>
        <li>Latest editions of core Computer Science textbooks</li>
        <li>Advanced Mathematics and Statistics references</li>
        <li>Business and Management books</li>
        <li>Research methodology guides</li>
        <li>Competitive exam preparation materials</li>
      </ul>
      
      <h3>New Library Timings:</h3>
      <p><strong>Weekdays:</strong> 8:00 AM - 10:00 PM<br>
      <strong>Weekends:</strong> 9:00 AM - 6:00 PM</p>
      
      <p>Visit the library or access digital resources remotely using your student credentials.</p>
    `,
    excerpt: "Library expands digital resources with IEEE, ACM, Springer access plus new book arrivals. Extended timings now available.",
    tags: ["library", "digital-resources", "books", "research", "academic"],
    department: "Library Services",
    LastSubmittedAt: null,
    CGPA: null
  },
  {
    title: "Mental Health and Wellness Week",
    content: `
      <h2>Campus Wellness Week - Prioritizing Mental Health</h2>
      <p>Join us for a week dedicated to mental health awareness, wellness activities, and creating a supportive campus environment.</p>
      
      <h3>Scheduled Activities:</h3>
      <ul>
        <li><strong>Monday:</strong> Mental Health Awareness Session by professional counselors</li>
        <li><strong>Tuesday:</strong> Stress Management Workshop</li>
        <li><strong>Wednesday:</strong> Meditation and Mindfulness Sessions</li>
        <li><strong>Thursday:</strong> Art Therapy and Creative Expression</li>
        <li><strong>Friday:</strong> Peer Support Group Meetings</li>
        <li><strong>Weekend:</strong> Outdoor Activities and Sports</li>
      </ul>
      
      <h3>Resources Available:</h3>
      <ul>
        <li>Free counseling sessions</li>
        <li>24/7 helpline number</li>
        <li>Peer support network</li>
        <li>Online mental health resources</li>
        <li>Wellness mobile app access</li>
      </ul>
      
      <h3>Important Message:</h3>
      <p><em>Remember, seeking help is a sign of strength, not weakness. Your mental health matters, and we're here to support you every step of the way.</em></p>
    `,
    excerpt: "Campus Wellness Week focuses on mental health with counseling, workshops, meditation, and peer support activities.",
    tags: ["mental-health", "wellness", "counseling", "support", "awareness"],
    department: "Student Wellness Center",
    LastSubmittedAt: null,
    CGPA: null
  },
  {
    title: "Research Grant Funding Opportunity",
    content: `
      <h2>Research Excellence Grant Program 2025</h2>
      <p>Faculty and postgraduate students are invited to apply for research grants supporting innovative projects across various disciplines.</p>
      
      <h3>Grant Categories:</h3>
      <ul>
        <li><strong>Innovation Grant:</strong> Up to ₹10,00,000 for breakthrough research</li>
        <li><strong>Collaborative Research:</strong> Up to ₹5,00,000 for inter-departmental projects</li>
        <li><strong>Student Research:</strong> Up to ₹2,00,000 for postgraduate research</li>
        <li><strong>Equipment Grant:</strong> Up to ₹15,00,000 for research equipment</li>
      </ul>
      
      <h3>Focus Areas:</h3>
      <ul>
        <li>Artificial Intelligence and Machine Learning</li>
        <li>Sustainable Technology and Green Energy</li>
        <li>Biotechnology and Healthcare Innovation</li>
        <li>Smart Cities and IoT Solutions</li>
        <li>Data Science and Big Data Analytics</li>
        <li>Cybersecurity and Blockchain</li>
      </ul>
      
      <h3>Application Requirements:</h3>
      <p>Detailed research proposal, budget breakdown, expected outcomes, and potential impact assessment must be included.</p>
    `,
    excerpt: "Research grants up to ₹15,00,000 available for faculty and postgraduate students in AI, sustainability, biotech, and more.",
    tags: ["research", "grant", "funding", "faculty", "innovation"],
    department: "Research & Development",
    LastSubmittedAt: new Date('2025-12-15T17:00:00Z'),
    CGPA: 8.5
  }
];

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing posts (optional - remove if you want to keep existing data)
    console.log('🗑️  Clearing existing posts...');
    await prisma.post.deleteMany({});
    
    console.log('📝 Creating sample posts...');
    
    // Create posts one by one to handle any potential errors
    for (const post of samplePosts) {
      try {
        const createdPost = await prisma.post.create({
          data: post,
        });
        console.log(`✅ Created post: "${createdPost.title}"`);
      } catch (error) {
        console.error(`❌ Error creating post "${post.title}":`, error.message);
      }
    }
    
    // Verify the data
    const totalPosts = await prisma.post.count();
    console.log(`📊 Total posts in database: ${totalPosts}`);
    
    // Display some statistics
    const postsByDepartment = await prisma.post.groupBy({
      by: ['department'],
      _count: {
        department: true,
      },
    });
    
    console.log('📈 Posts by department:');
    postsByDepartment.forEach(dept => {
      console.log(`   ${dept.department || 'No Department'}: ${dept._count.department} posts`);
    });
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('💥 Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seeding function
main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });