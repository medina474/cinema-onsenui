let listedesacteurs = [];
let listefiltree = [];
let liste;

function searchActeurs(evt) {
  console.log(metaphone(evt.srcElement.value));
  listefiltree = listedesacteurs.filter(elt => elt.metaphone.includes(metaphone(evt.srcElement.value)))
  liste.refresh()
}


async function getPersonnes(page) {
  const data = await fetch('https://morseweiswlpykaugwtd.supabase.co/rest/v1/acteurs?select=*',
    { headers: { apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcnNld2Vpc3dscHlrYXVnd3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY5NTcxMjgsImV4cCI6MjAyMjUzMzEyOH0.UV5XCINWe-Jaw6_-787Veh-LxjzUVudArvrgH6Ycf30' } });
  
    listedesacteurs = await data.json();
  listefiltree = listedesacteurs.filter(p => true);
  /*
  listedesacteurs = personnes.filter(p => true)
    .sort((a, b) => a.nationalite.localeCompare(b.nationalite));
  */
  
  liste = page.querySelector("ons-lazy-repeat")

  /*
  for (const index in listefiltree) {
    liste.appendChild(createItemActeur(index))
    const img = document.createElement("img")
    img.className = "list-item__thumbnail"
    img.addEventListener("error", function() { img.setAttribute("src", "_inconnu.jpg")})
    liste.lastElementChild.querySelector(".left").appendChild(img)
  }
  */

  liste.delegate = {
    countItems: () => listefiltree.length,
    createItemContent: createItemActeur
  }
}

function createItemActeur(index) {

  const personne = listefiltree[index];

  const modele = document.querySelector("#item_acteur");
  const fragement = modele.content.cloneNode(true).firstElementChild;

  fragement.querySelector(".nom")
    .appendChild(document.createTextNode(personne.nom));

  fragement.querySelector(".nbFilm")
    .appendChild(document.createTextNode(personne.nb_film));

  if (personne.drapeau_unicode) {
    let p = document.createElement("img");
    p.src = `flags/${personne.drapeau_unicode}.png`
    fragement.querySelector(".pays")
      .appendChild(p)
  }

  fragement.querySelector(".list-item__thumbnail").src = `https://morseweiswlpykaugwtd.supabase.co/storage/v1/object/public/personnes/${personne.personne_id}.jpg`

  const international = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long"
  });

  let naissance = new Date(personne.naissance)
  let naissanceformat = international.format(naissance);

  fragement.querySelector(".naissance")
    .appendChild(document.createTextNode(naissanceformat));

  // court-circuit &&
  personne.deces && fragement.querySelector(".deces")
    .appendChild(document.createTextNode(
      international.format(new Date(personne.deces))));

  fragement.addEventListener("click", function (evt) {
    onsenNavigator.pushPage('films.html', {
      data: {
        title: `${personne.nom}`,
        id: evt.currentTarget.dataset.uuid
      }
    });
  });

  fragement.dataset.uuid = personne.personne_id;
  //liste.appendChild(fragement);
  return fragement;
}
