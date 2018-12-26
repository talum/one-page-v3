import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={['Tracy Lum', 'software engineer']} />
    <h1 className="heading heading--level-1">I am Tracy Lum,</h1>
    <p>
      a full-stack software engineer living in New York. I write primarily Ruby,
      JavaScript, Elixir, and CSS. My passions include well-designed code and
      whimsy.
    </p>
    <p>
      I also write a lot about my code, everywhere from my personal blog, to my
      team's blog, to Hackernoon, and dev.to. I have been known to speak
      publicly about code, for example, at EmpireJS 2018.
    </p>
    <p>
      In my spare time, I write other things too. My nonfiction work has
      appeared in Bustle and Thought Catalog, among others. Some other hobbies I
      enjoy include reading, middle-distance running, baking, and eating a lot
      of ice cream.
    </p>
  </Layout>
)

export default IndexPage
