require('dotenv').config();
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

// Initialize Sequelize connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Import models
const User = require('./src/database/models/User');
const Organization = require('./src/database/models/Organization');
const ResearcherProfile = require('./src/database/models/ResearcherProfile');
const Project = require('./src/database/models/Project');
const Milestone = require('./src/database/models/Milestone');
const UserPreferences = require('./src/database/models/UserPreferences');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Check if data already exists
    const existingOrgs = await Organization.count();
    if (existingOrgs > 0) {
      console.log('⚠️  Database already contains data!');
      console.log(`Found ${existingOrgs} organizations.`);
      console.log('\nTo re-seed, you must first clear the existing data.');
      console.log('\nOptions:');
      console.log('  1. Drop all tables: npm run migrate:undo:all');
      console.log('  2. Run migrations again: npm run migrate');
      console.log('  3. Then run this seeder again\n');
      process.exit(0);
    }

    // Hash password once for all users
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // ==================== STEP 1: Create Organizations ====================
    console.log('📋 Step 1: Creating Organizations...');
    
    const organizations = await Organization.bulkCreate([
      {
        name: 'Children\'s Health Foundation',
        EIN: '12-3456789',
        mission: 'Improving pediatric healthcare access in underserved communities',
        focus_tags: 'Healthcare, Children, Education',
        compliance_flags: 'HIPAA, FERPA',
        contacts: 'contact@childrenshealth.org'
      },
      {
        name: 'Environmental Action Alliance',
        EIN: '23-4567890',
        mission: 'Protecting local ecosystems and promoting sustainable practices',
        focus_tags: 'Environment, Sustainability, Conservation',
        compliance_flags: 'EPA',
        contacts: 'info@envaction.org'
      },
      {
        name: 'Community Education Initiative',
        EIN: '34-5678901',
        mission: 'Bridging the education gap through technology and mentorship',
        focus_tags: 'Education, Technology, Youth',
        compliance_flags: 'FERPA, COPPA',
        contacts: 'hello@comedu.org'
      },
      {
        name: 'Senior Wellness Coalition',
        EIN: '45-6789012',
        mission: 'Enhancing quality of life for senior citizens through health programs',
        focus_tags: 'Healthcare, Seniors, Community',
        compliance_flags: 'HIPAA',
        contacts: 'support@seniorwellness.org'
      },
      {
        name: 'Urban Housing Project',
        EIN: '56-7890123',
        mission: 'Providing affordable housing solutions for low-income families',
        focus_tags: 'Housing, Social Justice, Community',
        compliance_flags: 'HUD',
        contacts: 'info@urbanhousing.org'
      }
    ]);
    console.log(`✓ Created ${organizations.length} organizations\n`);

    // ==================== STEP 2: Create Nonprofit Users ====================
    console.log('👥 Step 2: Creating Nonprofit Users...');
    
    const nonprofitUsers = await User.bulkCreate([
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@childrenshealth.org',
        password_hash: hashedPassword,
        role: 'nonprofit',
        account_status: 'active'
      },
      {
        name: 'Michael Chen',
        email: 'michael.c@envaction.org',
        password_hash: hashedPassword,
        role: 'nonprofit',
        account_status: 'active'
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.r@comedu.org',
        password_hash: hashedPassword,
        role: 'nonprofit',
        account_status: 'active'
      },
      {
        name: 'David Thompson',
        email: 'david.t@seniorwellness.org',
        password_hash: hashedPassword,
        role: 'nonprofit',
        account_status: 'active'
      },
      {
        name: 'Jennifer Martinez',
        email: 'jennifer.m@urbanhousing.org',
        password_hash: hashedPassword,
        role: 'nonprofit',
        account_status: 'active'
      }
    ]);
    console.log(`✓ Created ${nonprofitUsers.length} nonprofit users\n`);

    // ==================== Link Nonprofits to Organizations ====================
    console.log('🔗 Step 2.5: Linking Nonprofit Users to Organizations...');
    
    for (let i = 0; i < nonprofitUsers.length; i++) {
      await organizations[i].update({ user_id: nonprofitUsers[i].id });
    }
    console.log(`✓ Linked ${nonprofitUsers.length} users to organizations\n`);

    //==================== STEP 3: Create Researcher Users ====================
    console.log('👨‍🔬 Step 3: Creating Researcher User Accounts...');
    
    const researcherUsers = await User.bulkCreate([
      {
        name: 'Dr. Amanda Foster',
        email: 'amanda.foster@stanford.edu',
        password_hash: hashedPassword,
        role: 'researcher',
        account_status: 'active'
      },
      {
        name: 'Dr. James Liu',
        email: 'james.liu@mit.edu',
        password_hash: hashedPassword,
        role: 'researcher',
        account_status: 'active'
      },
      {
        name: 'Dr. Maria Santos',
        email: 'maria.santos@berkeley.edu',
        password_hash: hashedPassword,
        role: 'researcher',
        account_status: 'active'
      },
      {
        name: 'Dr. Robert Kim',
        email: 'robert.kim@jhu.edu',
        password_hash: hashedPassword,
        role: 'researcher',
        account_status: 'active'
      },
      {
        name: 'Dr. Lisa Anderson',
        email: 'lisa.anderson@columbia.edu',
        password_hash: hashedPassword,
        role: 'researcher',
        account_status: 'active'
      },
      {
        name: 'Dr. Kevin Patel',
        email: 'kevin.patel@harvard.edu',
        password_hash: hashedPassword,
        role: 'researcher',
        account_status: 'active'
      }
    ]);
    console.log(`✓ Created ${researcherUsers.length} researcher user accounts\n`);

    // ==================== STEP 4: Create Researcher Profiles ====================
    console.log('🔬 Step 4: Creating Researcher Profiles...');
    
    const researchers = await ResearcherProfile.bulkCreate([
      {
        user_id: researcherUsers[0].id,
        affiliation: 'Stanford University',
        expertise: 'Public Health, Epidemiology, Data Analysis',
        methods: 'Quantitative Research, Statistical Analysis, Survey Design',
        compliance_certifications: 'HIPAA, IRB Certified',
        availability_hours: 20,
        rate_min: 75,
        rate_max: 150
      },
      {
        user_id: researcherUsers[1].id,
        affiliation: 'MIT Environmental Lab',
        expertise: 'Environmental Science, GIS Mapping, Climate Change',
        methods: 'Field Research, Remote Sensing, Data Visualization',
        compliance_certifications: 'EPA Certified',
        availability_hours: 15,
        rate_min: 100,
        rate_max: 200
      },
      {
        user_id: researcherUsers[2].id,
        affiliation: 'UC Berkeley Education Dept',
        expertise: 'Educational Technology, Learning Analytics, Curriculum Design',
        methods: 'Qualitative Research, Mixed Methods, User Testing',
        compliance_certifications: 'FERPA, CITI Training',
        availability_hours: 25,
        rate_min: 60,
        rate_max: 120
      },
      {
        user_id: researcherUsers[3].id,
        affiliation: 'Johns Hopkins School of Nursing',
        expertise: 'Geriatric Care, Health Outcomes, Quality Improvement',
        methods: 'Clinical Trials, Observational Studies, Meta-Analysis',
        compliance_certifications: 'HIPAA, GCP Certified',
        availability_hours: 10,
        rate_min: 90,
        rate_max: 180
      },
      {
        user_id: researcherUsers[4].id,
        affiliation: 'Columbia University School of Social Work',
        expertise: 'Housing Policy, Social Determinants of Health, Community Development',
        methods: 'Case Studies, Ethnography, Community-Based Research',
        compliance_certifications: 'IRB, Human Subjects Research',
        availability_hours: 30,
        rate_min: 50,
        rate_max: 100
      },
      {
        user_id: researcherUsers[5].id,
        affiliation: 'Harvard T.H. Chan School of Public Health',
        expertise: 'Biostatistics, Machine Learning, Predictive Modeling',
        methods: 'Statistical Modeling, R/Python Programming, Database Management',
        compliance_certifications: 'HIPAA, Data Security Certified',
        availability_hours: 18,
        rate_min: 120,
        rate_max: 250
      }
    ]);
    console.log(`✓ Created ${researchers.length} researcher profiles\n`);

    // ==================== STEP 5: Create Admin User ====================
    console.log('👑 Step 5: Creating Admin User...');
    
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@trident.org',
      password_hash: hashedPassword,
      role: 'admin',
      account_status: 'active'
    });
    console.log(`✓ Created admin user\n`);

    // ==================== STEP 6: Create User Preferences ====================
    console.log('⚙️ Step 6: Creating User Preferences...');
    
    const allUsers = [...nonprofitUsers, ...researcherUsers, adminUser];
    const preferences = await UserPreferences.bulkCreate(
      allUsers.map(user => ({
        user_id: user.id,
        email_new_matches: true,
        email_messages: true,
        email_milestones: true,
        email_project_updates: true,
        email_weekly_digest: true,
        email_applications: true,
        email_agreements: true,
        inapp_new_matches: true,
        inapp_messages: true,
        inapp_milestones: true,
        inapp_project_updates: true
      }))
    );
    console.log(`✓ Created ${preferences.length} user preference records\n`);

    // ==================== STEP 7: Create Projects ====================
    console.log('📊 Step 7: Creating Projects...');
    
    const projects = await Project.bulkCreate([
      // Children's Health Foundation Projects
      {
        title: 'Childhood Asthma Intervention Study',
        problem: 'High rates of asthma in urban children due to air quality and lack of proper management',
        outcomes: 'Reduce asthma-related hospitalizations by 30% through education and monitoring program',
        methods_required: 'Quantitative Research, Statistical Analysis, Survey Design',
        timeline: '6 months',
        budget_min: 15000,
        data_sensitivity: 'High',
        status: 'open',
        org_id: organizations[0].id
      },
      {
        title: 'Pediatric Nutrition Database Development',
        problem: 'Need comprehensive database of nutritional interventions for underweight children',
        outcomes: 'Create searchable database of evidence-based nutrition programs',
        methods_required: 'Database Management, Literature Review, Data Visualization',
        timeline: '4 months',
        budget_min: 8000,
        data_sensitivity: 'Medium',
        status: 'open',
        org_id: organizations[0].id
      },
      {
        title: 'Mental Health Screening Tool Validation',
        problem: 'Current screening tools not culturally appropriate for diverse communities',
        outcomes: 'Validate and adapt screening tool for multi-cultural pediatric population',
        methods_required: 'Qualitative Research, Survey Design, Statistical Analysis',
        timeline: '8 months',
        budget_min: 20000,
        data_sensitivity: 'High',
        status: 'draft',
        org_id: organizations[0].id
      },
      
      // Environmental Action Alliance Projects
      {
        title: 'Urban Green Space Impact Assessment',
        problem: 'Unknown impact of new park developments on local biodiversity and air quality',
        outcomes: 'Measure environmental and community health benefits of urban green spaces',
        methods_required: 'Field Research, GIS Mapping, Statistical Analysis',
        timeline: '12 months',
        budget_min: 25000,
        data_sensitivity: 'Low',
        status: 'open',
        org_id: organizations[1].id
      },
      {
        title: 'Community Composting Behavior Study',
        problem: 'Low adoption rates of composting despite free bin distribution',
        outcomes: 'Identify barriers and motivators for composting adoption',
        methods_required: 'Survey Design, Qualitative Research, Data Analysis',
        timeline: '3 months',
        budget_min: 5000,
        data_sensitivity: 'Low',
        status: 'in_progress',
        org_id: organizations[1].id
      },
      
      // Community Education Initiative Projects
      {
        title: 'Digital Literacy Program Evaluation',
        problem: 'Need to assess effectiveness of coding bootcamp for underserved youth',
        outcomes: 'Evaluate learning outcomes and long-term skill retention',
        methods_required: 'Mixed Methods, User Testing, Statistical Analysis',
        timeline: '5 months',
        budget_min: 12000,
        data_sensitivity: 'Medium',
        status: 'open',
        org_id: organizations[2].id
      },
      {
        title: 'Virtual Tutoring Platform Optimization',
        problem: 'High dropout rates in online tutoring program',
        outcomes: 'Identify UX improvements to increase student engagement and completion',
        methods_required: 'User Testing, Data Visualization, A/B Testing',
        timeline: '4 months',
        budget_min: 10000,
        data_sensitivity: 'Medium',
        status: 'open',
        org_id: organizations[2].id
      },
      
      // Senior Wellness Coalition Projects
      {
        title: 'Fall Prevention Intervention Trial',
        problem: 'High rates of falls among seniors living independently',
        outcomes: 'Test effectiveness of balance training program on fall prevention',
        methods_required: 'Clinical Trials, Statistical Analysis, Observational Studies',
        timeline: '10 months',
        budget_min: 30000,
        data_sensitivity: 'High',
        status: 'open',
        org_id: organizations[3].id
      },
      {
        title: 'Social Isolation Measurement Tool',
        problem: 'Lack of validated tool to measure social isolation in elderly',
        outcomes: 'Develop and validate assessment tool for social connectedness',
        methods_required: 'Survey Design, Statistical Analysis, Psychometrics',
        timeline: '6 months',
        budget_min: 18000,
        data_sensitivity: 'Medium',
        status: 'draft',
        org_id: organizations[3].id
      },
      
      // Urban Housing Project
      {
        title: 'Housing Stability Outcomes Research',
        problem: 'Need evidence of how stable housing affects family health and education',
        outcomes: 'Document long-term outcomes for families receiving housing assistance',
        methods_required: 'Case Studies, Ethnography, Longitudinal Analysis',
        timeline: '18 months',
        budget_min: 35000,
        data_sensitivity: 'High',
        status: 'open',
        org_id: organizations[4].id
      },
      {
        title: 'Affordable Housing Needs Assessment',
        problem: 'Outdated data on housing needs in rapidly growing neighborhoods',
        outcomes: 'Comprehensive assessment of affordable housing demand and gaps',
        methods_required: 'Survey Design, GIS Mapping, Statistical Analysis',
        timeline: '5 months',
        budget_min: 15000,
        data_sensitivity: 'Low',
        status: 'completed',
        org_id: organizations[4].id
      }
    ]);
    console.log(`✓ Created ${projects.length} projects\n`);

    // ==================== STEP 8: Create Milestones ====================
    console.log('🎯 Step 8: Creating Milestones...');
    
    const today = new Date();
    const futureDate = (days) => {
      const date = new Date(today);
      date.setDate(date.getDate() + days);
      return date.toISOString().split('T')[0];
    };
    const pastDate = (days) => {
      const date = new Date(today);
      date.setDate(date.getDate() - days);
      return date.toISOString().split('T')[0];
    };

    const milestones = await Milestone.bulkCreate([
      // Project 1: Childhood Asthma Study (open)
      {
        project_id: projects[0].project_id,
        name: 'IRB Approval Submission',
        due_date: futureDate(14),
        status: 'pending'
      },
      {
        project_id: projects[0].project_id,
        name: 'Recruit Study Participants',
        description: 'Recruit 200 children aged 5-12 with asthma diagnosis',
        due_date: futureDate(60),
        status: 'pending'
      },
      {
        project_id: projects[0].project_id,
        name: 'Baseline Data Collection',
        description: 'Complete baseline surveys and health assessments',
        due_date: futureDate(90),
        status: 'pending'
      },
      
      // Project 2: Pediatric Nutrition Database (open)
      {
        project_id: projects[1].project_id,
        name: 'Literature Review Complete',
        description: 'Systematic review of peer-reviewed nutrition interventions',
        due_date: futureDate(30),
        status: 'in_progress'
      },
      {
        project_id: projects[1].project_id,
        name: 'Database Schema Design',
        description: 'Finalize database structure and fields',
        due_date: futureDate(45),
        status: 'pending'
      },
      
      // Project 4: Urban Green Space (open)
      {
        project_id: projects[3].project_id,
        name: 'Site Selection and Baseline Assessment',
        description: 'Select 10 urban parks for study and conduct initial surveys',
        due_date: futureDate(21),
        status: 'in_progress'
      },
      {
        project_id: projects[3].project_id,
        name: 'Install Air Quality Monitors',
        description: 'Deploy monitoring equipment at all sites',
        due_date: futureDate(45),
        status: 'pending'
      },
      {
        project_id: projects[3].project_id,
        name: 'Biodiversity Survey Round 1',
        description: 'Complete first round of species counts and habitat assessment',
        due_date: futureDate(90),
        status: 'pending'
      },
      
      // Project 5: Community Composting (in_progress)
      {
        project_id: projects[4].project_id,
        name: 'Survey Design and Testing',
        description: 'Develop and pilot test community survey instrument',
        due_date: pastDate(10),
        status: 'completed',
        completed_at: new Date(pastDate(12))
      },
      {
        project_id: projects[4].project_id,
        name: 'Community Survey Distribution',
        description: 'Distribute surveys to 500 households',
        due_date: pastDate(2),
        status: 'completed',
        completed_at: new Date(pastDate(5))
      },
      {
        project_id: projects[4].project_id,
        name: 'Data Analysis',
        description: 'Analyze survey responses and identify key themes',
        due_date: futureDate(15),
        status: 'in_progress'
      },
      {
        project_id: projects[4].project_id,
        name: 'Final Report Delivery',
        description: 'Complete final report with recommendations',
        due_date: futureDate(30),
        status: 'pending'
      },
      
      // Project 6: Digital Literacy Evaluation (open)
      {
        project_id: projects[5].project_id,
        name: 'Evaluation Framework Design',
        description: 'Design comprehensive evaluation methodology',
        due_date: futureDate(20),
        status: 'pending'
      },
      {
        project_id: projects[5].project_id,
        name: 'Pre-Program Assessments',
        description: 'Conduct baseline skills assessments for all participants',
        due_date: futureDate(40),
        status: 'pending'
      },
      
      // Project 8: Fall Prevention Trial (open)
      {
        project_id: projects[7].project_id,
        name: 'Protocol Development',
        description: 'Develop detailed trial protocol and safety procedures',
        due_date: futureDate(25),
        status: 'in_progress'
      },
      {
        project_id: projects[7].project_id,
        name: 'Recruit Senior Participants',
        description: 'Enroll 150 seniors aged 65+ into study',
        due_date: futureDate(60),
        status: 'pending'
      },
      {
        project_id: projects[7].project_id,
        name: 'Baseline Balance Testing',
        description: 'Complete initial balance and mobility assessments',
        due_date: futureDate(75),
        status: 'pending'
      },
      
      // Project 10: Housing Stability Research (open)
      {
        project_id: projects[9].project_id,
        name: 'Identify Case Study Families',
        description: 'Select 30 families for longitudinal case studies',
        due_date: futureDate(30),
        status: 'pending'
      },
      {
        project_id: projects[9].project_id,
        name: 'Initial Interviews',
        description: 'Conduct baseline interviews with all families',
        due_date: futureDate(90),
        status: 'pending'
      },
      
      // Project 11: Housing Needs Assessment (completed)
      {
        project_id: projects[10].project_id,
        name: 'Survey Design',
        description: 'Design comprehensive housing needs survey',
        due_date: pastDate(120),
        status: 'completed',
        completed_at: new Date(pastDate(125))
      },
      {
        project_id: projects[10].project_id,
        name: 'Data Collection',
        description: 'Collect survey data from 1000 households',
        due_date: pastDate(60),
        status: 'completed',
        completed_at: new Date(pastDate(65))
      },
      {
        project_id: projects[10].project_id,
        name: 'Analysis and Report',
        description: 'Complete analysis and deliver final report',
        due_date: pastDate(10),
        status: 'completed',
        completed_at: new Date(pastDate(12))
      }
    ]);
    console.log(`✓ Created ${milestones.length} milestones\n`);

    // ==================== STEP 9: Summary ====================
    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Summary of Created Records:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Organizations:          ${organizations.length}`);
    console.log(`Nonprofit Users:        ${nonprofitUsers.length}`);
    console.log(`Researcher Profiles:    ${researchers.length}`);
    console.log(`Researcher Users:       ${researcherUsers.length}`);
    console.log(`Admin Users:            1`);
    console.log(`Total Users:            ${allUsers.length}`);
    console.log(`User Preferences:       ${preferences.length}`);
    console.log(`Projects:               ${projects.length}`);
    console.log(`Milestones:             ${milestones.length}`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📝 Login Credentials:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('All users have password: Password123!');
    console.log('');
    console.log('ADMIN:');
    console.log('  Email: admin@trident.org');
    console.log('');
    console.log('NONPROFITS:');
    nonprofitUsers.forEach((user, i) => {
      console.log(`  ${user.email.padEnd(35)} | ${organizations[i].name}`);
    });
    console.log('');
    console.log('RESEARCHERS:');
    researcherUsers.forEach((user, i) => {
      console.log(`  ${user.email.padEnd(35)} | ${researchers[i].affiliation}`);
    });
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run seeding
seedDatabase();
