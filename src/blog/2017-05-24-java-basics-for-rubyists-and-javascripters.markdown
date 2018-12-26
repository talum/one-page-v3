---
layout: post
title: "Java Basics for Rubyists and JavaScripters"
date: 2017-05-24T23:04:05-04:00
comments: true
categories: ['java', 'ruby', 'javascript']
---

Great news, Rubyists and JavaScripters, if you know ES6 and have read up on
object-oriented Ruby, it's not terribly difficult to learn Java. I know
because I've been learning it over the past few months, and I've survived! Here are some basics
I've picked up along the way that may help you get started.

**static typing**

This means that the type of the variable (boolean, int, string, etc.) is
known at compile time. Java is a statically typed language, which means that
it'll catch incompatible type errors when it tries to compiles your code
into lower level machine code.

**types**

The eight main primitive data types in Java are boolean, char, byte, short,
int, long, float, and double. The ones I've most commonly used are boolean,
int, long, float, and double. Booleans are either true or false. Ints are
numbers that occupy up to 32 bits. Longs are like bigger numbers that can
occupy up to 64 bits. Float are decimal values up to 32 bits, and doubles
are decimal values up to 64 bits. Strings aren't primitive types but
actually reference the `String` class in Java. I do end up using that type
frequently.

**static**

The static keyword means that a variable or method belongs to the class
rather than an instance of a class. You've probably also seen this in ES6
syntax to denote that something belongs to the "class" rather than the
instance.

Here's a trivial example.

```java

public class IceCream {
  public static String getMessage() {
      return "I love ice cream!";
  }

  public static void main(String[] args) {
      System.out.print(IceCream.getMessage());
  }
}

```
The `main` method in a Java class pretty much means run the code in here. So
above, I'm saying print out the result of this static method call. It prints
out "I love ice cream!"

In Ruby, you'd have to do something like this to achieve the same thing:

```ruby

class IceCream
  def self.get_message
    "I love ice cream!" 
  end

  puts self.get_message
end

```
Above, you'll see a class method as well as an invocation of the class
method when the class is loaded. Yes, you can call methods in the class
definition on load, but it's a little weird.

This is all in contrast to instance variables and methods.

```java

public class IceCream {
  public static String getMessage() {
      return "I love ice cream!";
  }

  public String getOtherMessage() {
    return "I the instance love ice cream too!";
  }

  public static void main(String[] args) {
      // This is how you instantiate a new instance of a class
      IceCream iceCream = new IceCream();
      System.out.print(iceCream.getOtherMessage());
  }
}

```

In the `main` method, I'm instantiating a new instance of the `IceCream`
class and storing it in a variable called `iceCream`. You'll also notice
that I've declared that variable's type as `IceCream`. Then, in the line
that prints out to the console, I'm calling the instance method
`getOtherMessage` on the instance of the `IceCream` class.

**final**

The `final` keyword is like setting a constant. When you use the final
keyword, you cannot reset the value of the thing you've declared `final`. In
JavaScript ES6, you'd probably use the `const` keyword to denote the same
thing. In Ruby, you'd set your constant in all caps at the top of your
class.

```java

public class IceCream {
  public static void main(String[] args) {
      final int version = 1;
      version = IceCream.resetVersion(version);
  }
}

```
Here, you wouldn't be able to build your project and would get the error
"cannot assign a value to final variable version."

**interface**

Interfaces are sort of like classes, but they can't be instantiated. They
provide a contract that ensures that a class implements certain methods. As
this handy [tutorial](http://tutorials.jenkov.com/java/interfaces.html)
explains, interfaces only include method signatures, but not the
implementation of methods. To ensure that a class implements an interface,
you'd write something like this:

```java
public class IceCream implements Eatable {

}

```

where `Eatable` is my interface. 

The `Eatable` interface might look something like this:

```java

public interface Eatable {
    public String delicious = "delicious";
    public String eat();
    public String digest();
}

```

Now, the `IceCream` class would have to implement the `eat` and `digest`
methods. It would have access to the `delicious` variable as well. That wouldn't need
to be defined.

Interfaces are useful for polymorphism, that is, if you want multiple
classes to respond to the same method in a slightly different way.

**public, private, protected**

These mean nearly the same thing as in Ruby. Public methods can be accessed
from outside the class. Private methods can only be accessed within the same class. Protected methods can be
accessed by subclasses as well as classes in the same package.

As you probably already know, there is no concept of "public versus
private" in JavaScript, but a lot of teams develop their own conventions to
indicate to other developers on their team. Also, since the introduction of
JavaScript modules, the distinction between public and private has become a
little more explicit.

**constructors**

You've seen constructors in Ruby and JavaScript. The major difference is
that a class in Java can have multiple constructors, and the most
appropriate one based on the number of arguments passed in is selected.

The other thing that was strange to me at first was that constructors have
a method signature equivalent to the name of a class. So a constructor for
the ice cream class would look like this:

```java

public class IceCream {
    public IceCream() {
    }
}

```

Here it is with some arguments:

```java

public class IceCream {
   // These are instance variables
    int parlorId;
    String flavor;

    public IceCream(int parlorId, String flavor) {
      // Here we're setting the instance variables equal to the arguments
      //  passed in
      // `this` refers to the instance itself
      this.parlorId = parlorId;
      this.flavor = flavor;
    }
}

```

**inheritance**

Inheritance functions mostly the same, but the syntax is of course a little
different from Ruby. It looks a lot like inheritance in ES6 though.

```java
public class IceCream extends Dessert {

}

```
Looks a lot like the same behavior in JS, especially as used in React.

```javascript
class IceCream extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        parlorId: props.parlorId,
        flavor: props.flavor
      }
  }
  ...
}

```

**void**

Void tripped me up for a while. When you're declaring the type of the return
value of a function, you'd use `void` to indicate that there is no return value. If a function doesn't return
anything, but just takes some type of action, you'd write something like
this:

```java
public static void doAThing() {
    // body in here would take action but not have an explicit return value
}

```

So that's all for now, all the super basic Java things I've picked up over
the past month and a half. Hopefully that'll clear up some confusion for
anyone trying to read Java code and eventually learn to write it themselves.

# Resources
- [Java types](http://cs.fit.edu/~ryan/java/language/java-data.html)
- [Default, public, protected, private](https://stackoverflow.com/questions/215497/in-java-difference-between-default-public-protected-and-private)

