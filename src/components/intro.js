import React from 'react'
import { Link } from 'gatsby'
import Image from './image.js'
import './intro.css'

const Intro = () => (
  <>
    <div className="flex-container">
      <div className="flex__item">
        <h1 className="heading heading--fancy">
          I am <span className="heading--highlight">Tracy Lum</span>, a
          full-stack software engineer living in New York. I write primarily
          Ruby, JavaScript, Elixir, and CSS. My passions include well-designed
          code and whimsy.
        </h1>
      </div>
      <div className="flex__item">
        <div className="module">
          <div class="img-frame img-frame--round img-frame--medium image-frame--white-border">
            <Image />
          </div>
        </div>
      </div>
    </div>
    <p>
      I also write a lot about my code, everywhere from my personal{' '}
      <Link to="/blog">blog</Link>, to my{' '}
      <a
        href="https://medium.com/flatiron-labs"
        target="_blank"
        rel="noopener noreferrer"
      >
        team's blog
      </a>
      , to{' '}
      <a
        href="https://hackernoon.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Hackernoon
      </a>
      , and{' '}
      <a href="https://dev.to/talum" target="_blank" rel="noopener noreferrer">
        dev.to
      </a>
      . I have been known to speak publicly about code, for example, at{' '}
      <a
        href="https://2018.empirejs.org/#speakers"
        target="_blank"
        rel="noopener noreferrer"
      >
        EmpireJS 2018
      </a>
      .
    </p>
    <p>
      In my spare time, I write other things too. My nonfiction work has
      appeared in{' '}
      <a
        href="https://www.bustle.com/authors/1151-tracy-lum"
        target="_blank"
        rel="noopener noreferrer"
      >
        Bustle
      </a>{' '}
      and{' '}
      <a
        href="http://thoughtcatalog.com/tracy-lum/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Thought Catalog
      </a>
      , among others. Some other hobbies I enjoy include reading,
      middle-distance running, baking, and eating a lot of ice cream.
    </p>
    <p>I am a graduate of the Flatiron School.</p>
  </>
)

export default Intro
