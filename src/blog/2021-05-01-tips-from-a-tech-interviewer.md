---
layout: post
title: "Tips from a Tech Interviewer (2021 Edition)"
date: 2021-05-01T13:40:00-04:00
comments: true
categories: ["interviewing"]
---

The technical interview can be one of the most dreaded parts of finding a job as a software engineer. Depending on the company where you’re interviewing, your experiences can vary widely, which makes preparing even harder.

Having been on both sides of the hiring process, I know how difficult it can be. So, I want to offer some tips for success.

Maybe these aren’t the tips you’ll need for interviews at the biggest, baddest tech companies out there, but hey, not everyone needs to work at a FAANG company. You can be perfectly happy and well-compensated at many other places, too.

So, if you’re looking for a job in tech or are planning on interviewing soon, here are my tips, broken down by interview type.

## The algorithm-y / data structure interview (or phone screen)

### What to expect:

A problem or two that involves manipulating data structures, usually in the language of your choice. The big tech companies publish guides on what to expect, and you can find a breakdown of the most common questions on LeetCode. Sometimes they’re phrased more as real-world problems rather than something straightforward, like find all the permutations of a string.

For other companies, you’ll probably get a question that’s similar to what you might find on LeetCode. They can vary a lot in difficulty, it’s true, so try to be prepared for anything by doing a variety of problems.

Sometimes these will be prompted over Google Docs, other times with a service like Coderpad. You also may be asked to code on someone else’s screen via a screenshare with remote control.


### What we're looking for:

When I proctor these kinds of questions, I’m actually not entirely basing your success on 100% accurate completion. (This varies by company and by job level.) I’m looking for evidence of a clarity of thought process and the ability to methodically break down a problem. I’m also looking for evidence that you can communicate well. It will help if you pseudocode and talk out loud.

Then, at least, even if you don’t finish the problem, I can tell where you were headed and include that in my feedback. Don’t mistake me: you definitely should know how to manipulate data structures and iterate over a collection, but if you don’t get every single task done in the exercise, that’s probably fine with me.

I know, I know, almost no one likes doing algorithm problems. But don’t forget, what is an algorithm but a set of instructions for solving a problem? You do this all the time on the job anyway! So don’t get too caught up in it, unless you’re interviewing at a big tech company. Then go ahead and panic and spend all your precious free time studying.

### How to prepare:

- Practice on LeetCode.
- Practice talking through a problem with your friends or colleagues.



## The pair programming interview

### What to expect:

An interview where you and another programmer are working on a problem “together.” For the most part, you will be expected to drive. You may be able to Google. The other programmer will be there to rubber duck and course correct, but probably won’t be too helpful in terms of coming up with an implementation strategy.

Sometimes these interviews can be conducted on Coderpad, but prepare yourself to work on someone else’s computer over a screen share, perhaps on Zoom or over Tuple. I’ve done this type of interview on both a real codebase as well as a test one. Sometimes I’ve been asked to build a game (which, for the record, I really hate. I’m not good at playing games or building them.) The goal for this interview is usually to simulate what working with you would be like on the job.

### What we're looking for:

When I conduct a pair programming interview, I am looking to confirm that a candidate can code, debug, and perhaps, more importantly, respond to feedback in real time. The teams I’ve worked on have all been highly collaborative, and pairing comes along with that territory. So, when I pair program with someone, I’m looking for strong communication skills and the ability to work with others.

It will help if you do the following during the exercise:
- Clarify the requirements with good questions.
- Restate the problem and state your assumptions.
- Know how to use debugging tools in your chosen programming language.
- Think out loud and pseudocode.
- Test your code—that it works, or better yet, with unit tests.
- Approach it with an attitude of fun.

When you think out loud, it becomes way easier for me to know what you’re thinking and course correct. To be frank, I am more likely to course correct when I don’t have to pry for your thoughts. It’s a collaborative exercise, so if you’re collaborating with me, working mostly independently but soliciting my feedback, you will perform better.

I want to know you have a strategy or that you know how to ask questions in order to figure one out. This is important: Even if you don’t finish the problem, having an outline of a plan will help.

Also definitely know how to use your debugging tools. It lets me know that you know how to solve a problem. In Rails, use a binding.pry, a byebug, or a logging statement, or open up a Rails console. Just show me you can figure out the expected inputs and outputs for your methods.

And in terms of having fun, try to have some. It’s normal to be nervous during a technical interview, but going in with the intention of having fun makes a huge difference. Read the room, obviously, but the interviews where I’ve been deliberate about setting that as a goal have been my best.

Once, for example, in an interview, I was asked what I did when bugs occurred. With a straight face, I said, “I never ship bugs. I write 100% perfect code.” I waited a beat. And then I said, “Just kidding. Of course I do. When it happens, I figure out why, then write the missing test.” My interviewer loved it. I suppose that was slightly risky, but it was also how I usually am anyway, so it gave me a good read on what working at the company would be like.

