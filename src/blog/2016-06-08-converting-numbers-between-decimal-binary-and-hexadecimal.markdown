---
layout: post
title: "Converting Numbers Between Decimal, Binary, and Hexadecimal"
date: 2016-06-08T20:05:06-04:00
comments: true
categories: ["binary", "decimal", "hexadecimal"]
---

For a while now, as part of our Labs Book Club, we've been exploring some computer science topics, which we don't get to cover a lot of during the immersive program. Although not knowing computer science isn't prohibitive to becoming a functional programmer, learning it, or at least understanding some of its core tenets can make you a much better one.

One topic that I've been trying to get better at for the last few weeks or so is understanding how to convert numbers from decimal, to binary, to hexadecimal, and back. 

It's not so hard, but it's also not that easy. Most likely all you need is some time to wrap your head around it. Decimal, binary, and hexadecimal are all just ways to represent numbers, but each digit in a number has a different "base." 

If you remember learning about logarithms and exponents back in high school (or maybe before that), you're pretty much halfway there to understanding how these number systems with different bases work. 

<!-- more -->

## Decimal
In decimal, a digit ranges from 0 - 9. In binary, a digit is represented by 0s and 1s, and in hexadecimal, digits range from 0 - F (that's 0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F).

It's helpful to think of each digit in a given number as representing a placeholder times the number system's base raised to a power. 

In other words, in decimal (base 10), the number 8 can be represented as 8 * 10^0. The number 204 can be represented as 4 * 10^0 + 0 * 10^1 + 2 * 10^2. 

So, really, in these number systems every digit is just a coefficient multiplied by a base raised to a power, where the digit's position is the power. The rightmost digit always starts with 0, and then it increments by one as you go left. 

## Binary

In binary, the same concept applies, but the base is 2 instead of 10. So the number 100 can be represented in binary as 1 * 2^6 + 1 * 2^5 + 0 * 2^4 + 0 * 2^3 + 1 * 2^2 + 0 * 2^1 + 0 * 2^0 which then maps to 1100100. You just take all the coefficients out and stick 'em next to each other.

The way I like to convert decimal to binary is to find the largest power of 2 that can be subtracted from the decimal number, then continue running through the remaining powers / positions until I've fully represented the number. 

Here's another example converting the decimal number 42 to binary.

The largest power of 2 that's less than 42 is 2^5, which is 32. 42 - 32 is 10, so that's the next value I work with. 

So far, we have 1 * 2^5. Next, I try 2^4, which is 16. 16 is greater than 10, so the coefficient there will be 0. Next is 2^3, or 8, which is less than 10. So I'll add 1 * 2^3 to my binary representation. Subtracting out 8, I'm left with 2. 2^2 is 4, which is too large, so that's another 0 placeholder. And then we've got 2^1, which is 2, and is exactly what I need. I've run out of numbers, so clearly, the coefficient for 2^0 will be 0. That leaves me with the final value of 101010.

## Hexadecimal

As I've learned recently, there are 8 bits in a byte. Each bit is a 1 or a 0. Also, there are these things called nibbles, which consist of 4 bits. 

Hexadecimal is used a lot to represent data for computers because two hexadecimal digits map to 1 byte of information; that's 8 bits, which means that each hexadecimal digit is one nibble. Hexadecimal numbers are also used to represent colors and memory addresses. 

Converting a hex number to binary isn't that bad, but going the other way requires some work. 

Let's tackle hex to decimal first. 

If you have the hex number 40F00, that translates to 4 * 16^4 + 0 * 16^3 + F * 16^2 + 0 * 16^1 + 0 * 16^0. Summing those values results in a decimal number of 265984. F in the hexadecimal number system maps to 15. 

For clarity, A => 10, B => 11, C => 12, D => 13, E => 14, and F => 15.

If you start with a decimal number and need to convert it to hex, it's often easier to convert decimal to binary first.

Let's say you have the number 123, which could represent the R in RGB.

Convert 123 to binary first: 

123 - 2^6 = 59. 

 59 - 2^5 = 27.

 27 - 2^4 = 11.

 11 - 2^3 = 3.

  3 - 2^2 ? nope

  3 - 2^1 = 1.

  1 - 2^0 = 0.

So, the final binary number is 01111011. Since we know that we'll eventually need to end up with 8 bits to get a two-digit hex number, it's probably a good idea to stick the 0 placeholder in front for the 2^7 position. 

Now we've got 8 bits, 1 byte, or 2 nibbles: 0111 and 1011. 

To convert these guys into hexadecimal digits, we convert each nibble back to decimal.

0111 => 0 * 2^3 + 1 * 2^2 + 1 * 2^1 + 1 * 2^0 => 7

1011 => 1 * 2^3 + 0 * 2^2 + 1 * 2^1 + 1 * 2^0 => 11 => B because 11 maps to B in hex.

So hopefully that elucidated some of the complexity behind converting numbers between different number systems. It took me more time than I'd like to admit to figure that out, but hey, now I know!


