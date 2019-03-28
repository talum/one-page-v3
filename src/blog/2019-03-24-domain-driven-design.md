---
layout: post
title: "DDD Even Quicker"
date: 2019-03-24T11:16:16-05:00
comments: true
categories: ["domain driven design", "modeling"]
---

## Notes and thoughts from my reading

My team had mixed reviews of _Domain Driven Design_ by Eric Evans when we first tried to read it for our technical book club last year. Back then, we were a growing pool of developers mostly all working on the same monolith. We switched from project to project, quickly shipping a feature then moving on.

Months later, we have grown a lot and our team has split into domain-focused, metrics-driven squads. At the moment, I'm on the "business services" team, which handles building software to streamline a lot of pretty complex workflows for our admissions, enrollments, and financing teams. 

Now that we have a more concrete domain to focus on, I decided to revisit _Domain Driven Design_, and this time around, it was really eye-opening! I think this time last year, my team and I hadn't yet faced the problems that domain-driven design seeks to solve. But now, maybe, just maybe, we are ready for it.


So, for my own notes and for anyone who wants the tl;dr of domain-driven design, I present **DDD Even Quicker**. These are tips I picked up, along with supporting quotes, and my interpretation of the point.

Tips for more effective design models:

## 1. Collaborate with your domain experts.

> A team of developers and domain experts collaborate, typically led by developers. Together they draw in information and crunch it into a useful form. The raw material comes from the minds of domain experts, from users of existing systems, from the prior experience of the technical team with a related legacy system or another project in the same domain.

You the developer don't have all the answers, and to make your system more effective, you need to ask the right people lots of questions. You should work to speak the same language and try to pick out any awkwardness in the design. If the design is awkward, there's probably something wrong. Keep prying until you figure it out. You'll want to gain a deeper understanding of workflows and business rules and how the domain experts think. This is essential for clarifying your model, making it easier to extend in the future, and for communicating to future developers and stakeholders how the software works.

## 2. Be interested in your domain.

> but if programmers are not interested in the domain, they learn only what the application should do, not the principles behind it

Yeah, it's true. If you aren't into what you're building, you'll never be as great as you could be. You'll just build what you're told instead of trying to understand the root cause of a problem and coming up with creative solutions.

## 3. Use ubiquitous language.

> Use the model as the backbone of a language. Commit the team to exercising that language relentlessly in all communication within the team and in the code. Use the same language in diagrams, writing, and especially speech.

> It is vital that we play around with words and phrases, harnessing our linguistic abilities to the modeling effort, just as it is vital to engage our visual/spatial reasoning by sketching diagrams.

If you're not all using the same terms, you're in a pickle. All that overhead of mental translation will drive everyone insane. Watch out for inconsistencies. This, I think, is one part of software development that I never anticipated. As an English major and writer, I have always valued the power of language--I just didn't think it also applied to engineering! Also, it's important to sensitize yourself to hints of implicit workflows and to differences in language. A good programmer is also a good communicator and listener. Pay attention to word choice and to body language when talking to domain experts. Read the literature of the domain or the common practices of the business. 

## 4. Use diagrams to communicate, but don't go overboard.

> The trouble comes when people feel compelled to convey the whole model or design through UML. A lot of object model diagrams are too complete and, simultaneously, leave too much out. They are too complete because people feel they have to put all the objects that they are going to code into a modeling tool. With all that detail, no one can see the forest for the trees.


This struck me as particularly interesting: too complete and yet not effective. When there's too much detail, you don't enjoy the benefits of abstraction. 

> A document shouldn't try to do what the code already does well. The code already supplies the detail. It is an exact specification of program behavior.

> Other documents need to illuminate meaning, to give insight into large-scale structures, and to focus attention on core elements. Documents can clarify design intent when the programming language does not support a straightforward implementation of a concept. Written documents should complement the code and the talking.

This is interesting to me because Extreme Programming is all about no docs because docs go stale. But I agree that there is often a need to document some things, just for communicate. My team has resorted to using Google Docs to weigh decisions while we're developing. We don't currently create additional diagrams for the aftermath, but maybe we should.

## 5. Let the model evolve during development.

> The pure analysis model even falls short of its primary goal of understanding the domain, because crucial discoveries always emerge during the design/implementation effort. Very specific, unanticipated problems always arise. An up-front model will go into depth about some irrelevant subjects, while it overlooks some important subjects. Other subjects will be represented in ways that are not useful to the application. The result is that pure analysis models get abandoned soon after coding starts, and most of the ground has to be covered again. But the second time around, if the developers perceive analysis to be a separate process, modeling happens in a less disciplined way. If the managers perceive analysis to be a separate process, the development team may not be given adequate access to domain experts.

