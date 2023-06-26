const wrapper = document.querySelector('.wrapper'),
  searchInput = wrapper.querySelector('input'),
  volume = wrapper.querySelector('.word i'),
  infoText = wrapper.querySelector('.info-text'),
  synonyms = wrapper.querySelector('.synonyms .list'),
  removeIcon = wrapper.querySelector('.search span');
let audio;
// заполнение полей на основе полученных данных с API
function data(result, word) {
  if (result.title) {
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
  } else {
    // если данные получены
    wrapper.classList.add('active');
    let definitions = result[0].meanings[0].definitions[0],
      phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
    // заполнение полей данными
    document.querySelector('.word p').innerText = result[0].word;
    document.querySelector('.word span').innerText = phontetics;
    document.querySelector('.meaning span').innerText = definitions.definition;
    document.querySelector('.example span').innerText = definitions.example;
    audio = new Audio(result[0].phonetics[0].audio);
    // если синонимов нет, то не отображать
    if (definitions.synonyms[0] == undefined) {
      synonyms.parentElement.style.display = 'none';
    } else {
      // а иначе показывать
      synonyms.parentElement.style.display = 'block';
      synonyms.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
        tag =
          i == 4
            ? (tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>`)
            : tag;
        synonyms.insertAdjacentHTML('beforeend', tag);
      }
    }
  }
}
// запрос с API
function fetchApi(word) {
  wrapper.classList.remove('active');
  infoText.style.color = '#000';
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      data(result, word);
    }) // запись данных
    .catch(() => {
      // если слово не было найдено
      infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}
// событие при нажатии на клавишу Enter
searchInput.addEventListener('keyup', (e) => {
  let word = e.target.value.replace(/\s+/g, ' ');
  if (e.key == 'Enter' && word) {
    // передача слова в запрос API
    fetchApi(word);
  }
});
// событие при нажатии на иконку воспроизведение слова
volume.addEventListener('click', () => {
  volume.style.color = '#4D59FB';
  audio.play();
  // пока идет воспроизведение слова
  setTimeout(() => {
    volume.style.color = '#999';
  }, 800);
});
// cобытие при нажатии на крестик в форме
removeIcon.addEventListener('click', () => {
  searchInput.value = '';
  searchInput.focus();
  wrapper.classList.remove('active');
  infoText.style.color = '#9A9A9A';
  infoText.innerHTML =
    'Type any existing word and press enter to get meaning, example, synonyms, etc.';
});
