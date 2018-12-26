---
layout: post
title: "How to Give and Get Better Code Reviews"
date: 2018-08-04 12:20:01 -0400
comments: true
categories: ['code review', 'team']
---

_This post originally appeared on
[Hackernoon](https://hackernoon.com/how-to-give-and-get-better-code-reviews-e011c3cda55e)._

Ask any random developer what part of their jobs they loathe the most and you’ll frequently hear the words “code review.” Code review is sometimes the step blocking you from shipping. It may even be the final thing standing between you and the end of your project sprint—the one you’ve been working on for months and can’t wait to end. More poetically, it’s a time when you, the developer, the craftsman, the artist, present your work before a council of critics and beg them to bless your masterpiece with a thumbs-up emoji and a “LGTM.”

Asking for code review puts many people on edge because for people who view programming as a craft, it is just like laying your creative soul bare. It’s like the actor auditioning for a desired role or the writer workshopping a highly personal piece for the first time. It can be a stressful and overwhelming experience, but it’s also one of the best ways to get feedback on your code, to catch typos and mistakes, and, more broadly, to grow as a developer.

Yes, receiving critical feedback can be tough, but it’s the only way you can get better. Coding, for as solitary and antisocial as it is sometimes presented in the media, is a collaborative team effort. Recognizing this, and knowing that code review is an essential part of the programming experience, you’re probably wondering if there are ways to make code review suck less for you and your engineering team. The good news is: there are! And it’s these techniques for getting and giving better code reviews I’ve learned over the past few years that I’m happy to share today.

## Getting Better Code Reviews

1. **Contextualize the problem you’re solving.** My team at the Flatiron School tracks most project work through GitHub issues, so when we open pull requests, we’ve found that linking to the GitHub issue from the body of a PR is extremely helpful for explaining the problem and the proposed resolution. As a bonus, linking to an issue from a PR using keywords will also automatically close the issue when the PR is merged. Other techniques for providing context include writing a quick summary or list of the changes, trade-offs, and remaining todos; tagging pull requests with labels; and including screenshots or gifs of functionality for front-end changes.

2. **Review your own code before you officially put it up for review.** It sounds obvious, but this is an often overlooked step of the code review process. Even looking over the diffs one more time before you ask someone else to review can help you catch typos or omissions. Or it may help you identify other issues or dependencies that block your PR from being merged. Ridding your pull request of syntactical, grammatical, and stylistic errors gives your reviewers the impression that you care and frees them up to focus on the meatier aspects of your changes. So it’s win-win. You provide a cleaner package of code, and your reviewer gives you better feedback.

3. **Annotate places where you’re especially unsure or want feedback.** As part of looking over my pull requests, I often scan my code for places where I really want feedback. I know that my teammates are busy, so in order to get the best advice, I like to direct their attention to the places where I have questions and @ mention people. Other times, I anticipate where questions will arise and leave a comment justifying my rationale for the change. This often sparks a healthy debate and leaves me with some new ideas or a different perspective.

4. **Tag the right people.** When you’re new on a team, this can be especially difficult, and there may be a temptation to throw your PR out into the wild and hope that some generous soul will take pity on you. (That’s what I tended to do as a novice.) Now, I try to identify code owners, or someone who is familiar with whatever part of the codebase I’m touching. That could be git blaming to see who touched the file last or even asking who the project or team lead for a feature was to find domain experts. By tagging people explicitly, you’ll avoid the bystander effect and likely get more actionable results. At worst, those people will point you to someone else.

5. **Take a breath and internalize the reviews.** As your PR notifications pile up, your own anxiety may begin to build. Take a deep breath and remind yourself that your team members mean well and have good intentions. (If they don’t, maybe consider joining our team?) Review the comments, respond, and do your best to incorporate the feedback or rationalize your design decision.

## Giving Better Code Reviews

1. **Ask questions.** From a writing workshop I took, I’ve learned to phrase most of my feedback as questions or ponderings. Instead of saying, “Hey, this class is garbage,” I write things like “Have you explored X idea?”, “What’s your intent with this approach?” or “I wonder if moving this line to another class would make functionality clearer?” Paying attention to phrasing and tone can change how your feedback will be received and how you as a team member are perceived. It is incredibly hard to get tone right online, so what I sometimes do just in case my feedback comes across too harsh (but mostly for the sake of whimsy), I’ll sprinkle in a couple emojis, bitmojis, and gifs. Also, don’t be afraid to talk in real life. Some ideas are better conveyed face-to-face. Plus, you could always pair on the code review too!

2. **Articulate the problems (if any) and suggest alternatives.** It can be tempting to scan some code that doesn’t pass the “squint test” and write a comment like “Oof. This is one crappy pile of spaghetti code” or “I can’t quite tell what’s wrong, but it just feels bad.” I’d suggest you don’t. (I do the latter a lot, I’m sorry to admit.) Still, I urge you instead to try really hard to articulate your criticism. Could something be refactored to be cleaner or more readable? Is there a fundamental misunderstanding of the domain? Is there something the writer just missed? Once you articulate your criticism, it’s also great to suggest several alternatives. Link to documentation or lines of code with within the codebase. You could even write a snippet to demonstrate what you mean.

3. **Try to understand the context and the proposed solution.** Without any context, it’s hard to give a good review. Similar to how you should read an entire essay before giving inline feedback, I’d suggest scanning an entire pull request before dropping comments all over the place. Read the summary and the changes. Get the lay of the land. If you want, pull down the code and finesse it. Sometimes code is written under shipping duress or without perfect knowledge and foresight. That’s OK. You as the reviewer should remember to empathize with the reviewee and consider context before you dash a newbie’s dreams or a veteran’s ego.

4. **Highlight wins.** No one wants to hear just criticism. If someone has a radically cool approach, recognize them for it! Call it out in the comments, and in this case, definitely celebrate with all the whimsy you want—emojis, bitmojis, gifs, confetti, whatever you can find.

Code review is a true skill that combines technical expertise with masterfully delivering feedback. The more you do it, the better you will get. On my team, we encourage new team members to review pull requests as a way to get acquainted with the codebase. Experienced developers do the same, dropping nuggets of wisdom where they can, and calling out pros and cons of different approaches. It’s hard for developers across the spectrum of experience, but it is also a process that we find valuable to skill up our team and improve the overall quality of our codebase. Hopefully, using the above techniques, both the process and code quality will become a little better for you too.

