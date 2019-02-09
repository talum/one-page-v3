import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

const projectsList = [
  {
    title: 'Registrar',
    img_url: '',
    tech: 'Phoenix',
    integrations: 'Salesforce, Stripe, Hubspot',
    description:
      'Along with a team, I built out an internal tool to help serve our growing admissions and enrollments departments. Our projects focused on streamlining admissions and billing workflows at scale as Flatiron School launched new campuses around the world. For example, we built out support for deposit as well as tuition invoices, in either installments or lump sums.',
  },
  {
    title: 'GitHub Enterprise Migration',
    img_url: '',
    tech: 'Rails',
    integrations: 'GitHub Enterprise',
    description:
      'The Learn.co platform is deeply integrated with GitHub.com and initially required all users to have GitHub accounts in order to do work. Users were tightly coupled to their GitHub accounts, so much so that we identified users by their GitHub.com usernames.  In order to remove friction from the sign-up process, we decided to create an alternate workflow where users could be linked to accounts on either or both GitHub.com and our own GitHub Enterprise server. Doing so enabled us to provision accounts for our users on sign up and create new repositories on the fly without worrying about rate limiting. This project involved rewriting our core app and associated services to be aware of both GitHub servers and enable users to switch between either platform to do work. Among the challenges were migrating user accounts from the Users table to a newly created Identities::GitHubAccounts table, and building out a Learn username generator to decouple users from their GitHub identities.',
  },
  {
    title: 'Jupyter Notebooks on Learn',
    img_url: '',
    tech: 'Phoenix, Docker, Jupyter Notebooks, React',
    integrations: 'Learn-co Gem Suite, Internal broker service',
    description:
      'As the Flatiron School planned on launching a data science curriculum, we began putting infrastructure in place to support serving Jupyter notebook lesson content in Learn. Leveraging the same backend as the Learn IDE in browser, we spun up containers running Jupyter notebook servers and served that notebook content through an iframe on a Learn lesson page. This project involved writing custom Dockerfiles to create compatible images for Jupyter notebooks, putting support for python lesson payloads into our Learn-co gem and our event broker service, and also figuring out how to securely serve content in an iframe over SSL.',
  },
  {
    title: 'Learn IDE in Browser Persistent Sandbox',
    img_url: '',
    tech: 'Phoenix, Docker',
    integrations: 'Learn-co Gem Suite, GitHub',
    description:
      'This project leveraged the IDE backend to persist work done in a sandbox repository. It uses most of the same tech as the regular old IDE for lessons with labs, except work follows students around through readmes as they navigate through the curriculum hierarchy on Learn.co.',
  },
  {
    title: 'Assignments',
    img_url: '',
    tech: 'Rails, React',
    integrations: 'Learn-co Gem Suite, GitHub',
    description:
      'One of the problems we faced as our business grew was keeping track of one-off assignments for in-person immersive students. Although the core of Learn.co is a learning management system, it delivers a rigid hierarchy of curriculum to groups of students and does not allow for tasks to be assigned to individuals. The Assignments feature addresses that problem by providing a way to assign individual students things to do, from one-off confirmable tasks to code challenges. Working closely with a team of engineers and the educational staff, I served as the project lead on this feature and ensured that we were delivering the highest value feature sets as quickly as possible.',
  },
  {
    title: 'Learn In-browser IDE',
    img_url: '',
    tech: 'React, Phoenix, Phoenix Sockets',
    integrations: '',
    description:
      'For years, the engineering team has been serving the needs of students by finding ways to help them get their development environments set up as quickly and easily as possible. That journey began with an environmentalizer bash script, led to the Learn IDE Atom fork, the Learn IDE packages for Atom, and finally the Learn IDE in browser, which connects to a Phoenix backend over websockets and pipes input and output to and from a Docker container running on a remote server.',
  },
  {
    title: 'Enrollments: Pausing & Fixed Pricing',
    img_url: '',
    tech: 'Rails',
    integrations: 'Stripe',
    description:
      "Online courses on Learn.co are billed using Stripe Subscriptions in a domain we call Enrollments. Along with our architect, I worked on migrating to a new subscription-based workflow where students can enroll for an online course with financing. This required a number of changes to the existing enrollment flow, including giving the student a 14-day window or trial period to obtain financing, creating admin-facing tools to change the student's status upon loan approval, and setting up new banners and emails to help students understand where they were in the enrollment process. In addition to that work, I paired with another developer to create a set of admin-facing tools that would enable enrollment pauses in the event that a student needed to take a leave of absence from the program.",
  },
  {
    title: 'Onboarding',
    img_url: '',
    tech: 'Rails, Backbone, Marionette',
    integrations: '',
    description:
      'In one of the first features I led as a developer, I implemented a new onboarding flow to coincide with the launch of a redesigned marketing website. This flow touched nearly all parts of our monolith application and allowed students to sign up for Learn.co and get dropped into a new intro course called Welcome to Learn. This onboarding flow enabled students to experience the magic of Learn and the Learn IDE without a GitHub account. After creating a password and connecting their GitHub account to Learn via modal prompts, students would be dropped into their program of interest.',
  },
  {
    title: 'Blogging & Magazine',
    img_url: '',
    tech: 'Rails, Backbone, Marionette',
    integrations: 'GitHub',
    description:
      "Because blogging as a developer is a good way to solidify your knowledge and share knowledge with the community, we integrated blogging into the Learn.co platform using GitHub and GitHub pages. I assisted with the initial implementation of blogging in Learn, and then built out a publicly available magazine to showcase our students' posts.",
  },
]

const Projects = () => (
  <Layout>
    <SEO title="Projects" />
    <h1 className="heading heading--level-1 util--text-align-c util--padding-bxxl">
      Projects
    </h1>
    {projectsList.map((project, i) => (
      <div key={i} className="module module--newsy util--padding-bxl">
        <div className="module__head">
          <h2 className="heading heading--level-3 util--padding-bm">
            {project.title}
          </h2>
        </div>
        <div className="module__body">
          <h3 className="heading heading--level-4">{project.tech}</h3>
          <h3 className="heading heading--level-4">{project.integrations}</h3>
          <p>{project.description}</p>
        </div>
      </div>
    ))}
  </Layout>
)

export default Projects
