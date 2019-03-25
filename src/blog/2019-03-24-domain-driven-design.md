---
layout: post
title: "DDD Even Quicker"
date: 2019-03-24T11:16:16-05:00
comments: true
categories: ["domain driven design", "modeling"]
---

My team had mixed reviews of _Domain Driven Design_ by Eric Evans when we first tried to read it for our technical book club last year. Back then, we were a growing pool of developers mostly all working on the same monolith. We switched from project to project, quickly shipping a feature then moving on.

Months later, we have grown a lot and our team has split into domain-focused, metrics-driven squads. At the moment, I'm on the "business services" team, which handles building software to streamline a lot of pretty complex workflows for our admissions, enrollments, and financing teams. 

Now that we have a more concrete domain to focus on, I decided to revisit _Domain Driven Design_, and this time around, it was really eye-opening! I think this time last year, my team and I hadn't yet faced the problems that domain-driven design seeks to solve. But now, maybe, just maybe, we are ready for it.


So, for my own notes and for anyone who wants the tl;dr of domain-driven design, I present **DDD Even Quicker**. These are tips I picked up, along with supporting quotes, and my interpretation of the point.

Tips for more effective design models:

1. Collaborate with your domain experts.

> A team of developers and domain experts collaborate, typically led by developers. Together they draw in information and crunch it into a useful form. The raw material comes from the minds of domain experts, from users of existing systems, from the prior experience of the technical team with a related legacy system or another project in the same domain.

You the developer don't have all the answers, and to make your system more effective, you need to ask the right people lots of questions. You should work to speak the same language and try to pick out any awkwardness in the design. If the design is awkward, there's probably something wrong. Keep prying until you figure it out. You'll want to gain a deeper understanding of workflows and business rules and how the domain experts think. This is essential for clarifying your model, making it easier to extend in the future, and for communicating to future developers and stakeholders how the software works.

2. Be interested in your domain.

> but if programmers are not interested in the domain, they learn only what the application should do, not the principles behind it

Yeah, it's true. If you aren't into what you're building, you'll never be as great as you could be. You'll just build what you're told instead of trying to understand the root cause of a problem and coming up with creative solutions.

3. Use ubiquitous language.

> Use the model as the backbone of a language. Commit the team to exercising that language re- lentlessly in all communication within the team and in the code. Use the same language in diagrams, writing, and especially speech.

> It is vital that we play around with words and phrases, harnessing our linguistic abilities to the mod- eling effort, just as it is vital to engage our visual/spatial reasoning by sketching diagrams.

If you're not all using the same terms, you're in a pickle. All that overhead of mental translation will drive everyone insane. Watch out for inconsistencies. This, I think, is one part of software development that I never anticipated. As an English major and writer, I have always valued the power of language--I just didn't think it also applied to engineering!

4. Use diagrams to communicate, but don't go overboard.

> The trouble comes when people feel compelled to convey the whole model or design through UML. A lot of object model diagrams are too complete and, simultaneously, leave too much out. They are too complete because people feel they have to put all the objects that they are going to code into a modeling tool. With all that detail, no one can see the forest for the trees.


This struck me as particularly interesting: too complete and yet not effective. When there's too much detail, you don't enjoy the benefits of abstraction. 

> A document shouldn't try to do what the code already does well. The code already supplies the detail. It is an exact specification of program behavior.

> Other documents need to illuminate meaning, to give insight into large-scale structures, and to focus attention on core elements. Documents can clarify design intent when the programming language does not support a straightforward implementation of a concept. Written documents should com- plement the code and the talking.

This is interesting to me because Extreme Programming is all about no docs because docs go stale. But I agree that there is often a need to document some things, just for communicate. My team has resorted to using Google Docs to weigh decisions while we're developing. We don't currently create additional diagrams for the aftermath, but maybe we should.

5. Let the model evolve during development.

> The pure analysis model even falls short of its primary goal of understanding the domain, because crucial discoveries always emerge during the design/implementation effort. Very specific, unantici- pated problems always arise. An up-front model will go into depth about some irrelevant subjects, while it overlooks some important subjects. Other subjects will be represented in ways that are not useful to the application. The result is that pure analysis models get abandoned soon after coding starts, and most of the ground has to be covered again. But the second time around, if the developers perceive analysis to be a separate process, modeling happens in a less disciplined way. If the managers perceive analysis to be a separate process, the development team may not be given adequate access to domain experts.

It's so true. This has happened to me so many times. My team and I will have looked at the feature requirements, drawn up a sketch of the domain. And then as soon as we implement it, we hit a roadblock and need to revisit the board. It happens, and it's fine, even good. It's just part of the process.

6. The coders should be responsible for the model.

> If the people who write the code do not feel responsible for the model, or don't understand how to make the model work for an application, then the model has nothing to do with the software. If developers don't realize that changing code changes the model, then their refactoring will weaken the model rather than strengthen it. Meanwhile, when a modeler is separated from the implementation process, he or she never acquires, or quickly loses, a feel for the constraints of implementation. The basic constraint of MODEL-DRIVEN DESIGN—that the model supports an effective implementation and abstracts key domain knowledge is half-gone, and the resulting models will be impractical. Finally, the knowledge and skills of experienced designers won't be transferred to other developers if the division of labor prevents the kind of collaboration that conveys the subtleties of coding a MODEL-DRIVEN DESIGN.

> Any technical person contributing to the model must spend some time touching the code, whatever primary role he or she plays on the project. Anyone responsible for changing code must learn to express a model through the code. Every developer must be involved in some level of discussion about the model and have contact with domain experts. Those who contribute in different ways must consciously engage those who touch the code in a dynamic exchange of model ideas through the UBIQUITOUS LANGUAGE

Essentially, the people implementing design should be part of the modeling decisions. They need a deep understanding of how the pieces fit together. The model shouldn't be designed by analysts or even an architect, though those people could also be involved or consulted.





