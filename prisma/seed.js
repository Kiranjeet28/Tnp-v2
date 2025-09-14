const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample posts rewritten for "Engineering Departments"
const samplePosts = [
  {
    title: "Mechanical Engineering: Robotics Lab Upgrade",
    content: `
      <h2>Robotics Lab Upgrade Announcement</h2>
      <p>The Mechanical Engineering department has upgraded its robotics lab with new industrial robots and automation kits. Students can now access advanced equipment for hands-on learning and research.</p>
      <h3>Highlights:</h3>
      <ul>
        <li>New ABB and KUKA robotic arms</li>
        <li>PLC and automation training modules</li>
        <li>Open lab hours for project work</li>
      </ul>
      <p>Contact the lab coordinator for access and training schedules.</p>
    `,
    excerpt: "Mechanical Engineering robotics lab upgraded with new industrial robots and automation kits.",
    tags: ["mechanical", "robotics", "lab", "automation", "upgrade"],
    department: "Mechanical Engineering",
    LastSubmittedAt: new Date('2025-09-15T10:00:00Z'),
    CGPA: 7.0
  },
  {
    title: "Civil Engineering: Bridge Design Competition",
    content: `
      <h2>Annual Bridge Design Competition</h2>
      <p>The Civil Engineering department invites students to participate in the annual bridge design competition. Teams will design and build model bridges judged on strength, efficiency, and innovation.</p>
      <h3>Details:</h3>
      <ul>
        <li>Registration deadline: October 10, 2025</li>
        <li>Materials provided by department</li>
        <li>Cash prizes for top 3 teams</li>
      </ul>
      <p>Register online or contact your faculty advisor for more information.</p>
    `,
    excerpt: "Civil Engineering hosts bridge design competition with prizes for innovative student teams.",
    tags: ["civil", "competition", "bridge", "design", "event"],
    department: "Civil Engineering",
    LastSubmittedAt: new Date('2025-10-10T17:00:00Z'),
    CGPA: 6.5
  },
  {
    title: "Electrical Engineering: IoT Workshop Series",
    content: `
      <h2>IoT Workshop Series</h2>
      <p>The Electrical Engineering department is organizing a series of workshops on Internet of Things (IoT) applications. Topics include sensor integration, wireless communication, and cloud connectivity.</p>
      <h3>Schedule:</h3>
      <ul>
        <li>Week 1: Sensors and Microcontrollers</li>
        <li>Week 2: Wireless Protocols</li>
        <li>Week 3: Cloud Platforms</li>
      </ul>
      <p>Open to all engineering students. Register via the department portal.</p>
    `,
    excerpt: "Electrical Engineering offers IoT workshops covering sensors, wireless, and cloud platforms.",
    tags: ["electrical", "iot", "workshop", "sensors", "cloud"],
    department: "Electrical Engineering",
    LastSubmittedAt: new Date('2025-09-25T15:00:00Z'),
    CGPA: 7.2
  },
  {
    title: "Computer Engineering: Hackathon 2025",
    content: `
      <h2>Hackathon 2025: Code for Change</h2>
      <p>The Computer Engineering department announces Hackathon 2025, focusing on solutions for smart campuses and sustainability. Teams will develop apps and systems to improve campus life.</p>
      <h3>Tracks:</h3>
      <ul>
        <li>Smart Energy Management</li>
        <li>Campus Safety</li>
        <li>Student Services Automation</li>
      </ul>
      <p>Winners receive internships and cash prizes. Register by September 30.</p>
    `,
    excerpt: "Computer Engineering Hackathon 2025 focuses on smart campus and sustainability solutions.",
    tags: ["computer", "hackathon", "smart-campus", "sustainability", "coding"],
    department: "Computer Engineering",
    LastSubmittedAt: new Date('2025-09-30T23:59:59Z'),
    CGPA: 7.8
  },
  {
    title: "Electronics Engineering: VLSI Design Seminar",
    content: `
      <h2>VLSI Design Seminar</h2>
      <p>The Electronics Engineering department is hosting a seminar on VLSI design trends and industry practices. Guest speakers from leading semiconductor companies will share insights.</p>
      <h3>Topics:</h3>
      <ul>
        <li>Latest VLSI technologies</li>
        <li>EDA tools and workflows</li>
        <li>Career opportunities in semiconductor industry</li>
      </ul>
      <p>Open to all students. Certificates provided for attendees.</p>
    `,
    excerpt: "Electronics Engineering hosts VLSI seminar with industry experts and career guidance.",
    tags: ["electronics", "vlsi", "seminar", "industry", "career"],
    department: "Electronics Engineering",
    LastSubmittedAt: new Date('2025-10-05T14:00:00Z'),
    CGPA: 7.4
  }
];

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('🗑️  Clearing existing posts...');
    await prisma.post.deleteMany({});
    console.log('📝 Creating sample posts...');
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
    const totalPosts = await prisma.post.count();
    console.log(`📊 Total posts in database: ${totalPosts}`);
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

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
