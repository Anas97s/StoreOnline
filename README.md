|--------------------------------------|
|    English version is below!!        |
|--------------------------------------|

Willkommen im Repository für meine Parfüm-Website, eine vollständige Webanwendung, die die Verwaltung und Präsentation einer Parfümsammlung ermöglicht. 
Dieses Projekt umfasst sowohl die Frontend- als auch die Backend-Komponenten und bietet ein vollständiges Erlebnis von der Benutzerinteraktion bis zur Datenverwaltung.

**Überblick**
Diese Webanwendung bietet eine benutzerfreundliche Oberfläche zum Hinzufügen, Bearbeiten und Verwalten von Parfüms. Darüber hinaus unterstützt sie die Benutzerregistrierung und Anmeldefunktionalität. 
Die Integration des Zahlungssystems über Stripe zeigt einen Dummy-Zahlungsprozess, der aus Sicherheitsgründen deaktiviert wurde.

**Funktionen**

---Frontend---

- Verwendete Technologien: HTML, JavaScript
-Funktionalität:
 -Benutzerregistrierung und -anmeldung
 -Durchsuchen von Parfüms
 -Hinzufügen neuer Parfüms zur Sammlung (es muss als Admin angemeldet sein)
 -Bearbeiten bestehender Parfümdetails (es muss als Admin angemeldet sein)
 -Responsives Design für ein nahtloses Erlebnis auf verschiedenen Geräten

---Backend---
-Verwendete Technologien: Node.js
-Funktionalität:
 -API-Endpunkte für die Benutzerauthentifizierung
 -Operationen zur Verwaltung von Parfüm- bzw. Nutzerdaten
 -Dummy-Zahlungsintegration mit Stripe (deaktiviert aus Sicherheitsgründen)


**Voraussetzungen**
-Node.js auf Ihrem Computer installiert
-Grundkenntnisse in HTML, JavaScript und Node.js

----------------------------------------------
**Ordnerstruktur**

-frontEnd/: Enthält alle HTML-Dateien 
-frontEnd/assets/js: Enthält alle JavaScript-Dateien
-frontEnd/assets/css: Enthält alle CSS-Dateien 

-backEnd/base: Enthält alle Erstellungsdatein (Nutzer, Parfüm, Bestellung, Databank und Routes)
-backEnd/middelware: Enthält alle Authentifizierungsdatein (Admin und Nutzer)
-backEnd/routes: Enthält alle API-datein (POST, GET, PUT und DELETE methoden)
-backEnd/tabels: Enthält alle Tabellensdatein (alle notwendige Tabellen)
-backEnd/index.js: Hauptserverdatei


**Installation**
1-Repository klonen:
git clone https://github.com/Anas97s/StoreOnline.git

cd StoreOnline/backEnd

2-Server starten (mithilfe von nodemon):
nodemon index.js


3-Öffnen Sie Ihren Webbrowser und navigieren Sie zu http://localhost:5502

-------------------------------------------------------------

**Funktionsdetails**

-Benutzerregistrierung und -anmeldung:
Benutzer können sich mit ihrer E-Mail und einem Passwort registrieren. Nach der Registrierung können sie sich anmelden, um personalisierte Funktionen wie z.B. der Bestellungsverlauf zu sehen.

-Parfümverwaltung:
Angemeldete als Adminbenutzer können neue Parfüms zur Sammlung hinzufügen und dabei Details wie Name, Marke und Beschreibung angeben. Sie können auch bestehende Parfüms bearbeiten oder aus der Sammlung löschen.

-Dummy-Zahlungssystem:
Ein Dummy-Zahlungsprozess wurde mit Stripe integriert, um zu demonstrieren, wie Zahlungen abgewickelt werden könnten. Aus Sicherheitsgründen ist diese Funktion derzeit deaktiviert. Der Zweck besteht ausschließlich darin, die Implementierung zu zeigen.


Vielen Dank, dass Sie sich mein Parfüm-Website-Projekt ansehen. Ich hoffe, diese README bietet ein klares Verständnis der Anwendung und wie man damit beginnt. Wenn Sie Fragen oder Feedback haben, können Sie sich gerne melden!

|----------------------------------------------------------------------------------------------------------------------------|
|                                           English                                                                          |
|----------------------------------------------------------------------------------------------------------------------------|

Welcome to the repository for my perfume website, a complete web application that enables the management and presentation of a perfume collection. 
This project includes both frontend and backend components, offering a comprehensive experience from user interaction to data management.

**Overview**
This web application offers a user-friendly interface for adding, editing, and managing perfumes. Additionally, it supports user registration and login functionality. 
The payment system integration via Stripe demonstrates a dummy payment process, which has been disabled for security reasons.

**Features**
-Frontend:
  -Technologies Used: HTML, JavaScript
-Functionality:
 -User registration and login
 -Browsing perfumes
 -Adding new perfumes to the collection (admin login required)
 -Editing existing perfume details (admin login required)
 -Responsive design for a seamless experience across different devices

-Backend
 -Technologies Used: Node.js
Functionality:
 -API endpoints for user authentication
 -Operations for managing perfume and user data
 -Dummy payment integration with Stripe (disabled for security reasons)


**Prerequisites**
-Node.js installed on your computer
-Basic knowledge of HTML, JavaScript, and Node.js
------------------------------------------------------

**Folder Structure**
-frontEnd/: Contains all HTML files
-frontEnd/assets/js: Contains all JavaScript files
-frontEnd/assets/css: Contains all CSS files

-backEnd/base: Contains all creation files (user, perfume, order, database, and routes)
-backEnd/middleware: Contains all authentication files (admin and user)
-backEnd/routes: Contains all API files (POST, GET, PUT, and DELETE methods)
-backEnd/tables: Contains all table files (all necessary tables)
-backEnd/index.js: Main server file


**Installation**
1-Clone the repository:
git clone git clone https://github.com/Anas97s/StoreOnline.git

cd StoreOnline/backEnd

2-Start the server (using nodemon):
nodemon index.js

3-Open your web browser and navigate to:
http://localhost:5502

**Functionality Details**
-User Registration and Login:
Users can register with their email and a password. After registration, they can log in to access personalized features, such as viewing their order history.

-Perfume Management:
Logged-in admin users can add new perfumes to the collection, providing details such as name, brand, and description. They can also edit existing perfumes or delete them from the collection.

-Dummy Payment System:
A dummy payment process has been integrated using Stripe to demonstrate how payments could be handled. For security reasons, this feature is currently disabled. The purpose is solely to showcase the implementation.

Thank you for checking out my perfume website project. I hope this README provides a clear understanding of the application and how to get started with it. If you have any questions or feedback, please feel free to reach out!