It's so true. This has happened to me so many times. My team and I will have looked at the feature requirements, drawn up a sketch of the domain. And then as soon as we implement it, we hit a roadblock and need to revisit the board. It happens, and it's fine, even good. It's just part of the process.

Additionally, it's important to continue to refactor. Refactor as you gain new insight. Refactor for clarity. Just keep going.

> The returns from refactoring are not linear. Usually there is a marginal return for a small effort, and the small improvements add up. They fight entropy, and they are the frontline protection against a fossilized legacy. But some of the most important insights come abruptly and send a shock through the project. Slowly but surely, the team assimilates knowledge and crunches it into a model. Deep models can emerge gradually through a sequence of small refactorings, an object at a time: a tweaked association here, a shifted responsibility there. Often, though, continuous refactoring prepares the way for something less orderly. Each refinement of code and model gives developers a clearer view. This clarity creates the potential for a breakthrough of insights. A rush of change leads to a model that corresponds on a deeper level to the realities and priorities of the users. Versatility and explanatory power suddenly increase even as complexity evaporates.

Another good point to keep in mind: sometimes the refactoring is painful, but necessary. I have recently hit this stumbling block, and the refactoring is indeed annoying/tedious. I'm holding onto the hope that the model will become clear soon. Or I'm at least making it better in the long run.

## 6. The coders should be responsible for the model.

> If the people who write the code do not feel responsible for the model, or don't understand how to make the model work for an application, then the model has nothing to do with the software. If developers don't realize that changing code changes the model, then their refactoring will weaken the model rather than strengthen it. Meanwhile, when a modeler is separated from the implementation process, he or she never acquires, or quickly loses, a feel for the constraints of implementation. The basic constraint of MODEL-DRIVEN DESIGN—that the model supports an effective implementation and abstracts key domain knowledge is half-gone, and the resulting models will be impractical. Finally, the knowledge and skills of experienced designers won't be transferred to other developers if the division of labor prevents the kind of collaboration that conveys the subtleties of coding a MODEL-DRIVEN DESIGN.

> Any technical person contributing to the model must spend some time touching the code, whatever primary role he or she plays on the project. Anyone responsible for changing code must learn to express a model through the code. Every developer must be involved in some level of discussion about the model and have contact with domain experts. Those who contribute in different ways must consciously engage those who touch the code in a dynamic exchange of model ideas through the UBIQUITOUS LANGUAGE

Essentially, the people implementing design should be part of the modeling decisions. They need a deep understanding of how the pieces fit together. The model shouldn't be designed by analysts or even an architect, though those people could also be involved or consulted.

## 7. Use a layered architecture to emphasize a separation of concerns.

Typically, you might see the layers as UI, Application, Domain or "Model", and Infrastructure. You should aim to isolate each of these things to that you can change one without casing ripple effects throughout your codebase. Each layer should only depend on the layers below. 

I've been thinking a lot about this part...in a web application, I think of the "Application" as web-specific stuff, like routes and controllers. Ideally, you would have all of the "business logic" live in the domain layer so it could potentially be packaged up and used in a different application through a separate interface, perhaps a CLI. Routers and controllers are taking requests, routing them to the right place, and then invoking some action. The action has a response, which is then returned to the caller. 

In the Rails app I've been working on for the past few years, the business logic has gotten out of control in many of our controllers, which makes the operations they perform less reusable, so I can definitely see the benefit of layers.

## 8. Use services when domain concepts aren't naturally modeled as objects.

> Now, the more common mistake is to give up too easily on fitting the behavior into an appropriate object, gradually slipping toward procedural programming. But when we force an operation into an object that doesn't fit the object's definition, the object loses its conceptual clarity and becomes hard to understand or refactor. Complex operations can easily swamp a simple object, obscuring its role. And because these operations often draw together many domain objects, coordinating them and putting them into action, the added responsibility will create dependencies on all those objects, tangling concepts that could be understood independently.

> Sometimes services masquerade as model objects, appearing as objects with no meaning beyond doing some operation. These “doers” end up with names ending in “Manager” and the like. They have no state of their own nor any meaning in the domain beyond the operation they host. Still, at least this solution gives these distinct behaviors a home without messing up a real model object.

To me, this sounds like we should use services when many objects need to interact. Also, name the service after the activity or operation instead of a noun. "DeployRepo" vs "DeployRepoManager". It has a clearer responsibility this way. 

## 9. Use aggregates, factories, and repositories.

Associations are hard to manage so seek to minimize them where possible. The aggregate, factory, and repository pattern can help you manage complex objects and their associations.

> An AGGREGATE is a cluster of associated objects that we treat as a unit for the purpose of data changes. Each AGGREGATE has a root and a boundary...The root is a single, specific ENTITY contained in the AGGREGATE... The root is the only member of the AGGREGATE that outside objects are allowed to hold references to, although objects within the boundary may hold references to each other. 

