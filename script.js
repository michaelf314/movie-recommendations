const favorites = document.querySelector('#favorites');
const exclude = document.querySelector('#exclude');
const generate = document.querySelector('#generate');
const urlsonly = document.querySelector('#urlsonly');
const obscurity = document.querySelector('#obscurity');
const balanced = document.querySelector('#balanced');
const recommendations = document.querySelector('#recommendations');

let lists = [];
let titles = {};
let myList = {};
let excludeList = {};
let unweighted = {};
let weighted = {};
let scores = [];

async function generateRecommendations() {
  if (!obscurity.value || isNaN(obscurity.value))
    obscurity.value = '1.2';
  if (!balanced.value || isNaN(balanced.value))
    balanced.value = '1';
  if (lists.length == 0) {
    await getLists();
    await getTitles();
  }
  myList = getInput(favorites);
  excludeList = getInput(exclude);
  countVotes();
  calculateScores();
  printRecommendations();
}

function url(id) {
  return 'https://www.imdb.com/title/tt'+id+'/';
}

async function getTitles() {
  let allTitles;
  await fetch('alltitles.txt').then((r) => r.text()).then((r) => allTitles = r);
  allTitles = allTitles.split(/\r?\n/);
  for (i in allTitles) {
    let pair = allTitles[i].split('|');
    titles[url(pair[0])] = pair[1];
  }
}

async function getLists() {
  let allLists;
  await fetch('alllists.txt').then((r) => r.text()).then((r) => allLists = r);
  allLists = allLists.split(/\r?\n\r?\n/);
  for (list of allLists) {
    if (list) {
      let set = new Set();
      let movies = list.split(/\r?\n/);
      for (movie of movies)
        if (movie)
          set.add(url(movie));
      lists.push(set);
    }
  }
}

function getInput(textarea) {
  let set = new Set();
  let matches = textarea.value.match(/https?:\/\/www.imdb.com\/title\/tt.{7,8}\//g);
  if (matches) {
    for (i of matches)
      set.add(i.replace('http:', 'https:'));
  }
  return set;
}

function countVotes() {
  unweighted = {};
  weighted = {};
  myListArray = [... myList];
  for (list of lists) {
    let similarity = getSimilarity(myListArray, list) ** balanced.value;
    for (movie of list) {
      if (myList.has(movie) || excludeList.has(movie))
        continue;
      if (!unweighted[movie]) {
        unweighted[movie] = 0;
        weighted[movie] = 0;
      }
      unweighted[movie]++;
      weighted[movie] += similarity;
    }
  }
}

function getSimilarity(myList, list) {
  let overlap = myList.filter(x => list.has(x)).length;
  return overlap / list.size ** Math.min(.5, .35 + .015 * myList.length);
}

function calculateScores() {
  scores = [];
  for (i in weighted)
    scores.push([i, weighted[i] ** obscurity.value / (unweighted[i]+3)]);
  scores.sort((a, b) => {
    if (a[1] == b[1]) return 0;
    if (a[1] < b[1]) return 1;
    return -1;
  });
  scores = scores.slice(0, 250);
}

function printRecommendations() {
  if (urlsonly.checked)
    recommendations.innerHTML = 'URLs';
  else
    recommendations.innerHTML = `<span>Score</span> <span>Votes</span> Title/URL`;
  for (i of scores) {
    if (i[1] == 0)
      break;
    if (urlsonly.checked) {
      recommendations.insertAdjacentHTML('beforeend', `<br>${i[0]}`);
    }
    else {
      recommendations.insertAdjacentHTML('beforeend', `<br><span>${i[1].toFixed(2)}</span> <span>${unweighted[i[0]]}</span> <a href="${i[0]}">${titles[i[0]]}</a>`);
    }
  }
}

generate.addEventListener('click', generateRecommendations);