# Onderhouden met Marpos Studio

Deze website is gemaakt voor **Marpos Studio**, de desktopeditor. Er is geen Nuxt Studio-installatie of browserlogin nodig.

## Eenmalig verbinden

1. Plaats de complete broncode (inclusief `pnpm-lock.yaml`, `content.config.ts` en `studio.preview.json`) in een eigen GitHub-repository.
2. Open Marpos Studio, verbind GitHub en kies deze repository.
3. Kies de hoofdmap van dit project als website. Laat Studio de afhankelijkheden installeren en de preview starten.
4. Open een collectie, pas de inhoud aan en controleer de preview. Publiceer via de review- en publicatiestap van Marpos Studio. Een gekoppelde hosting-build moet na de GitHub-publicatie opnieuw `pnpm generate` uitvoeren.

## Menu

Bewerk alle desktop-, mobiele en footerlinks in **Menu** (`content/1.home/2.menu.md`). Elk item heeft een naam (`label`), bestemming (`to`), Lucide-icoon (`icon`), zichtbaarheid (`visible`) en meerdere `placements`: `desktop`, `mobile`, `footer`. Kies één of meer plekken. De lijstvolgorde bepaalt de volgorde per plek. `external: true` opent een link veilig in een nieuw tabblad.

De actieknop heeft eigen velden onder `action`: label, bestemming, icoon, zichtbaarheid, placements en external. In de footer gebruikt de ronde actieknop hetzelfde label en icoon. Footertekst en contactgegevens blijven in **Site**.

## Wat staat waar?

De contentmappen hebben een nummerprefix voor de volgorde: Home, Information, Events, Photos, Videos, Faq en Settings. Elke map heeft een `.navigation.yml` met een titel en Lucide-icoon, zoals in de portal-documentatie. Iconen voor de collectiemappen staan uitsluitend in deze navigatiebestanden. De nummers veranderen de publieke pagina-adressen niet.

| Sectie in Studio        | Bestand(en)                   | Wat je kunt aanpassen                                                                   |
| ----------------------- | ----------------------------- | --------------------------------------------------------------------------------------- |
| Pages → Home            | `content/1.home/1.home.md`    | Koppen, intro, foto's, knoppen, meezingblok en zichtbaarheid van alle homepageblokken   |
| Pages → Home Concert    | `content/1.home/3.concert.md` | Concertpromotie in Markdown, titel, afbeelding, label en knop                           |
| Pages → Settings → Site | `content/7.settings/site.yml` | Socials, contactgegevens, repetities, donaties en footer                                |
| Information             | `content/2.information/*.md`  | Paginatitels, taglines, beschrijvingen, headerfoto, indeling en opgemaakte tekst        |
| Events                  | `content/3.events/*.md`       | Concerten, datums, tijden, locatie, kaartverkoop en omschrijving                        |
| Photos                  | `content/4.photos/*.yml`      | Eén foto per document: titel, afbeelding, alt-tekst, categorieën, credit en volgorde    |
| Videos                  | `content/5.videos/*.yml`      | Eén video per document: titel, YouTube-ID, voorbeeldfoto, categorieën en volgorde       |
| Faq                     | `content/6.faq/*.yml`         | Eén vraag per document: vraag, antwoord, volgorde en zichtbaarheid op de boekingspagina |

Studio groepeert collecties met één vast bestand automatisch onder **Pages**. De vorige Markdown-collectie heette óók Pages en stond in de map `content/pages/`; daardoor verschenen twee gelijknamige secties. De Markdown-collectie en map heten nu **Information**. Dit verandert de publieke pagina-adressen niet. Home en Site blijven vaste bestanden; alle herhaalbare inhoud heeft een eigen collectie.

De pagina- en concertcollecties ondersteunen nieuwe documenten. De tekst van Markdown-documenten kan in de visuele editor of rechtstreeks als Markdown worden bewerkt. Afbeeldingsvelden hebben een media-selector. Foto's worden lokaal opgeslagen in `public/images/`.

## Nieuw concert

Maak een document in **Events**. Vul `schedule` in met één of meer datum/tijd-items. Nieuwe documenten beginnen met één item. Gebruik de datumvorm `2026-12-18` en vul altijd een tijd in, bijvoorbeeld `20.00 uur`. Voeg voor meerdere optredens extra items toe, ook als ze op dezelfde dag zijn. Het kerstconcert heeft drie items: 18 december om 20.00 uur en 19 december om 14.00 en 20.00 uur. Een evenement blijft bij Binnenkort totdat de laatste datum voorbij is. Alle datums en tijden verschijnen in de agenda en op de detailpagina. Kies `public` voor publiek toegankelijke concerten of `private` voor besloten optredens. Vul een geldige volledige ticket-URL in zodra de verkoop beschikbaar is. De ticketknop verschijnt alleen bij een openbaar concert met een URL.

Een bestand `content/3.events/mijn-concert.md` krijgt de route `/agenda/mijn-concert`. De build neemt alle concertbestanden mee, ook concerten uit het verleden.

