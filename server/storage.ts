import { type Category, type Service, type Lead, type InsertCategory, type InsertService, type InsertLead } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  
  // Services
  getServices(): Promise<Service[]>;
  getServicesByCategory(categoryId: string): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  
  // Leads
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private services: Map<string, Service>;
  private leads: Map<string, Lead>;

  constructor() {
    this.categories = new Map();
    this.services = new Map();
    this.leads = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with mock data for categories and services
    const categoriesData: Category[] = [
      {
        id: "design-creative",
        name: "Design & Creative",
        description: "UI/UX Design, Wireframing, Mobile UI",
        icon: "fas fa-palette",
        slug: "design-creative",
        serviceCount: 3
      },
      {
        id: "web-development",
        name: "Web Development",
        description: "Frontend, Backend, CMS, PWA",
        icon: "fas fa-code",
        slug: "web-development",
        serviceCount: 3
      },
      {
        id: "mobile-app-dev",
        name: "Mobile App Dev",
        description: "Android, iOS, React Native",
        icon: "fas fa-mobile-alt",
        slug: "mobile-app-dev",
        serviceCount: 3
      },
      {
        id: "ecommerce",
        name: "E-commerce",
        description: "Shopify, Magento, Custom Store",
        icon: "fas fa-shopping-cart",
        slug: "ecommerce",
        serviceCount: 2
      },
      {
        id: "devops",
        name: "DevOps",
        description: "CI/CD, Cloud Migration, Terraform",
        icon: "fas fa-cloud",
        slug: "devops",
        serviceCount: 3
      },
      {
        id: "consulting",
        name: "Consulting",
        description: "Digital Strategy, Agile Coaching",
        icon: "fas fa-chart-line",
        slug: "consulting",
        serviceCount: 2
      },
      {
        id: "crm-erp",
        name: "CRM/ERP",
        description: "Salesforce, Odoo, SAP, Zoho",
        icon: "fas fa-database",
        slug: "crm-erp",
        serviceCount: 3
      },
      {
        id: "ai-automation",
        name: "AI & Automation",
        description: "Chatbots, RPA, AI Integration",
        icon: "fas fa-robot",
        slug: "ai-automation",
        serviceCount: 2
      },
      {
        id: "seo-marketing",
        name: "SEO/Marketing",
        description: "SEO Audit, Google Ads, Analytics",
        icon: "fas fa-bullhorn",
        slug: "seo-marketing",
        serviceCount: 3
      },
      {
        id: "modernization",
        name: "Modernization",
        description: "Legacy to Microservices, Docker",
        icon: "fas fa-sync-alt",
        slug: "modernization",
        serviceCount: 2
      },
      {
        id: "qa",
        name: "QA",
        description: "Automation, Performance, Security",
        icon: "fas fa-check-circle",
        slug: "qa",
        serviceCount: 2
      },
      {
        id: "support",
        name: "Support",
        description: "Bug Fixing, SLA Support, Hosting",
        icon: "fas fa-life-ring",
        slug: "support",
        serviceCount: 2
      }
    ];

    const servicesData: Service[] = [
      // Design & Creative
      {
        id: "ui-ux-design",
        title: "UI/UX Design",
        description: "Create stunning, user-centered designs that drive engagement and conversions.",
        longDescription: "Transform your digital presence with our expert UI/UX design services. We create intuitive, beautiful interfaces that enhance user experience and drive business results through research-driven design methodologies.",
        categoryId: "design-creative",
        hourlyRate: 1200,
        monthlyRate: 180000,
        features: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing", "Responsive Design"],
        technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "Principle", "Framer"],
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "ui-ux-design"
      },
      {
        id: "wireframing",
        title: "Wireframing",
        description: "Strategic wireframing to plan your digital products effectively.",
        longDescription: "Develop comprehensive wireframes that serve as the blueprint for your digital products. Our wireframing process ensures optimal user flow and information architecture.",
        categoryId: "design-creative",
        hourlyRate: 1000,
        monthlyRate: 150000,
        features: ["Information Architecture", "User Flow Mapping", "Low-fi Wireframes", "Interactive Prototypes", "Stakeholder Review", "Documentation"],
        technologies: ["Balsamiq", "Figma", "Miro", "Draw.io", "Axure RP", "Whimsical"],
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "wireframing"
      },
      {
        id: "mobile-ui",
        title: "Mobile UI Design",
        description: "Mobile-first design solutions for iOS and Android applications.",
        longDescription: "Create compelling mobile user interfaces that provide exceptional user experiences across iOS and Android platforms with platform-specific design guidelines.",
        categoryId: "design-creative",
        hourlyRate: 1300,
        monthlyRate: 200000,
        features: ["iOS Design Guidelines", "Material Design", "Touch Interactions", "Accessibility", "Animation Design", "Icon Design"],
        technologies: ["Figma", "Adobe XD", "Principle", "Lottie", "Zeplin", "Marvel"],
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "mobile-ui"
      },
      // Web Development
      {
        id: "frontend-development",
        title: "Frontend Development",
        description: "Create responsive, interactive user interfaces using React, Vue.js, Angular, and modern CSS frameworks.",
        longDescription: "Transform your digital presence with our expert frontend development services. We create stunning, responsive, and high-performance user interfaces that engage your users and drive business results.",
        categoryId: "web-development",
        hourlyRate: 1250,
        monthlyRate: 200000,
        features: ["Responsive Design", "Performance Optimization", "Cross-browser Compatibility", "SEO-friendly Code", "Accessibility Compliance", "Modern UI Components"],
        technologies: ["React.js", "Vue.js", "Angular", "JavaScript ES6+", "TypeScript", "Tailwind CSS", "SASS/SCSS", "Webpack"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "frontend-development"
      },
      {
        id: "backend-development",
        title: "Backend Development",
        description: "Build robust server-side applications with Node.js, Python, Java, and cloud-native architectures.",
        longDescription: "Develop scalable and secure backend systems that power your applications with modern technologies and best practices in API design, database management, and cloud deployment.",
        categoryId: "web-development",
        hourlyRate: 1500,
        monthlyRate: 250000,
        features: ["RESTful APIs", "Database Design", "Authentication & Authorization", "Microservices Architecture", "Cloud Integration", "Performance Optimization"],
        technologies: ["Node.js", "Python", "Java", "Express.js", "Django", "Spring Boot", "MongoDB", "PostgreSQL"],
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "backend-development"
      },
      {
        id: "fullstack-development",
        title: "Full Stack Development",
        description: "End-to-end web application development covering both frontend and backend technologies.",
        longDescription: "Complete web application development services from concept to deployment, handling both client-side and server-side development with modern full-stack frameworks and methodologies.",
        categoryId: "web-development",
        hourlyRate: 1800,
        monthlyRate: 300000,
        features: ["Complete Solution", "Modern Tech Stack", "Database Integration", "API Development", "DevOps Setup", "Testing & QA"],
        technologies: ["MERN Stack", "MEAN Stack", "Next.js", "Nuxt.js", "Laravel", "Django", "Ruby on Rails", "Docker"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "fullstack-development"
      },
      // Mobile App Development
      {
        id: "android-development",
        title: "Android App Development",
        description: "Native Android applications with modern development practices and Material Design.",
        longDescription: "Build powerful native Android applications using Kotlin and Java with the latest Android SDK, ensuring optimal performance and user experience across all Android devices.",
        categoryId: "mobile-app-dev",
        hourlyRate: 1400,
        monthlyRate: 220000,
        features: ["Native Performance", "Material Design", "Play Store Optimization", "Push Notifications", "Offline Support", "Security Features"],
        technologies: ["Kotlin", "Java", "Android SDK", "Jetpack Compose", "Room Database", "Retrofit", "Firebase", "Google Play Services"],
        imageUrl: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "android-development"
      },
      {
        id: "ios-development",
        title: "iOS App Development",
        description: "Native iOS applications with Swift and modern iOS development frameworks.",
        longDescription: "Develop premium iOS applications using Swift and SwiftUI, following Apple's Human Interface Guidelines to deliver exceptional user experiences on iPhone and iPad.",
        categoryId: "mobile-app-dev",
        hourlyRate: 1600,
        monthlyRate: 260000,
        features: ["Native iOS Performance", "SwiftUI", "App Store Optimization", "Core Data", "Push Notifications", "Apple Pay Integration"],
        technologies: ["Swift", "SwiftUI", "UIKit", "Core Data", "CloudKit", "Xcode", "TestFlight", "App Store Connect"],
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "ios-development"
      },
      {
        id: "react-native-development",
        title: "React Native Development",
        description: "Cross-platform mobile applications with React Native for iOS and Android.",
        longDescription: "Build cross-platform mobile applications with React Native, sharing code between iOS and Android while maintaining native performance and user experience.",
        categoryId: "mobile-app-dev",
        hourlyRate: 1350,
        monthlyRate: 210000,
        features: ["Cross-platform", "Code Reusability", "Native Performance", "Hot Reloading", "Third-party Integrations", "Over-the-air Updates"],
        technologies: ["React Native", "Expo", "TypeScript", "Redux", "React Navigation", "AsyncStorage", "Firebase", "CodePush"],
        imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "react-native-development"
      },
      // E-commerce
      {
        id: "shopify-development",
        title: "Shopify Development",
        description: "Custom Shopify stores with advanced features and integrations.",
        longDescription: "Create powerful Shopify e-commerce solutions with custom themes, apps, and integrations to maximize your online sales and provide exceptional shopping experiences.",
        categoryId: "ecommerce",
        hourlyRate: 1100,
        monthlyRate: 170000,
        features: ["Custom Themes", "App Development", "Payment Integrations", "Inventory Management", "SEO Optimization", "Analytics Setup"],
        technologies: ["Shopify Liquid", "JavaScript", "HTML/CSS", "Shopify API", "GraphQL", "Shopify CLI", "Polaris", "Webpack"],
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "shopify-development"
      },
      {
        id: "custom-ecommerce",
        title: "Custom E-commerce Store",
        description: "Fully customized e-commerce solutions tailored to your business needs.",
        longDescription: "Develop bespoke e-commerce platforms with advanced features, custom workflows, and seamless integrations to provide unique shopping experiences that drive conversions.",
        categoryId: "ecommerce",
        hourlyRate: 1700,
        monthlyRate: 280000,
        features: ["Custom Architecture", "Advanced Search", "Multi-vendor Support", "Custom Checkout", "Inventory Management", "Analytics Dashboard"],
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "PayPal", "AWS", "Redis", "Elasticsearch"],
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "custom-ecommerce"
      },
      // DevOps
      {
        id: "ci-cd-pipeline",
        title: "CI/CD Pipeline Setup",
        description: "Automated deployment pipelines for faster and reliable software delivery.",
        longDescription: "Implement robust CI/CD pipelines that automate your software delivery process, reducing deployment time and ensuring consistent, reliable releases across all environments.",
        categoryId: "devops",
        hourlyRate: 1600,
        monthlyRate: 260000,
        features: ["Automated Testing", "Deployment Automation", "Environment Management", "Rollback Strategies", "Monitoring Integration", "Security Scanning"],
        technologies: ["Jenkins", "GitLab CI", "GitHub Actions", "Docker", "Kubernetes", "Terraform", "AWS CodePipeline", "Azure DevOps"],
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "ci-cd-pipeline"
      },
      {
        id: "cloud-migration",
        title: "Cloud Migration",
        description: "Seamless migration of applications and infrastructure to cloud platforms.",
        longDescription: "Migrate your applications and infrastructure to cloud platforms with minimal downtime, ensuring scalability, security, and cost optimization throughout the process.",
        categoryId: "devops",
        hourlyRate: 1800,
        monthlyRate: 300000,
        features: ["Migration Strategy", "Minimal Downtime", "Cost Optimization", "Security Enhancement", "Performance Monitoring", "Training & Support"],
        technologies: ["AWS", "Azure", "Google Cloud", "Kubernetes", "Docker", "Terraform", "Ansible", "CloudFormation"],
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "cloud-migration"
      },
      {
        id: "infrastructure-automation",
        title: "Infrastructure as Code",
        description: "Automate infrastructure provisioning and management with Terraform and Ansible.",
        longDescription: "Implement Infrastructure as Code practices to automate provisioning, configuration, and management of your infrastructure, ensuring consistency and reducing manual errors.",
        categoryId: "devops",
        hourlyRate: 1500,
        monthlyRate: 240000,
        features: ["Automated Provisioning", "Version Control", "Disaster Recovery", "Scaling Automation", "Cost Management", "Compliance Monitoring"],
        technologies: ["Terraform", "Ansible", "CloudFormation", "Pulumi", "Chef", "Puppet", "Vagrant", "Packer"],
        imageUrl: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "infrastructure-automation"
      },
      // Consulting
      {
        id: "digital-strategy",
        title: "Digital Strategy Consulting",
        description: "Strategic planning and roadmap for digital transformation initiatives.",
        longDescription: "Develop comprehensive digital transformation strategies that align with your business goals, leveraging technology to drive growth, efficiency, and competitive advantage.",
        categoryId: "consulting",
        hourlyRate: 2000,
        monthlyRate: 350000,
        features: ["Strategic Planning", "Technology Assessment", "Roadmap Development", "Change Management", "ROI Analysis", "Implementation Support"],
        technologies: ["Business Analysis", "Enterprise Architecture", "Cloud Platforms", "Data Analytics", "Process Automation", "Change Management"],
        imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "digital-strategy"
      },
      {
        id: "agile-coaching",
        title: "Agile Coaching",
        description: "Transform your team's productivity with agile methodologies and best practices.",
        longDescription: "Implement agile methodologies across your organization to improve team collaboration, increase delivery speed, and enhance product quality through proven frameworks and practices.",
        categoryId: "consulting",
        hourlyRate: 1800,
        monthlyRate: 320000,
        features: ["Scrum Implementation", "Team Training", "Process Optimization", "Performance Metrics", "Cultural Transformation", "Continuous Improvement"],
        technologies: ["Scrum", "Kanban", "SAFe", "Jira", "Azure DevOps", "Slack", "Miro", "Retrospective Tools"],
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "agile-coaching"
      },
      // CRM/ERP
      {
        id: "salesforce-implementation",
        title: "Salesforce Implementation",
        description: "Complete Salesforce setup and customization for your business processes.",
        longDescription: "Implement and customize Salesforce CRM to streamline your sales processes, improve customer relationships, and drive revenue growth with advanced automation and analytics.",
        categoryId: "crm-erp",
        hourlyRate: 1700,
        monthlyRate: 280000,
        features: ["Custom Configuration", "Data Migration", "Workflow Automation", "Integration Setup", "User Training", "Ongoing Support"],
        technologies: ["Salesforce", "Apex", "Lightning", "Visualforce", "SOQL", "Salesforce APIs", "MuleSoft", "Tableau"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "salesforce-implementation"
      },
      {
        id: "odoo-erp",
        title: "Odoo ERP Implementation",
        description: "Comprehensive business management with Odoo ERP modules and customizations.",
        longDescription: "Implement Odoo ERP system to integrate all your business processes including accounting, inventory, sales, purchasing, and HR management in a unified platform.",
        categoryId: "crm-erp",
        hourlyRate: 1400,
        monthlyRate: 230000,
        features: ["Module Configuration", "Custom Development", "Data Migration", "Third-party Integrations", "User Training", "System Optimization"],
        technologies: ["Odoo", "Python", "PostgreSQL", "JavaScript", "XML", "REST API", "Docker", "Linux"],
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "odoo-erp"
      },
      {
        id: "sap-consulting",
        title: "SAP Consulting",
        description: "Enterprise SAP solutions and optimization for large-scale business operations.",
        longDescription: "Optimize your enterprise operations with SAP solutions, providing comprehensive consulting for implementation, migration, and enhancement of SAP systems.",
        categoryId: "crm-erp",
        hourlyRate: 2200,
        monthlyRate: 400000,
        features: ["SAP Implementation", "System Integration", "Performance Optimization", "Custom Development", "Data Migration", "Change Management"],
        technologies: ["SAP ERP", "SAP HANA", "ABAP", "SAP Fiori", "SAP Cloud", "SAP SuccessFactors", "SAP Ariba", "SAP Concur"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "sap-consulting"
      },
      // AI & Automation
      {
        id: "chatbot-development",
        title: "Chatbot Development",
        description: "Intelligent chatbots for customer service and business automation.",
        longDescription: "Develop AI-powered chatbots that provide 24/7 customer support, automate routine tasks, and enhance user engagement across multiple platforms and channels.",
        categoryId: "ai-automation",
        hourlyRate: 1600,
        monthlyRate: 260000,
        features: ["Natural Language Processing", "Multi-platform Support", "Integration Capabilities", "Analytics Dashboard", "Continuous Learning", "Human Handoff"],
        technologies: ["Dialogflow", "Microsoft Bot Framework", "Rasa", "TensorFlow", "Python", "Node.js", "AWS Lex", "Azure Bot Service"],
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "chatbot-development"
      },
      {
        id: "rpa-automation",
        title: "RPA Automation",
        description: "Robotic Process Automation to streamline repetitive business tasks.",
        longDescription: "Implement Robotic Process Automation solutions to automate repetitive, rule-based tasks, reducing errors, improving efficiency, and freeing up human resources for strategic work.",
        categoryId: "ai-automation",
        hourlyRate: 1800,
        monthlyRate: 300000,
        features: ["Process Assessment", "Bot Development", "Workflow Automation", "Exception Handling", "Performance Monitoring", "Scalability Planning"],
        technologies: ["UiPath", "Blue Prism", "Automation Anywhere", "Microsoft Power Automate", "Python", "Selenium", "OCR Technologies", "API Integration"],
        imageUrl: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "rpa-automation"
      },
      // SEO/Marketing
      {
        id: "seo-audit",
        title: "SEO Audit & Optimization",
        description: "Comprehensive SEO analysis and optimization for better search rankings.",
        longDescription: "Conduct thorough SEO audits and implement optimization strategies to improve your website's search engine rankings, organic traffic, and overall online visibility.",
        categoryId: "seo-marketing",
        hourlyRate: 1200,
        monthlyRate: 180000,
        features: ["Technical SEO", "Content Optimization", "Keyword Research", "Competitor Analysis", "Link Building", "Performance Tracking"],
        technologies: ["Google Analytics", "Search Console", "SEMrush", "Ahrefs", "Screaming Frog", "GTM", "Schema Markup", "Core Web Vitals"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "seo-audit"
      },
      {
        id: "google-ads-management",
        title: "Google Ads Management",
        description: "Strategic Google Ads campaigns for maximum ROI and lead generation.",
        longDescription: "Manage and optimize Google Ads campaigns to drive qualified traffic, generate leads, and maximize return on ad spend through data-driven strategies and continuous optimization.",
        categoryId: "seo-marketing",
        hourlyRate: 1300,
        monthlyRate: 200000,
        features: ["Campaign Strategy", "Keyword Research", "Ad Creation", "Bid Management", "Conversion Tracking", "Performance Reporting"],
        technologies: ["Google Ads", "Google Analytics", "Google Tag Manager", "Keyword Planner", "Display & Video 360", "Google Data Studio", "Conversion Tracking", "Attribution Modeling"],
        imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "google-ads-management"
      },
      {
        id: "analytics-setup",
        title: "Analytics Setup & Reporting",
        description: "Comprehensive analytics implementation for data-driven decision making.",
        longDescription: "Set up advanced analytics tracking and reporting systems to gain insights into user behavior, marketing performance, and business metrics for informed decision making.",
        categoryId: "seo-marketing",
        hourlyRate: 1100,
        monthlyRate: 170000,
        features: ["Analytics Implementation", "Custom Dashboards", "Conversion Tracking", "Audience Segmentation", "Automated Reporting", "Data Visualization"],
        technologies: ["Google Analytics 4", "Google Tag Manager", "Data Studio", "Looker", "Mixpanel", "Hotjar", "Power BI", "Custom APIs"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "analytics-setup"
      },
      // Modernization
      {
        id: "legacy-modernization",
        title: "Legacy System Modernization",
        description: "Transform legacy applications to modern, scalable architectures.",
        longDescription: "Modernize legacy systems to improve performance, scalability, and maintainability while preserving business logic and ensuring smooth migration with minimal disruption.",
        categoryId: "modernization",
        hourlyRate: 2000,
        monthlyRate: 350000,
        features: ["Architecture Assessment", "Migration Strategy", "Code Refactoring", "API Integration", "Performance Optimization", "Risk Mitigation"],
        technologies: ["Microservices", "Docker", "Kubernetes", "Cloud Platforms", "API Gateway", "Event Sourcing", "CQRS", "Domain-Driven Design"],
        imageUrl: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "legacy-modernization"
      },
      {
        id: "microservices-architecture",
        title: "Microservices Architecture",
        description: "Design and implement scalable microservices-based architectures.",
        longDescription: "Architect and implement microservices solutions that provide scalability, flexibility, and maintainability for complex enterprise applications with modern containerization.",
        categoryId: "modernization",
        hourlyRate: 1900,
        monthlyRate: 320000,
        features: ["Service Design", "Container Orchestration", "API Gateway", "Service Mesh", "Monitoring & Logging", "CI/CD Integration"],
        technologies: ["Docker", "Kubernetes", "Istio", "Kong", "Envoy", "Helm", "Prometheus", "Grafana"],
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "microservices-architecture"
      },
      // QA
      {
        id: "test-automation",
        title: "Test Automation",
        description: "Automated testing solutions for faster and more reliable software delivery.",
        longDescription: "Implement comprehensive test automation frameworks that ensure code quality, reduce testing time, and provide confidence in software releases through continuous testing.",
        categoryId: "qa",
        hourlyRate: 1400,
        monthlyRate: 220000,
        features: ["Test Framework Setup", "UI Automation", "API Testing", "Performance Testing", "CI/CD Integration", "Test Reporting"],
        technologies: ["Selenium", "Cypress", "Playwright", "Jest", "TestNG", "Postman", "JMeter", "Cucumber"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "test-automation"
      },
      {
        id: "security-testing",
        title: "Security Testing",
        description: "Comprehensive security assessments and penetration testing services.",
        longDescription: "Conduct thorough security testing and vulnerability assessments to identify and mitigate security risks, ensuring your applications meet industry security standards.",
        categoryId: "qa",
        hourlyRate: 1800,
        monthlyRate: 290000,
        features: ["Vulnerability Assessment", "Penetration Testing", "Security Code Review", "Compliance Testing", "Risk Assessment", "Security Reporting"],
        technologies: ["OWASP", "Burp Suite", "Nessus", "Metasploit", "SonarQube", "Checkmarx", "Veracode", "ZAP"],
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "security-testing"
      },
      // Support
      {
        id: "bug-fixing",
        title: "Bug Fixing & Maintenance",
        description: "Quick resolution of bugs and ongoing maintenance for your applications.",
        longDescription: "Provide rapid bug fixes and ongoing maintenance services to ensure your applications run smoothly, with minimal downtime and optimal performance.",
        categoryId: "support",
        hourlyRate: 1000,
        monthlyRate: 150000,
        features: ["Bug Analysis", "Quick Fixes", "Code Optimization", "Performance Monitoring", "Preventive Maintenance", "Documentation Updates"],
        technologies: ["Various Programming Languages", "Debugging Tools", "Monitoring Systems", "Version Control", "Issue Tracking", "Performance Tools"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "bug-fixing"
      },
      {
        id: "hosting-support",
        title: "Hosting & Infrastructure Support",
        description: "Reliable hosting solutions with 24/7 monitoring and support.",
        longDescription: "Provide comprehensive hosting and infrastructure support services including server management, monitoring, backup solutions, and 24/7 technical assistance.",
        categoryId: "support",
        hourlyRate: 800,
        monthlyRate: 120000,
        features: ["Server Management", "24/7 Monitoring", "Backup Solutions", "Security Updates", "Performance Optimization", "Technical Support"],
        technologies: ["AWS", "Azure", "Google Cloud", "cPanel", "WHM", "Docker", "Kubernetes", "Monitoring Tools"],
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "hosting-support"
      }
    ];

    categoriesData.forEach(category => {
      this.categories.set(category.id, category);
    });

    servicesData.forEach(service => {
      this.services.set(service.id, service);
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.categoryId === categoryId);
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.services.values()).find(service => service.slug === slug);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = {
      ...insertLead,
      id,
      createdAt: new Date().toISOString(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
