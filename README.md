# [Movie Recommendations](https://michaelf314.github.io/movie-recommendations/)

Enter your favorite movies (as IMDb URLs) in the left box. Exclude movies you've already seen by entering them (as IMDb URLs) in the right box.  If you have an IMDb list, you can export it and copy/paste the URLs.

Click "Generate recommendations", and within a few seconds, you'll see movie recommendations based on your taste.  Adjust the first parameter to make the recommendations more or less obscure (I suggest choosing a number between 1 and 2).  Adjust the second parameter to make the recommendations more or less personalized (I suggest choosing a number between 0.5 and 1).

## How does it work?

The dataset (last updated in Sept 2018) includes the favorite movies of approximately 400 people.

First we calculate a score for each person, based on how similar their taste is to yours (the second parameter controls how much these scores vary).  Then we check which movies are popular among high-similarity people, relative to their overall popularity.

For example, if 20 people like a movie, and most of them have a high similarity, it's a good recommendation.  If 30 people like a movie, but most of them have a low similarity, it's not a good recommendation.