Concerten kunnen een afbeelding (`image.src` en `image.alt`) of een videobestand (`video.src`) krijgen via de media-selector. Beide velden zijn optioneel. Als beide zijn ingevuld, toont de concertpagina de video met afspeelbediening in de header. Gebruik bijvoorbeeld een MP4-bestand; de video speelt niet automatisch af. Zonder video wordt de afbeelding getoond.

## Homepageblokken tonen of verbergen

Open **Home** en gebruik de ja/nee-velden onder `visibility`: `concert` (concertpromotie), `hero` (introductie), `strip` (muziekstrook), `about` (over het koor), `agenda` en `join` (meezingen). Zet een veld op `false` om dat blok te verbergen; de inhoud blijft bewaard. Zet het op `true` om het weer te tonen.

Bewerk de homepageconcertpromotie in **Home Concert** (`content/1.home/3.concert.md`). De tekst onder de frontmatter is Markdown en ondersteunt alinea's, nadruk, links en lijsten. Titel, omschrijving, datumregel (`eyebrow`), foto, fotolabel en knop staan in de velden erboven. Dit document heeft de homepage als preview en maakt geen losse publieke pagina.

Zet na de concerten `visibility.concert` in **Home** op `false`. De introductie wordt dan de eerste sectie; de paginatitel, omschrijving en social-afbeelding gebruiken de algemene homepagegegevens. Je hoeft de concerttekst niet te verwijderen. Werk voor een volgend concert de Markdownpromotie en de bijbehorende agendapagina apart bij.

## Nieuwe pagina

Maak een document in **Information**. `title` is de paginanaam (bijvoorbeeld Agenda) en wordt gebruikt in het browsertabblad. `tagline` is de grote zichtbare hoofdkop op de pagina (bijvoorbeeld Daar wil je bij zijn.). Zonder tagline gebruikt de hoofdkop de titel. Ook concertdetails ondersteunen een optionele `tagline`. De standaardindeling `story` toont een kop, foto en opgemaakte tekst. Andere indelingen zijn voor de agenda, boekingen, meezingen, media, steun en FAQ. Geef een nieuwe pagina een link in de site-navigatie als bezoekers haar daar moeten vinden.

`studio.preview.json` legt voor de bestaande bestanden vast welke pagina Studio moet tonen. Voeg daar bij een afwijkende of gedeelde preview een route aan toe. Gewone nieuwe Markdown-pagina's gebruiken de prefix van hun collectie.

## Foto's, categorieën, video's en vragen

Maak elk item als een afzonderlijk document in zijn collectie. Het veld `order` bepaalt de volgorde op de website: lagere getallen komen eerst, gelijke getallen worden op document-ID gesorteerd. Bestaande items hebben oplopende getallen; pas deze aan om items te verplaatsen.

Voeg categorieën rechtstreeks toe aan het veld `categories` in **Photos** of **Videos**. Dit is een lijst met vrij in te vullen namen, bijvoorbeeld `Concerten` en `Repetities`; elk item kan meerdere categorieën hebben. Gebruik dezelfde naam om items samen te groeperen. De website maakt de filterknoppen automatisch uit de gebruikte namen, in volgorde van hun eerste voorkomen. Een lege lijst toont het item alleen bij **Alles**. Er is geen aparte categoriecollectie.

Een video gebruikt het elf tekens lange YouTube-ID, niet de complete URL. Afbeeldingen en alt-teksten blijven via de media-velden aanpasbaar.

Bij een FAQ-document is `title` de vraag en `content` het antwoord. Alle vragen verschijnen op de FAQ-pagina. Zet `showOnBooking` aan voor vragen die ook op de boekingspagina moeten staan.

Bestaande documenten hebben expliciete preview-adressen in `studio.preview.json`. Studio kan voor nieuwe gedeelde documenten de gebruikende pagina afleiden; kies zo nodig **Set preview page** of voeg een expliciete mapping toe. Foto's en video's gebruiken `/kijk-en-luister`; vragen gebruiken `/veelgestelde-vragen` en `/boeken`.

## Gecontroleerd

De projectinspectie van Marpos Studio herkent alle negen collecties zonder waarschuwingen. Pagina's, concerten, foto's, video's en vragen ondersteunen aanmaken; vaste bestanden worden op hun plek bewerkt. Voor een lokale controle:

```sh
node /pad/naar/marpos-studio/scripts/inspect-project.mjs /pad/naar/amstelgospelchoir /tmp/amstel-schema.json
```

Een automatische inspectie bevestigt het contentcontract; de uiteindelijke GitHub-verbinding wordt in jouw Marpos Studio-account gemaakt.

Gedeelde paginacopy (zijblokken, galerijen, agenda, formulieren en navigatielabels) staat in `content/7.settings/interface.md`. Laat placeholders zoals `{count}`, `{minimum}` en `{phone}` intact.

## Steun ons bewerken

Alle steunopties, teksten, rekeninggegevens en links staan in `content/2.information/7.steun-ons.md`. Bewerk de koppen, alinea's en Markdown-links rechtstreeks op deze pagina. `support-options` behoudt de kaartindeling; elk `support-option`-blok is één kaart. Pas `number` aan voor het kaartnummer. Je kunt kaarten toevoegen, verwijderen of verplaatsen. Hiervoor zijn geen wijzigingen in Interface teksten of Site settings nodig.
