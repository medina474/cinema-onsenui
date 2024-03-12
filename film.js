function getDuree(duree) {
  let heures = Math.floor(duree / 60);
  var minutes = duree % 60;

  let str = '';
  if (minutes) {
    str = `${minutes}`
  }

  if (heures) {
    str = `${heures}h` + str
  }
  else {
    str += 'm'
  }

  return str
}

async function getFilm(page) {

  const data = await fetch(`https://morseweiswlpykaugwtd.supabase.co/functions/v1/film`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcnNld2Vpc3dscHlrYXVnd3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY5NTcxMjgsImV4cCI6MjAyMjUzMzEyOH0.UV5XCINWe-Jaw6_-787Veh-LxjzUVudArvrgH6Ycf30'
      },
      body: JSON.stringify({ "film_id": page.data.id })
    });

  const film = await data.json();

  page.querySelector(".titre span")
    .appendChild(document.createTextNode(film.titre));

  if (film.annee) {
    page.querySelector(".annee")
      .appendChild(document.createTextNode(`(${film.annee})`));
  }

  if (film.slogan) {
    page.querySelector(".slogan")
      .appendChild(document.createTextNode(film.slogan));
  }

  if (film.resume) {
    page.querySelector(".resume")
      .appendChild(document.createTextNode(film.resume));
  }


  const international = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  page.querySelector(".sortie")
    .appendChild(document.createTextNode(international.format(new Date(film.sortie))));

  page.querySelector(".duree")
    .appendChild(document.createTextNode(getDuree(film.duree)));

  page.querySelector(".genres")
    .appendChild(document.createTextNode(film.genres.join(', ')));

  loadImage(`https://morseweiswlpykaugwtd.supabase.co/storage/v1/object/public/films/${page.data.id}.jpg`,
    page.querySelector("img"));

  page.data.vote_moyenne = film.vote_moyenne;
  page.data.vote_votants = film.vote_votants;

  for (let acteur of film.acteurs) {
    ons.createElement('vignette_acteur', { append: true })
      .then(function (vignette) {
        vignette.querySelector(".nom")
          .appendChild(document.createTextNode(acteur.nom));

        vignette.querySelector(".alias")
          .appendChild(document.createTextNode(acteur.alias.join(', ')));

        loadImage(`https://morseweiswlpykaugwtd.supabase.co/storage/v1/object/public/personnes/${acteur.personne_id}.jpg`,
          vignette.querySelector("img"));

        page.querySelector(".acteurs").appendChild(vignette);
      });
  }

  for (let equipe of film.equipe) {
    ons.createElement('vignette_equipe', { append: true })
      .then(function (vignette) {
        vignette.querySelector(".nom")
          .appendChild(document.createTextNode(equipe.nom));

        vignette.querySelector(".role")
          .appendChild(document.createTextNode(equipe.roles.join(', ')));

        page.querySelector(".equipe").appendChild(vignette);
      });
  }

  colorier(onsenNavigator.topPage, film.vote_moyenne)
}
