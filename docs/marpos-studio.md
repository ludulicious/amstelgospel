# Onderhouden met Marpos Studio

Deze website is gemaakt voor **Marpos Studio**, de desktopeditor. Er is geen Nuxt Studio-installatie of browserlogin nodig.

## Eenmalig verbinden

1. Plaats de complete broncode (inclusief `pnpm-lock.yaml`, `content.config.ts` en `studio.preview.json`) in een eigen GitHub-repository.
2. Open Marpos Studio, verbind GitHub en kies deze repository.
3. Kies de hoofdmap van dit project als website. Laat Studio de afhankelijkheden installeren en de preview starten.
4. Open een collectie, pas de inhoud aan en controleer de preview. Publiceer via de review- en publicatiestap van Marpos Studio. Een gekoppelde hosting-build moet na de GitHub-publicatie opnieuw `pnpm generate` uitvoeren.

## Wat staat waar?

| Collectie | Bestand(en)                 | Wat je kunt aanpassen                                                            |
| --------- | --------------------------- | -------------------------------------------------------------------------------- |
| Home      | `content/home.yml`          | Koppen, intro, foto's, knoppen, concertpromotie en meezingblok                   |
| Pages     | `content/pages/*.md`        | Paginatitels, beschrijvingen, headerfoto, pagina-indeling en opgemaakte tekst    |
| Events    | `content/events/*.md`       | Concerten, begin- en einddatum, tijden, locatie, kaartverkoop en omschrijving    |
| Photos    | `content/media/photos.yml`  | Alle foto's, bijschriften, alt-teksten, categorieën en credits                   |
| Videos    | `content/media/videos.yml`  | YouTube-video-ID's, titels en voorbeeldfoto's                                    |
| Faq       | `content/faq.yml`           | Vragen en antwoorden, ook op de boekingspagina                                   |
| Site      | `content/settings/site.yml` | Navigatie, socials, contactgegevens, repetitiedetails, donatiegegevens en footer |

De pagina- en concertcollecties ondersteunen nieuwe documenten. De tekst van Markdown-documenten kan in de visuele editor of rechtstreeks als Markdown worden bewerkt. Afbeeldingsvelden hebben een media-selector. Foto's worden lokaal opgeslagen in `public/images/`.

## Nieuw concert

Maak een document in **Events**. Gebruik de datumvorm `2026-12-18` en vul bij meerdaagse concerten ook `endDate` in. Kies `public` voor publiek toegankelijke concerten of `private` voor besloten optredens. Vul een geldige volledige ticket-URL in zodra de verkoop beschikbaar is. De ticketknop verschijnt alleen bij een openbaar concert met een URL.

Een bestand `content/events/mijn-concert.md` krijgt de route `/agenda/mijn-concert`. De build neemt alle concertbestanden mee, ook concerten uit het verleden.

De homepage-concertpromotie is bewust redactioneel: pas ook het blok `concert` in **Home** aan wanneer je een volgend evenement wilt uitlichten.

## Nieuwe pagina

Maak een document in **Pages**. De standaardindeling `story` toont een kop, foto en opgemaakte tekst. Andere indelingen zijn voor de agenda, boekingen, meezingen, media, steun en FAQ. Geef een nieuwe pagina een link in de site-navigatie als bezoekers haar daar moeten vinden.

`studio.preview.json` legt voor de bestaande bestanden vast welke pagina Studio moet tonen. Voeg daar bij een afwijkende of gedeelde preview een route aan toe. Gewone nieuwe Markdown-pagina's gebruiken de prefix van hun collectie.

## Gecontroleerd

De projectinspectie van Marpos Studio herkent alle zeven collecties zonder waarschuwingen. Pagina's en concerten ondersteunen aanmaken; vaste bestanden worden op hun plek bewerkt. Voor een lokale controle:

```sh
node /pad/naar/marpos-studio/scripts/inspect-project.mjs /pad/naar/amstelgospelchoir /tmp/amstel-schema.json
```

Een automatische inspectie bevestigt het contentcontract; de uiteindelijke GitHub-verbinding wordt in jouw Marpos Studio-account gemaakt.
