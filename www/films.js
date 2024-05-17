'use strict';

async function getFilms(page) {
  const data = await fetch(`https://morseweiswlpykaugwtd.supabase.co/functions/v1/detail`,
    { method: "POST",
      headers: {
          "content-type": "application/json",
          apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcnNld2Vpc3dscHlrYXVnd3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY5NTcxMjgsImV4cCI6MjAyMjUzMzEyOH0.UV5XCINWe-Jaw6_-787Veh-LxjzUVudArvrgH6Ycf30' },
        body: JSON.stringify({ "personne_id": page.data.id })
    });

  const films = await data.json();

  const liste = page.querySelector("ons-list");

  for (let film of films) {
    const fragement = page.querySelector("template").content.cloneNode(true);

    fragement.querySelector(".titre")
      .appendChild(document.createTextNode(film.titre));

    fragement.querySelector(".alias")
      .appendChild(document.createTextNode(film.alias));

    if (film.annee) {
      fragement.querySelector(".annee")
        .appendChild(document.createTextNode("(" + film.annee + ")"));
    }

    fragement.querySelector(".genres")
      .appendChild(document.createTextNode(film.genres));

    fragement.querySelector(".duree")
      .appendChild(document.createTextNode(getDuree(film.duree)));

      fragement.querySelector(".resume")
      .appendChild(document.createTextNode(film.resume));
    /*fragement.querySelector(".annee")
      .appendChild(document.createTextNode(equipe.film.annee));*/

      /*
    loadImage(`https://morseweiswlpykaugwtd.supabase.co/storage/v1/object/public/films/${film.film_id}.jpg`,
      fragement.querySelector("img"));
*/

fragement.querySelector("img").src = `https://morseweiswlpykaugwtd.supabase.co/storage/v1/object/public/films/${film.film_id}.jpg`;

    fragement.firstElementChild.addEventListener("click", function (evt) {
      onsenNavigator.pushPage('film.html', {
        data: {
          title: `${film.titre}`,
          id: evt.currentTarget.dataset.uuid
        }
      });
    });
    fragement.firstElementChild.dataset.uuid = film.film_id;
    liste.appendChild(fragement);
  }
}
