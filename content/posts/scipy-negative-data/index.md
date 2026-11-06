---
title: "Just throw it away? Class imbalance lessons from molecular machine learning to meatballs"
date: 2026-11-06
description: "What do antibiotics, baseball, and sandwiches have in common? A look at how negative data selection affects machine learning models across three very different domains."
tags: ["SciPy", "Machine Learning", "Data Science"]
categories: ["Technical"]
---

[YouTube talk](https://www.youtube.com/watch?v=i9le8tKaAqY) | [GitHub repository](https://github.com/jackievaleri/negative_ml)

One of the challenges in drug discovery is that most of the things you screen are not going to work. In antibiotic discovery, for example, you might test thousands of molecules in the lab and find that only a single digit percentage have the antibacterial activity you're looking for (and that would be pretty impressive, honestly!). That's a lot of negative data to collect. But do we really need all of it?

This was the question I set out to explore during my Scipy talk in Minneapolis. More specifically, I wanted to understand how much negative data we actually need to train a useful machine learning model, and whether *how* we select that data matters.

The motivation comes from a pretty practical problem: screening millions of drug candidates in the lab is expensive and time-consuming. Machine learning offers a way to narrow down that search, but training a good model still requires good data. If we can be more thoughtful about which examples we collect, maybe we can spend less time and money in the lab.

I started with antibiotic discovery, where there's an interesting wrinkle: we actually know quite a lot about what our positive examples look like. In one of the datasets I worked with, roughly two-thirds of the positive examples were already known antibiotics or anti-infectives. So I wondered whether we could get away with collecting fewer negative examples, or selecting them more strategically.

I compared several approaches to selecting negative data: random sampling, selecting chemically diverse examples, selecting examples that were representative of the broader chemical space, and selecting *decoys* — molecules that look very similar to known positives but have different outcomes.

The results were a little disappointing if you're hoping to save a lot of experimental effort. Across most of the experiments, more data was better, and more negative data was generally helpful. Random selection was also surprisingly competitive with the more sophisticated approaches. And - weirdly - decoys were consistently one of the worst ways to select training data.

I was particularly surprised by that last result. Decoys are a pretty well-established concept in molecular docking, where they're used to help distinguish molecules that bind to a target from those that don't. I thought they might be useful here, too. Instead, it seemed like they weren't diverse enough to help the model learn the broader negative space.

Naturally, I wanted to see whether these observations held up outside of drug discovery. So I put on my baseball cap (literally! watch the video recording!) and started looking at baseball data.

Baseball turns out to have a lot in common with antibiotic discovery from a negative data perspective. Most at-bats don't result in home runs, and home runs are a relatively rare positive outcome. I used pitch-level data from Major League Baseball to predict home runs and repeated the same experiments with different negative data selection strategies.

Here, the results were a little different. With enough training data, the different selection strategies mostly converged. But at smaller dataset sizes, random selection was again surprisingly powerful, and decoys were still pretty poor performers.

And then, because I absolutely love a fun side project, I moved on to sandwiches.

I was delighted to discover a TikTok creator, @adventuresinaardia, who rolls dice to determine the ingredients of his sandwiches, eats whatever combination he gets, and scores the results. He has even published the data on Reddit. This is obviously a data scientist's dream (or maybe just my dream).

I used this dataset to predict whether a sandwich would be good or bad, with anything scoring 8.5/10 or higher counting as a good sandwich. There are some important subtleties here: salami might be great in one sandwich and terrible in another, depending on the bread, sauce, and other ingredients. So sandwich scores are non-linear with respect to their ingredients.

The models were admittedly pretty weak, probably because the dataset is small and the space of possible sandwiches is enormous. But there were still some interesting results. Bacon showed up as an important feature (something the sandwich creator himself agrees with in his videos), and the different negative data selection strategies looked fairly similar. Decoys were, once again, not particularly helpful.

Across all three domains, I also explored whether decoys might be more useful for distinguishing *matched pairs*: examples that are very similar in their features but have very different outcomes. Unfortunately, even in this setting, decoys didn't give us the improvement I was hoping for.

Finally, I looked at active learning: rather than collecting all of our training data upfront, could we iteratively train a model, use it to select the next batch of examples, and repeat? One particularly interesting finding was that random acquisition sometimes outperformed model-guided acquisition when the starting model was weak. In other words, if your model isn't very good to begin with, using it to decide what to test next might not be the best strategy. Sometimes you're better off just testing random examples and letting the model improve with more data.

So, what did I learn from all of this?

First, more data is generally helpful in these complex modeling situations, even when you're trying to be clever about how you select it. Second, random sampling is a surprisingly strong baseline and is often hard to beat. And third, decoys might not be quite as universally useful as I initially thought.

And if nothing else, I think we need more training data - specifically for sandwiches. :)