In certain situations, you might want to create a boundary for objects. These are things that don't make sense on their own, but instead work with a primary object to provide more complex interactions. In our codebase, we've embraced this concept for the idea of an "Assignment". An assignment has many tasks, which have many grading criteria. Tasks and grading criteria mean nothing without the assignment, so the assignment becomes our aggregate root. 

Where factories become useful is for constructing these complex objects. Sometimes you might want to encapsulate the construction of the primary object and its associated objects. A factory lets you do that: its sole responsibility is to help you create other objects.

> Generally speaking, you create a factory to build something whose details you want to hide, and you place the FACTORY where you want the control to be. These decisions usually revolve around AGGREGATES.

Since I work usually with web frameworks like Rails and Phoenix, I haven't had too much of a use case for the repository pattern, but I suppose it could be used for controlling the ability to query objects and persist them. Another potential use case is to prevent reaching directly into objects to query for them. Instead, you'd be forced to go through the aggregate root. In Phoenix, you could configure your repository to be an in-memory store rather than a database-backed one, so maybe that's another possible use case.

## 10. Use specifications for business rules when appropriate, so they can live in the domain. 

Sometimes you have to define rules to validate, select, or create objects. The specification pattern, which uses the idea of objects used as predicates can help. Define a bunch of objects that conform to the same interface and then combine them. These objects can have multiple methods that apply for each scenario: validation, selection, or creation.

## 11. Go for simple.

> A lot of overengineering has been justified in the name of flexibility. But more often than not, excessive layers of abstraction and indirection get in the way. Look at the design of software that really empowers the people who handle it; you will usually see something simple. Simple is not easy.

You want a supple, intention-revealing design, one that is simple can able to change. In order to change something (well), you need to understand it, which is why simplicity and clarity are so important.

## 12. Aim for consistency within bounded contexts. 

Draw an explicitly boundary so you can keep the model pure inside. When codebases and teams get too big, you will probably struggle to keep everything consistent everywhere, and that's okay. Just demarcate parts of the app.

## 13. Anticorruption layers can help keep the model pure.

An anti-corruption layer is a layer of translation between two models, maybe even two bounded contexts. It can translate in both directions.

## 14. But external systems can be annoying. 

I'm conflicted on how to best work with external systems. For Salesforce in particular, we face an interesting challenge because Salesforce can be customized to our administrators' content, which means that workflows and communications are in constant flux. Evans suggests that there are two solutions: conforming or anti-corruption. 

> If your application is really an extension to the existing system and your interface with that system is going to be large, the translation between CONTEXTS can easily be a bigger job than the application functionality itself. And there is still some room for good design work, even though you have placed yourself in the BOUNDED CONTEXT of the other system. If there is a discernable domain model behind the other system, you can improve your implementation by making that model more explicit than it was in the old system, just as long as you strictly conform to the old model.

I'm struggling to figure out if Salesforce should be part of our domain or whether it maps to something that already exists. Ongoing battle.

#15. Work together.

> A good project has lots of people sticking their nose in other people's business. Developers play with frameworks. Architects write application code. Everyone talks to everyone. It is efficiently chaotic. Make the objects into specialists; let the developers be generalists.

Pretty much everyone has to work together to make everything work. It doesn't make sense to have architects not code or analysts create a model without talking to anyone. Evans talks a lot about not siphoning off the best and brightest to do architecture or infrastructure. Good design requires feedback and iteration. 

## 16. And finally, some quotes I just really liked and wanted to highlight.

> Whatever the system, be less concerned with the authority bestowed by management than with the actual relationship the developers have with the strategy.

> Creating an organizing principle, large-scale structure, or distillation of such subtlety requires a really deep understanding of the needs of the project and the concepts of the domain. The only people who have that depth of knowledge are the members of the application development team

> When too many design decisions are preordained, the development team can be hobbled, without the flexibility to solve the problems they are charged with. So, while a harmonizing principle can be valuable, it must grow and change with the ongoing life of the development project, and it must not take too much power away from the application developers, whose job is hard enough as it is.

> Managers tend to move the most technically talented developers into architecture teams and infrastructure teams, because they want to leverage the skills of these advanced designers. For their part, the developers are attracted to the opportunity to have a broader impact or to work on “more interesting” problems. And there is prestige attached to being a member of an elite team.

> Separate architecture teams have to be especially careful because they have less feel for the obtacles they might be placing in front of application teams. At the same time, the architects' enthu- siasm for their primary responsibility makes them more likely to get carried away. I've seen this phenomenon many times, and I've even done it. One good idea leads to another, and we end up with an overbuilt architecture that is counterproductive.

## Phew, what a book.

There's plenty more that I can't even try to summarize, but what a read. And look at all these inspirational quotes! Seriously: Read it. I'm going to go through it again when I have time. It's given me a lot to think about.

