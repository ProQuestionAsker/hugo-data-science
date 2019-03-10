+++
title = "My Awesome Project"
date = "2016-11-05T18:25:22+05:30"
description = "Are more babies born after storms? Or superbowl wins?"
type = "post"
draft = "false"
categories = ["project"]
tags = ["d3.js", "data viz"]
image = "https://images.unsplash.com/photo-1501914334045-d73f21057207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
authors = ["Amber Thomas", "Jan Diehm"]
+++

-   [Introduction](#introduction)
-   [Feature Engineering](#feature-engineering)
-   [Missing Data](#missing-data)
-   [Modeling for Survival](#modeling-for-survival)
-   [Predicting Survival](#predicting-survival)

Introduction
------------

This is my first project on Kaggle and my `first attempt` at machine learning. I'll do my best to illustrate what I've down and the logic behind my actions, but feedback is very much welcome and appreciated!

### Loading Necessary Packages

``` r
# For data manipulation and tidying
library(dplyr)

# For data visualizations
library(ggplot2)

# For modeling and predictions
library(caret)
library(glmnet)
library(ranger)
library(e1071)
```

### Importing Data

The data were downloaded directly from the [Kaggle Website](https://www.kaggle.com/c/titanic/data). Before binding the training and test sets into a single data file, I added a column called "Dataset" and labelled rows from the training file "train" and rows from the testing file "test".

``` r
train <- read.csv(file = "train.csv", header = TRUE, stringsAsFactors = FALSE)
train$Dataset <- "train"

test <- read.csv(file = "test.csv", header = TRUE, stringsAsFactors = FALSE)
test$Dataset <- "test"

full <- bind_rows(train, test)
```

The full dataset can then be inspected:

``` r
str(full)
```

    ## 'data.frame':    1309 obs. of  13 variables:
    ##  $ PassengerId: int  1 2 3 4 5 6 7 8 9 10 ...
    ##  $ Survived   : int  0 1 1 1 0 0 0 0 1 1 ...
    ##  $ Pclass     : int  3 1 3 1 3 3 1 3 3 2 ...
    ##  $ Name       : chr  "Braund, Mr. Owen Harris" "Cumings, Mrs. John Bradley (Florence Briggs Thayer)" "Heikkinen, Miss. Laina" "Futrelle, Mrs. Jacques Heath (Lily May Peel)" ...
    ##  $ Sex        : chr  "male" "female" "female" "female" ...
    ##  $ Age        : num  22 38 26 35 35 NA 54 2 27 14 ...
    ##  $ SibSp      : int  1 1 0 1 0 0 0 3 0 1 ...
    ##  $ Parch      : int  0 0 0 0 0 0 0 1 2 0 ...
    ##  $ Ticket     : chr  "A/5 21171" "PC 17599" "STON/O2. 3101282" "113803" ...
    ##  $ Fare       : num  7.25 71.28 7.92 53.1 8.05 ...
    ##  $ Cabin      : chr  "" "C85" "" "C123" ...
    ##  $ Embarked   : chr  "S" "C" "S" "S" ...
    ##  $ Dataset    : chr  "train" "train" "train" "train" ...

It appears that several of these variables should be represented as factors and thus should be reclassified.

``` r
factor_variables <- c("PassengerId", "Survived", "Pclass", "Sex",
    "Embarked", "Dataset")
full[factor_variables] <- lapply(full[factor_variables], function(x) as.factor(x))
```

We are now left with the following variables:

-   **Passenger ID** : A seemingly unique number assigned to each passenger

-   **Survived** : A binary indicator of survival (0 = died, 1 = survived)

-   **Pclass** : A proxy for socio-economic status (1 = upper, 3 = lower)

-   **Name** : Passenger's Name. For wedded women, her husband's name appears first and her maiden name appears in parentheses

-   **Sex** : General indication of passenger's sex

-   **Age** : Age of passenger (or approximate age). Passengers under the age of 1 year have fractional ages

-   **SibSp** : A count of the passenger's siblings or spouses aboard

-   **Parch** : A count of the passenger's parents or siblings aboard

-   **Ticket** : The number printed on the ticket. The numbering system is not immediately apparent

-   **Fare** : The price for the ticket (presumably in pounds, shillings, and pennies)

-   **Cabin** : Cabin number occupied by the passenger (this field is quite empty)

-   **Embarked** : The port from which the passenger boarded the ship

-   **Dataset** : Whether this particular row was a part of the training or testing dataset

Feature Engineering
-------------------

### Names and Titles

At first glance, the "Name" column doesn't help too much as there are 1307 unique names, however, this column also includes embedded title information that may be of interest. I decided to use [regular expressions](https://www.rstudio.com/wp-content/uploads/2016/09/RegExCheatsheet.pdf) and the `gsub()` functions to extract the titles into a new variable.

``` r
names <- full$Name

titles <- gsub("^.*, (.*?)\\..*$", "\\1", names)

full$Titles <- titles

unique(full$Titles)
```

    ##  [1] "Mr"           "Mrs"          "Miss"         "Master"      
    ##  [5] "Don"          "Rev"          "Dr"           "Mme"         
    ##  [9] "Ms"           "Major"        "Lady"         "Sir"         
    ## [13] "Mlle"         "Col"          "Capt"         "the Countess"
    ## [17] "Jonkheer"     "Dona"

That's a bit more manageable: only 18 unique titles. Time to see how many times each title was used. I decided to make a table separated by sex.

``` r
table(full$Sex, full$Title)
```

    ##         
    ##          Capt Col Don Dona  Dr Jonkheer Lady Major Master Miss Mlle Mme
    ##   female    0   0   0    1   1        0    1     0      0  260    2   1
    ##   male      1   4   1    0   7        1    0     2     61    0    0   0
    ##         
    ##           Mr Mrs  Ms Rev Sir the Countess
    ##   female   0 197   2   0   0            1
    ##   male   757   0   0   8   1            0

It looks like Captain, Don, Dona, Jonkheer, Lady, Madame, Sir and the Countess were each only used once. I'll leave Captain separate, but the rest should be combined with similar categories.

-   **Don** : A Spanish/Portuguese/Italian title used with, but not instead of, a name.
-   **Dona** : Female version of "Don"
-   **Jonkheer** : Dutch honorific of nobility
-   **Lady** : English honorific of nobility
-   **Madame** : French, polite form of address for a woman
-   **Sir** : Honorific address (male)
-   **the Countess** : Rank of nobility (female)

It seems that most of the rarely used titles indicate some form of nobility. That's easy to check with another table comparing `Pclass` and `Titles`.

``` r
table(full$Pclass, full$Titles)
```

    ##    
    ##     Capt Col Don Dona  Dr Jonkheer Lady Major Master Miss Mlle Mme  Mr Mrs
    ##   1    1   4   1    1   6        1    1     2      5   60    2   1 159  77
    ##   2    0   0   0    0   2        0    0     0     11   50    0   0 150  55
    ##   3    0   0   0    0   0        0    0     0     45  150    0   0 448  65
    ##    
    ##      Ms Rev Sir the Countess
    ##   1   0   0   1            1
    ##   2   1   8   0            0
    ##   3   1   0   0            0

Since Don, Jonkheer, and Sir are all of similar usage, and each represent only one first-class man, I combined them into the category "Sir". Dona, Lady, Madame, and the Countess each only represent one first-class woman, so I combined them into the category "Lady". These values were substituted using the `gsub` function.

``` r
full$Titles <- gsub("Dona|Lady|Madame|the Countess", "Lady",
    full$Titles)
full$Titles <- gsub("Don|Jonkheer|Sir", "Sir", full$Titles)

unique(full$Titles)
```

    ##  [1] "Mr"     "Mrs"    "Miss"   "Master" "Sir"    "Rev"    "Dr"    
    ##  [8] "Mme"    "Ms"     "Major"  "Lady"   "Mlle"   "Col"    "Capt"

**Warning**: If you are planning to replicate the above substitution without any RegEx, make sure that you substitute "Dona" before substituting "Don"! Otherwise, "Dona" becomes "Sira" (as the "Don" part was replaced with "Sir") and your second substitution won't find or replace "Dona".

Lastly for the titles, they should be factors, not character strings.

``` r
full$Titles <- as.factor(full$Titles)
```

These titles could certainly be condensed more, but for the time being, I am going to leave them separated as is.

I have some thoughts about wanting to split up the names further to find family groups, but since many familial relationships (cousins, nieces/nephews, aunts/uncles, fiances, mistresses, in-laws, children with a nanny or close friends) aren't reported in any way in this data set, I'll have to think a little longer about the most appropriate way to find actual family groups.


``` javascript
function setTheme(){
  // this is run if there is no stored theme

  // if after 10PM or before 6AM, make dark mode
  if (currentTime < 6 || currentTime >= 22) makeDark('first')
  else makeLight('first')
}
```


``` html
<body>
  <p class="paragraph">Text</p>
</body>
```

``` css
.thing {
  background-color: red;
  color: blue;
}
```
