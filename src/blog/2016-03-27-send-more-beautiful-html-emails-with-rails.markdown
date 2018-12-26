---
layout: post
title: "Send More Beautiful HTML Emails with Rails"
date: 2016-03-27 09:04:20 -0400
comments: true
categories: ["Flatiron&nbsp;School", "ActionMailer", "Rails", "Email"] 
---

The first time I discovered mailers in Rails, I was basically in awe. Many of my classmates felt the same, and throughout our semester at the Flatiron School, they debuted a bunch of apps dedicated to sending users updates about train delays, sports games, and the results of picking between a bunch of pieces of art. 

Come post-Flatiron world, sending a plain-text email is no longer impressive. Cool, but been done. What we really need are HTML emails, which may just so happen to be scheduled to send at a certain time. 

That was my first feature as a paid programmer--building a weekly digest email in Rails--and the following is more or less some tips from my experience, as well as some advice for anyone tackling HTML emails going forward.

##How to Send Emails from Rails

It goes without saying that you should read the [Rails Guides](http://guides.rubyonrails.org/action_mailer_basics.html), but I'll go ahead and say it anyway. Yeah, it's long and you can miss things, so I'll point out a couple key things. 

##Rails Mailers
When you want to start sending emails from your Rails app, you'll use a `Mailer`. A mailer is essentially a controller, but specifically for emails. If you use the Rails generator, your mailer will inherit from `ApplicationMailer`, which inherits from `ActionMailer::Base`.

Within your mailer, you define 'actions' just like in controllers. Unlike controllers though, you don't need to make your actions very RESTful. Instead, you can and should name them descriptively. For instance, if you're sending a weekly digest, call your action `def weekly_digest_email`. 

In the mailer, you can define who the email should come from. You can also specify `reply-to` and `cc` or `bcc` options. If you want, you can specify default options in the `Application Mailer` and later override them within your specific mailer. This comes in handy if you want to retain a copy of all emails sent to verify their integrity later on or something. Near the end of your mailer action, you'll use the `mail()` method (in contrast to render or redirect_to), which can take a hash of options that can include `to:` and `subject:`.

##Mailer Views
Each action you define in your mailer should have a corresponding view (located in the `app/views/name_of_mailer_class` directory. You should name your file to match the controller action. That's all it takes.

And guess what? You can throw some HTML into that view instead of just using plain text! Whoo! 

Now you know how to make beautiful emails. It's more or less the same as any other view, except you have to be aware of email limitations. Let me elaborate.

##Best Design Practices
According to best practices listed at [EnvatoTuts+](http://code.tutsplus.com/tutorials/20-email-design-best-practices-and-resources-for-beginners--net-7309), you should keep the design simple and use tables. Not heavily nested tables, but tables. You should also avoid attempting to use JavaScript because email clients will flag that as spam. When you start sending emails, you open up a whole can of worms. You probably don't want to send spam out because a) no one will see the results of your hard work and b) you'll negatively impact your ability to send emails in the future. (Back when I did email marketing, we talked all about sender scores and the nebulousness of email algorithms.)

Also, if you want to be fancy and use an SVG instead of an image in .png or .gif or .jpg format, don't. Email clients provide inconsistent support for SVGs. You should also test your emails across multiple email clients. What looks good in one desktop email client may look like garbage in the Gmail app (which is exactly what I've found in most cases). If you want to make responsive emails (which you probably do because everything is going mobile), I recommend checking out this [resource](http://responsiveemailpatterns.com/). Designing emails could be a job in itself, so if you have the resources, go for it. 
<!--more -->

##Inline CSS
Another thing you should know: when you code up the view for your mailer, you need to use inline CSS because of how wacky some email clients are. Inline CSS? Isn't that the worst possible thing you can do? (I imagine you protest.) Yes, inline CSS sucks because it's hard to maintain, but there is some good news. If you are so inclined, you can write an email-specific stylesheet, link to it from the `Application Mailer` and then use the `premailer-rails` gem to inline your CSS. That way, you don't have to worry about changing stuff in line. The gem will do it for you prior to send. I must confess that I still put a couple things inline in my final product, but I don't recommend that other people do the same. Here's [more info](https://github.com/fphilipe/premailer-rails) about `premailer-rails`.

##Linking with Absolute Paths
One more thing--when using links in Rails emails, you'll need to use the `_url` helper for routes defined in your application. You can't use `_path` because the email has no context about the request and so cannot direct people where you think you want to direct them. The `_url` version will provide an absolute URL in your email.

If you want to get even fancier when you're coding up a lot of emails, you can also use partials in your emails, but that's pretty straightforward I think. It's just like any other view in Rails. 

##Mailer Previews
Since you're off designing pretty emails, you probably want a faster feedback loop to view your design. After all, you don't want to have to acutally trigger this email to see the fruits of your labor. 

For this, you can use a Rails mailer preview. (Seriously, they've thought of everything.)

Here's [the guide for setting up an Action Mailer Preview](http://api.rubyonrails.org/v4.1/classes/ActionMailer/Base.html). It's realtively straightforward as long as you don't make silly mistakes along the way as I tend to do. 

You create a preview for your mailer that inherits from `ActionMailer::Preview`. It's weird--previews get tossed in the `spec/mailers` directory, but I guess you'd want to separate the preview from the rest of your app. Anyway, if you're looking for that preview file, that's where it is.

Within the preview, you define an action that corresponds to the name of the action in your mailer, but instead of writing up some configs, you trigger a send. For example:

```html
class NeighborDigestPreview < ActionMailer::Preview
  def six_people_sunday
    user = batch.users.sample
    NeighborDigestMailer.six_people_sunday_email(user)
  end
end
```

If you stick to the default configs, you should be able to see your preview by hitting up `http://localhost:3000/rails/mailers` and looking for your mailer and email action. 

##Mailer Configuration
I didn't personally set this part up because the Rails app I work on uses SendGrid, but you can probably figure it all out from [Rails Guides](http://guides.rubyonrails.org/action_mailer_basics.html). A friend and I had some issues configuring Gmail as the email provider on Heroku for one of our apps, but we fiddled around with the password and it eventually worked. 

So, that said, I'm pretty sure you can go forth and code up some baller HTML emails with Rails. This guide is in no way intended to be comprehensive, but I hope it cleared up some of the more ambiguous parts of the documentation to help you find the right keywords to Google. 