Oh, another pro tip: Maybe don’t cut off your interviewer when they’re trying to give you hints. That is disrespectful and doesn’t make anyone inclined to work with you.

### How to prepare:

- Practice pair programming on the job if you can. Talk out loud! It gets easier if you do it often.
- Otherwise, just take a deep breath and try to have fun.


## The take-home challenge

### What to expect:

A timed (or maybe untimed) challenge. You’ll usually be asked to build a few features in an app with pretty clear requirements. If they’re not clear or if you have environment setup trouble, you should follow up with your point of contact ASAP. If you’re successful, this may become the basis for an onsite pairing exercise where you’ll be asked to extend some of the functionality.

Usually the company will send you a GitHub repo at the time slot you choose. And then either you’ll be asked to push your code or package everything up and send it back to an email address. (That’s been the case for me a few times.)

### What we're looking for:

Sadly, I’ve never had the chance to review one of these! But I’ll pass along the advice others have given me.

Write
- Clear commit messages
- Functioning code
- Well-tested code

Writing clear commit messages makes your intent obvious and shows that you have a methodical approach to building a feature. Writing functioning code should be a priority, and bonus points if you write tests for everything.

In general, for all the places I’ve interviewed, creating a beautiful front-end has been less of a priority because I’m usually interviewing for fullstack roles. But if you’re a front-end dev, then it  probably makes sense to spend more of your time there.

### How to prepare:
- Work on side projects if you’re looking for your first role as an engineer. Everything gets easier with practice.
- Clear your schedule, hydrate, use the restroom, and prep some snacks. Take a deep breath, then get coding.


## The system design / architecture interview

### What to expect:

This is usually an open-ended question about designing a system. It could be anything. A learning management system, Google Docs, a to-do app.

### What we're looking for:

A lot of your success in this type of interview depends on your ability to communicate. Do you ask questions? Do you ask for feedback?

Be prepared to draw at least one diagram. You might be asked to model a domain area for an app, but you could also be asked to discuss more operational concerns, such as how to scale an application, prepare for failure, or leverage third-party services. It varies a lot. In my opinion, though, it feels most natural when the company asks you to design a system relevant to their core business. (An education company once asked me to design DataDog, and I just thought, what? Why?)

Whatever you do, don’t give up. Keep drawing, keep talking. Keep asking questions. It’s an interview, and even if your answer isn’t perfect, your thought process and ability to reason about possible solutions will provide valuable data points for the interviewer.

### How to prepare:
- Big tech companies also publish examples for these kinds of questions, and there are plenty of guides online about how to prep. So read those.
- For real-life, hands-on experience, I recommend trying to position yourself to take lead on more projects. Maybe that involves doing a spike for a big feature and writing up a design document. This kind of real-world practice will prep you for this doing the same thing under a time constraint.


## The code review interview

### What to expect:
You’ll be asked to look at a pull request and make comments.

### What we’re looking for:

Oof, I’ve never given one of these interviews either, but I’ve done them a few times. In general, I try to be as empathetic as possible, which is normally how I approach pull request reviews. I tend to add a bunch of suggestions to my review instead of submitting them one by one, so that I can leave myself notes to revisit before submitting all of them together. Look for missing tests, areas for improvement, things that could use better names.

### How to prepare:

- Be thoughtful about your own code review approach.
- Perhaps incorporate some suggestions from <a href="https://hackernoon.com/how-to-give-and-get-better-code-reviews-e011c3cda55e" target="_blank">this post</a>.


## Bonus: (The non-technical) behavioral / cultural alignment interview

### What to expect:

An interviewer or two asking you questions, probably based on the company’s stated values. Be prepared to cite specific examples. You might not have any, which is just as worthwhile bringing up, but be clear if you’re trying to stretch to make a certain experience meet the criteria.

### What we're looking for:

Concrete examples with detail and learnings. You should be able to tell a story and explain what you learned or what you would do if faced with a similar situation in the future.

### How to prepare:

Research the company’s values in advance and write down some examples where you demonstrated some of them. The exercise alone helps you jog your memory and have a handful of experiences primed for answering questions. You also might think about writing down any experiences in your career where you experienced conflict or a lot of learning. Really stressful projects are great for this, by the way.

As a junior engineer, I remember agreeing to shipping a project with ever-shifting requirements on a tight deadline. That was naive of me. Now, I know better, and I know that sometimes you can push back—either cut scope or move the deadline.


## Wrap up
Even if you don’t land the role you really wanted, don’t beat yourself up too much. Sometimes it really is just a matter of fit—what experiences and levels of expertise in certain areas a team needs. And sometimes, maybe you or your interviewer are just having a bad day. We’re all human. It happens.

Don’t forget that this process is just as much about you getting the answers you want about the culture, the product, and the team. You want to find a place where you’ll thrive, not just the place that looks good on your resume.

And there you have it, all of my tips as an interviewee and an interviewer. Godspeed, friends. You’ve got this.

