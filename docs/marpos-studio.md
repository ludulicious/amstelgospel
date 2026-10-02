# Onderhouden met Marpos Studio

Deze website is gemaakt voor **Marpos Studio**, de desktopeditor. Er is geen Nuxt Studio-installatie of browserlogin nodig.

## Eenmalig verbinden

1. Plaats de complete broncode (inclusief `pnpm-lock.yaml`, `content.config.ts` en `studio.preview.json`) in een eigen GitHub-repository.
2. Open Marpos Studio, verbind GitHub en kies deze repository.
3. Kies de hoofdmap van dit project als website. Laat Studio de afhankelijkheden installeren en de preview starten.
4. Open een collectie, pas de inhoud aan en controleer de preview. Publiceer via de review- en publicatiestap van Marpos Studio. Een gekoppelde hosting-build moet na de GitHub-publicatie opnieuw `pnpm generate` uitvoeren.

## Wat staat waar?

| Sectie in Studio        | Bestand(en)                 | Wat je kunt aanpassen                                                                   |
| ----------------------- | --------------------------- | --------------------------------------------------------------------------------------- |
| Pages → Home            | `content/home.yml`          | Koppen, intro, foto's, knoppen, concertpromotie en meezingblok                          |
| Pages → Settings → Site | `content/settings/site.yml` | Navigatie, socials, contactgegevens, repetities, donaties en footer                     |
| Information             | `content/information/*.md`  | Paginatitels, beschrijvingen, headerfoto, indeling en opgemaakte tekst                  |
| Events                  | `content/events/*.md`       | Concerten, datums, tijden, locatie, kaartverkoop en omschrijving                        |
| Photos                  | `content/photos/*.yml`      | Eén foto per document: titel, afbeelding, alt-tekst, categorieën, credit en volgorde    |
| Videos                  | `content/videos/*.yml`      | Eén video per document: titel, YouTube-ID, voorbeeldfoto, categorieën en volgorde       |
| Faq                     | `content/faq/*.yml`         | Eén vraag per document: vraag, antwoord, volgorde en zichtbaarheid op de boekingspagina |

Studio groepeert collecties met één vast bestand automatisch onder **Pages**. De vorige Markdown-collectie heette óók Pages en stond in de map `content/pages/`; daardoor verschenen twee gelijknamige secties. De Markdown-collectie en map heten nu **Information**. Dit verandert de publieke pagina-adressen niet. Home en Site blijven vaste bestanden; alle herhaalbare inhoud heeft een eigen collectie.

De pagina- en concertcollecties ondersteunen nieuwe documenten. De tekst van Markdown-documenten kan in de visuele editor of rechtstreeks als Markdown worden bewerkt. Afbeeldingsvelden hebben een media-selector. Foto's worden lokaal opgeslagen in `public/images/`.

## Nieuw concert

Maak een document in **Events**. Gebruik de datumvorm `2026-12-18` en vul bij meerdaagse concerten ook `endDate` in. Kies `public` voor publiek toegankelijke concerten of `private` voor besloten optredens. Vul een geldige volledige ticket-URL in zodra de verkoop beschikbaar is. De ticketknop verschijnt alleen bij een openbaar concert met een URL.

Een bestand `content/events/mijn-concert.md` krijgt de route `/agenda/mijn-concert`. De build neemt alle concertbestanden mee, ook concerten uit het verleden.

De homepage opent met het concertblok. Deze concertpromotie is bewust redactioneel: pas ook het blok `concert` in **Home** aan wanneer je een volgend evenement wilt uitlichten.

## Nieuwe pagina

Maak een document in **Information**. De standaardindeling `story` toont een kop, foto en opgemaakte tekst. Andere indelingen zijn voor de agenda, boekingen, meezingen, media, steun en FAQ. Geef een nieuwe pagina een link in de site-navigatie als bezoekers haar daar moeten vinden.

`studio.preview.json` legt voor de bestaande bestanden vast welke pagina Studio moet tonen. Voeg daar bij een afwijkende of gedeelde preview een route aan toe. Gewone nieuwe Markdown-pagina's gebruiken de prefix van hun collectie.

## Foto's, categorieën, video's en vragen

Maak elk item als een afzonderlijk document in zijn collectie. Het veld `order` bepaalt de volgorde op de website: lagere getallen komen eerst, gelijke getallen worden op document-ID gesorteerd. Bestaande items hebben oplopende getallen; pas deze aan om items te verplaatsen.

Voeg categorieën rechtstreeks toe aan het veld `categories` in **Photos** of **Videos**. Dit is een lijst met vrij in te vullen namen, bijvoorbeeld `Concerten` en `Repetities`; elk item kan meerdere categorieën hebben. Gebruik dezelfde naam om items samen te groeperen. De website maakt de filterknoppen automatisch uit de gebruikte namen, in volgorde van hun eerste voorkomen. Een lege lijst toont het item alleen bij **Alles**. Er is geen aparte categoriecollectie.

Een video gebruikt het elf tekens lange YouTube-ID, niet de complete URL. Afbeeldingen en alt-teksten blijven via de media-velden aanpasbaar.

Bij een FAQ-document is `title` de vraag en `content` het antwoord. Alle vragen verschijnen op de FAQ-pagina. Zet `showOnBooking` aan voor vragen die ook op de boekingspagina moeten staan.

Bestaande documenten hebben expliciete preview-adressen in `studio.preview.json`. Studio kan voor nieuwe gedeelde documenten de gebruikende pagina afleiden; kies zo nodig **Set preview page** of voeg een expliciete mapping toe. Foto's en video's gebruiken `/kijk-en-luister`; vragen gebruiken `/veelgestelde-vragen` en `/boeken`.

## Gecontroleerd

De projectinspectie van Marpos Studio herkent alle zeven collecties zonder waarschuwingen. Pagina's, concerten, foto's, video's en vragen ondersteunen aanmaken; vaste bestanden worden op hun plek bewerkt. Voor een lokale controle:

```sh
node /pad/naar/marpos-studio/scripts/inspect-project.mjs /pad/naar/amstelgospelchoir /tmp/amstel-schema.json
```

Een automatische inspectie bevestigt het contentcontract; de uiteindelijke GitHub-verbinding wordt in jouw Marpos Studio-account gemaakt.
